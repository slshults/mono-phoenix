defmodule MonoPhoenixV01Web.SearchmenBarLive do
  use MonoPhoenixV01Web, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, 
      search_results: [],
      search_query: "",
      active_requests: MapSet.new(),
      async_metadata: %{}
    )}
  end

  ## socket assigns

  @impl true
  def handle_event("search", %{"search" => %{"query" => search_query}}, socket) do
    search_results =
      if search_query == "" do
        []
      else
        MonoPhoenixV01Web.SearchmenBar.get_all(search_query)
      end

    {:noreply, assign(socket, search_results: search_results, search_query: search_query)}
  end

  @impl true
  def handle_info({:search, search_value}, socket) do
    # Call get_all/1 to get search results
    search_results = MonoPhoenixV01Web.SearchmenBar.get_all(search_value)

    # Update the searchmen_bar assign with the search results
    socket = assign(socket, searchmen_bar: search_results)

    push_event(socket, "search", %{search_value: search_value})
    {:noreply, socket}
  end

  # Handle summary icon click events
  @impl true
  def handle_event("show_play_summary", %{"play-title" => play_title}, socket) do
    request_key = "play_summary:#{play_title}"
    
    # Check if this request is already in progress
    active_requests = Map.get(socket.assigns, :active_requests, MapSet.new())
    if MapSet.member?(active_requests, request_key) do
      # Request already in progress - ignore duplicate click
      {:noreply, socket}
    else
      # Show the modal first
      send_update(MonoPhoenixV01Web.SummaryModalComponent, 
        id: "summary-modal", 
        action: "show_play_summary", 
        play_title: play_title
      )
      
      # Track this request and start the content generation
      active_requests = MapSet.put(active_requests, request_key)
      send(self(), {:generate_summary, "play_summary", %{play_title: play_title}, "summary-modal", request_key})
      
      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end

  @impl true
  def handle_event("show_scene_summary", %{"play-title" => play_title, "location" => location}, socket) do
    request_key = "scene_summary:#{play_title}:#{location}"
    
    active_requests = Map.get(socket.assigns, :active_requests, MapSet.new())
    if MapSet.member?(active_requests, request_key) do
      {:noreply, socket}
    else
      send_update(MonoPhoenixV01Web.SummaryModalComponent, 
        id: "summary-modal", 
        action: "show_scene_summary", 
        play_title: play_title,
        location: location
      )
      
      active_requests = MapSet.put(active_requests, request_key)
      send(self(), {:generate_summary, "scene_summary", %{play_title: play_title, location: location}, "summary-modal", request_key})
      
      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end

  @impl true  
  def handle_event("show_paraphrasing", %{"monologue-id" => monologue_id, "monologue-text" => monologue_text, "character" => character, "play-title" => play_title}, socket) do
    request_key = "paraphrasing:#{monologue_id}"
    
    active_requests = Map.get(socket.assigns, :active_requests, MapSet.new())
    if MapSet.member?(active_requests, request_key) do
      {:noreply, socket}
    else
      send_update(MonoPhoenixV01Web.SummaryModalComponent, 
        id: "summary-modal", 
        action: "show_paraphrasing", 
        monologue_id: monologue_id,
        monologue_text: monologue_text,
        character: character
      )
      
      active_requests = MapSet.put(active_requests, request_key)
      send(self(), {:generate_summary, "paraphrasing", %{monologue_id: monologue_id, monologue_text: monologue_text, character: character, play_title: play_title}, "summary-modal", request_key})
      
      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end

  # Handle summary generation events using async processing to avoid blocking
  @impl true
  def handle_info({:generate_summary, content_type, params, component_id, request_key}, socket) do
    # Start async task to avoid blocking the LiveView process
    socket = start_async(socket, request_key, fn ->
      case content_type do
        "play_summary" ->
          MonoPhoenixV01.AnthropicService.get_play_summary(params.play_title)
        "scene_summary" ->
          MonoPhoenixV01.AnthropicService.get_scene_summary(params.play_title, params.location)
        "paraphrasing" ->
          MonoPhoenixV01.AnthropicService.get_monologue_paraphrasing(params.monologue_id, params.monologue_text)
      end
    end)
    
    # Store metadata for the async result handler
    socket = assign(socket, 
      async_metadata: Map.put(socket.assigns[:async_metadata] || %{}, request_key, %{
        content_type: content_type,
        component_id: component_id,
        request_key: request_key
      })
    )
    
    {:noreply, socket}
  end

  # Handle async results
  @impl true
  def handle_async(request_key, {:ok, api_result}, socket) do
    metadata = socket.assigns.async_metadata[request_key]
    
    case api_result do
      {:ok, %{content: content, id: record_id}} ->
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "content_generated", 
          content: content,
          record_id: record_id
        )
      {:ok, content} when is_binary(content) ->
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "content_generated", 
          content: content
        )
      {:error, reason} ->
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "error_occurred", 
          error: reason
        )
    end
    
    # Clean up metadata and active requests  
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
  end

  @impl true
  def handle_async(request_key, {:error, reason}, socket) do
    metadata = socket.assigns.async_metadata[request_key]
    
    case reason do
      %{reason: :cancelled} ->
        # Handle cancellation gracefully without showing error
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "generation_cancelled"
        )
      _ ->
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "error_occurred", 
          error: "API call failed unexpectedly"
        )
    end
    
    # Clean up metadata and active requests  
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
  end

  # Handle async task cancellation via exit
  @impl true
  def handle_async(request_key, {:exit, reason}, socket) do
    require Logger
    Logger.info("User confirmed cancellation - stopping generation")
    
    metadata = socket.assigns.async_metadata[request_key]
    
    # Handle cancellation gracefully
    send_update(MonoPhoenixV01Web.SummaryModalComponent, 
      id: metadata.component_id, 
      action: "generation_cancelled"
    )
    
    # Clean up metadata and active requests  
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
  end

  # Handle cancellation requests from modal
  @impl true  
  def handle_info({:cancel_generation, component_id}, socket) do
    require Logger
    Logger.info("Cancelling generation for component: #{component_id}")
    
    # Cancel all active async tasks - but don't clean up metadata yet
    # Let the async handlers clean up when they receive the cancellation
    socket = Enum.reduce(socket.assigns.async_metadata, socket, fn {request_key, metadata}, acc_socket ->
      if metadata.component_id == component_id do
        # Cancel the async task - cleanup will happen in handle_async
        cancel_async(acc_socket, request_key)
      else
        acc_socket
      end
    end)
    
    {:noreply, socket}
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~H"""
      <%= render_search_form(assigns) %> <%!-- added --%>
      <%= render_searchmen_bar(assigns) %>
      <.live_component module={MonoPhoenixV01Web.SummaryModalComponent} id="summary-modal" />
    """
  end

  ## render the search form
  defp render_search_form(assigns) do
    ~H"""
    <div class="search-box-dark search-box-default accent-font monologue-list">
      <%= form_for :search, "#", [phx_submit: "search", phx_change: "search",
      class: "search-box-dark search-box-default",phx_page_loading: :prevent], fn f -> %>
        <%= label f, :query, "" %>

        <%= text_input f, :query,
          value: Map.get(assigns, :search_query, ""),
          placeholder: "Search for monologues...",
          class: "search-box-dark search-box-default input-group accent-font form-control monologue-list",
          phx_input: "search_input",
          phx_debounce: "240"
          %>
      <% end %>
    </div>
    """
  end

  ## render the search results
  def render_searchmen_bar(assigns) do
    ~H"""
    <div class="search-box-dark search-box-default center-this monologue-list">
      <table class="monologue-list">
        <tbody>
        <%= if !is_nil(@search_results) do %>
          <%= if length(@search_results) > 0 do %>
            <!-- begin results heading, text, and body toggle -->
            <h3>Search results from all the plays...</h3>
            <span style="font-size:11px">
            Click on the 1st line, under the character's name, to see the full monologue.<br/><a
              href="#"
              data-toggle="collapse"
              data-target=".multi-collapse"
              id="toggle-button"
            ><img
                src="/images/ExpandAll.png"
                id="toggle-image"
                style="background-color: #F9F9DF; border-radius: 5px;"
                alt="👆 Click to toggle text of all monologues on the page.
            Reload the page to reset the toggle."
                title="👆 Click to toggle the text of all monologues on the page.
            Reload the page to reset the toggle."
              /></a>
            </span>
            <!-- end results heading, text, and body toggle -->
          <% end %>
        <%= for {row, index} <- Enum.with_index(@search_results) do %>

            <tr class="monologue_list">
              <td class={if rem(index, 2) == 0, do: "even", else: "odd"}>
                <span class="monologue-playname" alt="👆 Click to view all the men's monologues from this play"
                title="👆 Click to view all the men's monologues from this play"><%= link to: "/men/#{row.play_id}", method: :get do %><%= row.play %><% end %></span><span class="summary-icon" 
                      phx-click="show_play_summary" 
                      phx-value-play-title={row.play}
                      title="Show play summary">
                  <img src={Routes.static_path(@socket, "/images/scroll-summary-icon.svg")} alt="Play summary" />
                </span>&nbsp; &middot; <span class="monologue-actscene" alt="👆 Click here to read the whole scene. This link jumps you to the monologue, scroll up to read from the top of the scene."
                                title="👆 Click here to read the whole scene. This link jumps you to the monologue, scroll up to read from the top of the scene."><%= link to: raw(row.scene), method: :get, target: "_blank" do %><%= row.location %><% end %></span><span class="summary-icon" 
                      phx-click="show_scene_summary" 
                      phx-value-play-title={row.play}
                      phx-value-location={row.location}
                      title="Show scene summary">
                  <img src={Routes.static_path(@socket, "/images/scroll-summary-icon.svg")} alt="Scene summary" />
                </span>&nbsp; &middot;
                <span class="monologue-actscene"><%= row.style %></span>
                <br />
                <span class="monologue-character" alt="This is the name of the character who speaks this monologue." title="This is the name of the character who speaks this monologue."><%= row.character %></span>
                <br />
                <div
                class="monologue-firstline-table"
                alt="👆 Click to hide or display the full monologue"
                title="👆 Click to hide or display the full monologue"
                data-toggle="collapse"
                data-target={"#collapse-#{index}"}
                >
                  <%= row.firstline %>
                </div>

                <div
                class="collapse multi-collapse monologue-show"
                id={"collapse-#{index}"}
                >
                  <br />
                  <%= raw(row.body) %>&nbsp;
                  <span class="summary-icon" 
                        phx-click="show_paraphrasing" 
                        phx-value-monologue-id={row.monologues}
                        phx-value-monologue-text={row.body}
                        phx-value-character={row.character}
                        phx-value-play-title={row.play}
                        title="Show modern paraphrasing">
                    <img src={Routes.static_path(@socket, "/images/thinking-paraphrase-icon.svg")} alt="Modern paraphrasing" />
                  </span>&nbsp;
                  <%= link to: raw(row.pdf), method: :get, target: "_blank", rel: "noopener" do %>
                  <img
                  src={Routes.static_path(@socket, "/images/pdf_file_icon_16x16.png")}
                  alt="Click for a double-spaced PDF of this monologue"
                  title="Click for a double-spaced PDF of this monologue"
                  class="monologue-pdflink"
                />
                  <% end %>
                </div>
              </td>
            </tr>
          <% end %>
          <% end %>
        </tbody>
      </table>
    </div>
    <script>
    const toggleButton = document.getElementById('toggle-button');
    const toggleImage = document.getElementById('toggle-image');

    toggleButton.addEventListener('click', () => {
      toggleImage.classList.toggle('collapsed');
    });
    </script>

    <style>
    #toggle-image.collapsed {
      content: url('/images/CollapseAll.png');
    }

    #toggle-image {
      content: url('/images/ExpandAll.png');
    }
    </style>
    """
  end
end
