defmodule MonoPhoenixV01Web.SearchwomenByPlayLive do
  use MonoPhoenixV01Web, :live_view

  @impl true
  def mount(:not_mounted_at_router, %{"play_id" => play_id}, socket) do
    search_results = MonoPhoenixV01Web.SearchwomenByPlay.get_all("", play_id)
    {:ok, assign(socket, 
      play_id: play_id, 
      search_results: search_results,
      search_query: "",
      active_requests: MapSet.new(),
      async_metadata: %{}
    )}
  end

  @impl true
  def mount(%{"play_id" => play_id}, _session, socket) do
    # Assign a default play_id of 9 if it's nil
    play_id = if is_nil(play_id), do: 9, else: play_id
    search_results = MonoPhoenixV01Web.SearchwomenByPlay.get_all("", play_id)

    {:ok, assign(socket, 
      play_id: play_id, 
      search_results: search_results,
      search_query: "",
      active_requests: MapSet.new(),
      async_metadata: %{}
    )}
  end

  ## socket

  @impl true
  def handle_event("search", %{"search" => %{"query" => search_query}}, socket) do
    play_id = socket.assigns.play_id

    search_results =
      if search_query == "" do
        []
      else
        MonoPhoenixV01Web.SearchwomenByPlay.get_all(search_query, play_id)
      end

    {:noreply,
     assign(socket, 
       search_results: if(length(search_results) > 0, do: search_results, else: nil),
       search_query: search_query
     )}
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
      
      # Start async request and track it
      socket = start_async(socket, request_key, fn ->
        MonoPhoenixV01.AnthropicService.get_play_summary(play_title)
      end)
      
      # Add to active requests and store metadata
      active_requests = MapSet.put(active_requests, request_key)
      async_metadata = Map.put(socket.assigns.async_metadata, request_key, %{
        type: :play_summary,
        play_title: play_title
      })
      
      {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
    end
  end

  @impl true
  def handle_event("show_scene_summary", %{"play-title" => play_title, "location" => location}, socket) do
    request_key = "scene_summary:#{play_title}:#{location}"
    
    # Check if this request is already in progress
    active_requests = Map.get(socket.assigns, :active_requests, MapSet.new())
    if MapSet.member?(active_requests, request_key) do
      # Request already in progress - ignore duplicate click
      {:noreply, socket}
    else
      # Show the modal first
      send_update(MonoPhoenixV01Web.SummaryModalComponent, 
        id: "summary-modal",
        action: "show_scene_summary", 
        play_title: play_title,
        location: location
      )
      
      # Start async request and track it
      socket = start_async(socket, request_key, fn ->
        MonoPhoenixV01.AnthropicService.get_scene_summary(play_title, location)
      end)
      
      # Add to active requests and store metadata
      active_requests = MapSet.put(active_requests, request_key)
      async_metadata = Map.put(socket.assigns.async_metadata, request_key, %{
        type: :scene_summary,
        play_title: play_title,
        location: location
      })
      
      {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
    end
  end

  @impl true
  def handle_event("show_paraphrasing", params, socket) do
    monologue_id = params["monologue-id"]
    monologue_text = params["monologue-text"]
    character = params["character"]
    
    request_key = "paraphrasing:#{monologue_id}"
    
    # Check if this request is already in progress
    active_requests = Map.get(socket.assigns, :active_requests, MapSet.new())
    if MapSet.member?(active_requests, request_key) do
      # Request already in progress - ignore duplicate click
      {:noreply, socket}
    else
      # Show the modal first
      send_update(MonoPhoenixV01Web.SummaryModalComponent, 
        id: "summary-modal",
        action: "show_paraphrasing", 
        monologue_id: monologue_id,
        monologue_text: monologue_text,
        character: character
      )
      
      # Start async request and track it
      socket = start_async(socket, request_key, fn ->
        MonoPhoenixV01.AnthropicService.get_monologue_paraphrasing(monologue_id, monologue_text)
      end)
      
      # Add to active requests and store metadata
      active_requests = MapSet.put(active_requests, request_key)
      async_metadata = Map.put(socket.assigns.async_metadata, request_key, %{
        type: :paraphrasing,
        monologue_id: monologue_id,
        character: character
      })
      
      {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
    end
  end

  @impl true
  def handle_async(request_key, {:ok, api_result}, socket) do
    # Get metadata for this request
    metadata = Map.get(socket.assigns.async_metadata, request_key, %{})
    
    # Pattern match the API result to extract content and record_id
    case api_result do
      {:ok, %{content: content, id: record_id}} ->
        # Update modal with the extracted content
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: "summary-modal",
          action: "content_generated", 
          content: content,
          record_id: record_id
        )
      _ ->
        # Handle unexpected API result format as error  
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: "summary-modal",
          action: "error_occurred", 
          error: "Sorry, there was an unexpected error with the API response format."
        )
    end
    
    # Clean up tracking (but keep metadata until modal closes)
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests)}
  end

  @impl true
  def handle_async(request_key, {:error, reason}, socket) do
    # Update modal with error message using action-based pattern
    send_update(MonoPhoenixV01Web.SummaryModalComponent, 
      id: "summary-modal",
      action: "error_occurred", 
      error: "Sorry, there was an error generating the content. Please try again later."
    )
    
    # Clean up tracking
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests)}
  end

  # Handle async task cancellation via exit
  @impl true
  def handle_async(request_key, {:exit, reason}, socket) do
    require Logger
    Logger.info("User confirmed cancellation - stopping generation")
    
    # Handle cancellation gracefully
    send_update(MonoPhoenixV01Web.SummaryModalComponent, 
      id: "summary-modal", 
      action: "generation_cancelled"
    )
    
    # Clean up tracking
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests)}
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~H"""

      <%= render_search_form(assigns) %> <%!-- added --%>
      <%= render_searchwomen_by_play(assigns) %>
      
      <.live_component 
        module={MonoPhoenixV01Web.SummaryModalComponent} 
        id="summary-modal" 
      />
    """
  end

  ## render the search form
  defp render_search_form(assigns) do
    ~H"""
    <div class="search-box-dark search-box-default accent-font monologue-list">
      <%= form_for :search, "#", [phx_submit: "search", phx_change: "search",
      class: "search-box-dark search-box-default",
      phx_page_loading: :prevent], fn f -> %>
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
  def render_searchwomen_by_play(assigns) do
    ~H"""
    <div class="search-box-dark search-box-default center-this monologue-list">
      <table class="search-box-dark search-box-default monologue-list">
        <tbody>
        <%= if !is_nil(@search_results) do %>
          <%= if length(@search_results) > 0 do %>
          <!-- Extract play title from the first result -->
            <% play_title = hd(@search_results).play %>
            <!-- begin results heading, text, and body toggle -->
            <h3>Search results from <%= play_title %></h3>
            <span style="font-size:11px">
            Click on the 1st line, under the character's name, to see the full monologue.<br/><a
              href="#"
              data-toggle="collapse"
              data-target=".multi-collapse"
              id="toggle-button"
            >
            <img
                src="/images/ExpandAll.png"
                id="toggle-image"
                style="background-color: #F9F9DF; border-radius: 5px;"
                alt="👆 Click to toggle text of all monologues on the page.
            🔄️ Reload the page to reset the toggle."
                title="👆 Click to toggle the text of all monologues on the page.
            🔄️ Reload the page to reset the toggle."
              />
            </a>
            </span>
            <!-- end results heading, text, and body toggle -->
          <% end %>
          <%= for {row, index} <- Enum.with_index(@search_results) do %>

          <!-- Render each search result here -->
            <tr class="monologue_list">
              <td class={if rem(index, 2) == 0, do: "even", else: "odd"}>
                <span class="monologue-playname" alt="This is the title of the play the monologue is found in." title="This is the title of the play the monologue is found in."><%= row.play %></span><span class="summary-icon" 
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
                  <%= row.firstline %>↴
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
    """
  end
end
