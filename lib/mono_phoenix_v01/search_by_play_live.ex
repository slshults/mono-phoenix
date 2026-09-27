defmodule MonoPhoenixV01Web.SearchByPlayLive do
  use MonoPhoenixV01Web, :live_view
  import MonoPhoenixV01Web.Components.SearchNoResults
  import MonoPhoenixV01Web.Components.HeartIcon

  alias MonoPhoenixV01.Favorites
  alias MonoPhoenixV01Web.LiveFavoritesHelpers

  @impl true
  def mount(:not_mounted_at_router, %{"play_id" => play_id} = session, socket) do
    search_results = MonoPhoenixV01Web.SearchByPlay.get_all("", play_id)
    {:ok, assign_favorites_state(socket, session)
     |> assign(
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
    search_results = MonoPhoenixV01Web.SearchByPlay.get_all("", play_id)

    {:ok, assign_favorites_state(socket, %{})
     |> assign(
       play_id: play_id,
       search_results: search_results,
       search_query: "",
       active_requests: MapSet.new(),
       async_metadata: %{}
     )}
  end

  # Patron-only heart toggle inside the nested search LV. Unauth/lapsed
  # visitors don't see hearts here (the cross-LV modal coordination is
  # deferred — they see hearts on the parent monologue listing instead).
  @impl true
  def handle_event("toggle_favorite", %{"monologue-id" => mid_str}, socket) do
    with true <- socket.assigns.is_patron,
         {:ok, monologue_id} <- parse_monologue_id(mid_str) do
      do_toggle(socket, monologue_id)
    else
      _ -> {:noreply, socket}
    end
  end

  defp do_toggle(socket, monologue_id) do
    user_id = socket.assigns.user_id
    current = socket.assigns.favorited_ids

    {new_ids, event} =
      if MapSet.member?(current, monologue_id) do
        :ok = Favorites.remove(user_id, monologue_id)
        {MapSet.delete(current, monologue_id), "favorite_removed"}
      else
        case Favorites.add(user_id, monologue_id) do
          {:ok, _} -> {MapSet.put(current, monologue_id), "favorite_added"}
          _ -> {current, nil}
        end
      end

    socket = assign(socket, :favorited_ids, new_ids)

    socket =
      if event do
        LiveFavoritesHelpers.push_posthog(socket, event, %{
          monologue_id: monologue_id,
          source: "search_results"
        })
      else
        socket
      end

    {:noreply, socket}
  end

  defp parse_monologue_id(str) when is_binary(str) do
    case Integer.parse(str) do
      {id, ""} when id > 0 -> {:ok, id}
      _ -> :error
    end
  end

  defp parse_monologue_id(_), do: :error

  ## socket

  @impl true
  def handle_event("search", %{"search" => %{"query" => search_query}}, socket) do
    play_id = socket.assigns.play_id

    search_results =
      if search_query == "" do
        []
      else
        MonoPhoenixV01Web.SearchByPlay.get_all(search_query, play_id)
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
        id: "search-summary-modal",
        action: "show_play_summary",
        play_title: play_title
      )

      # Track this request and start the content generation
      active_requests = MapSet.put(active_requests, request_key)
      send(self(), {:generate_summary, "play_summary", %{play_title: play_title}, "search-summary-modal", request_key})

      {:noreply, assign(socket, active_requests: active_requests)}
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
        id: "search-summary-modal",
        action: "show_scene_summary",
        play_title: play_title,
        location: location
      )

      # Track this request and start the content generation
      active_requests = MapSet.put(active_requests, request_key)
      send(self(), {:generate_summary, "scene_summary", %{play_title: play_title, location: location}, "search-summary-modal", request_key})

      {:noreply, assign(socket, active_requests: active_requests)}
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
        id: "search-summary-modal",
        action: "show_paraphrasing",
        monologue_id: monologue_id,
        monologue_text: monologue_text,
        character: character
      )

      # Track this request and start the content generation
      active_requests = MapSet.put(active_requests, request_key)
      send(self(), {:generate_summary, "paraphrasing", %{monologue_id: monologue_id, monologue_text: monologue_text}, "search-summary-modal", request_key})

      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end

  # Start the generation without blocking the LiveView. The modal's Retry
  # button sends this same message.
  @impl true
  def handle_info({:generate_summary, content_type, params, component_id, request_key}, socket) do
    socket = start_async(socket, request_key, fn ->
      case content_type do
        "play_summary" ->
          MonoPhoenixV01.AnthropicService.get_play_summary(params.play_title)
        "scene_summary" ->
          MonoPhoenixV01.AnthropicService.get_scene_summary(params.play_title, params.location)
        "paraphrasing" ->
          MonoPhoenixV01.AnthropicService.get_monologue_paraphrasing(params.monologue_id)
      end
    end)

    # Store metadata for the async result handler
    socket = assign(socket,
      async_metadata: Map.put(socket.assigns.async_metadata, request_key, %{
        content_type: content_type,
        component_id: component_id,
        request_key: request_key
      })
    )

    {:noreply, socket}
  end

  # Handle cancellation requests from modal
  @impl true
  def handle_info({:cancel_generation, component_id}, socket) do
    require Logger
    Logger.info("Cancelling generation for component: #{component_id}")

    # Cancel matching tasks; handle_async cleans up when each one exits
    socket = Enum.reduce(socket.assigns.async_metadata, socket, fn {request_key, metadata}, acc_socket ->
      if metadata.component_id == component_id do
        cancel_async(acc_socket, request_key)
      else
        acc_socket
      end
    end)

    {:noreply, socket}
  end

  @impl true
  def handle_async(request_key, {:ok, api_result}, socket) do
    case api_result do
      {:ok, %{content: content, id: record_id}} ->
        send_update(MonoPhoenixV01Web.SummaryModalComponent,
          id: "search-summary-modal",
          action: "content_generated",
          content: content,
          record_id: record_id
        )

      {:error, _reason} ->
        # AnthropicService has already logged the cause.
        send_update(MonoPhoenixV01Web.SummaryModalComponent, id: "search-summary-modal", action: "error_occurred")
    end

    # Clean up tracking
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)

    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
  end

  # A cancel (the reader force-closed the modal) needs no UI. Any other exit is
  # a crash inside the task, which the reader should hear about.
  @impl true
  def handle_async(request_key, {:exit, reason}, socket) do
    require Logger

    case reason do
      {:shutdown, :cancel} ->
        Logger.info("Async task #{request_key} was cancelled")

      _ ->
        Logger.error("Async generation failed for #{request_key}: #{inspect(reason)}")
        send_update(MonoPhoenixV01Web.SummaryModalComponent, id: "search-summary-modal", action: "error_occurred")
    end

    # Clean up tracking
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)

    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~H"""

      <%= render_search_form(assigns) %> <%!-- added --%>
      <%= render_search_by_play(assigns) %>
      
      <.live_component 
        module={MonoPhoenixV01Web.SummaryModalComponent} 
        id="search-summary-modal" 
      />
    """
  end

  ## render the search form
  defp render_search_form(assigns) do
    ~H"""
    <div class="accent-font monologue-list">
      <%= form_for :search, "#", [phx_submit: "search", phx_change: "search",
      phx_page_loading: :prevent], fn f -> %>
        <%= label f, :query, "" %>

        <%= text_input f, :query,
          value: Map.get(assigns, :search_query, ""),
          placeholder: "Search for monologues...",
          class: "search-box-dark search-box-default input-group accent-font form-control monologue-list",
          style: "width: 100%;",
          phx_input: "search_input",
          phx_debounce: "240"
          %>
      <% end %>
    </div>
    """
  end

  ## render the search results
  def render_search_by_play(assigns) do
    ~H"""
    <div class="monologue-list">
      <%= if no_results?(@search_query, @search_results) do %>
        <.search_no_results show_scope_note={true} />
      <% end %>
      <table class="monologue-list">
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
              id="search-toggle-button"
            ><img
                src="/images/ExpandAll.png"
                id="search-toggle-image"
                style="background-color: #F9F9DF; border-radius: 5px;"
                alt="👆 Click to toggle text of all monologues on the page.
      🔄️ Reload the page to reset the toggle."
                title="👆 Click to toggle the text of all monologues on the page.
      🔄️ Reload the page to reset the toggle."
              /></a>
            </span>
            <!-- end results heading, text, and body toggle -->
          <% end %>
          <%= for {row, index} <- Enum.with_index(@search_results) do %>
          <!-- Render each search result here -->
            <tr class="monologue_list" data-location={row.location} data-firstline={row.firstline}>
              <td>
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
                <span class="monologue-actscene"><%= row.style %></span><%= if @is_patron do %><.heart_icon
                  monologue_id={row.monologues}
                  filled={MapSet.member?(@favorited_ids, row.monologues)}
                  auth_state={:patron}
                /><% end %>
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
    <%= if !is_nil(@search_results) && length(@search_results) > 0 do %>
    <script>
    {
      const toggleButton = document.getElementById('search-toggle-button');
      const toggleImage = document.getElementById('search-toggle-image');
      if (toggleButton && toggleImage) {
        toggleButton.addEventListener('click', () => {
          toggleImage.classList.toggle('collapsed');
        });
      }
    }
    </script>

    <style>
    #search-toggle-image.collapsed {
      content: url('/images/CollapseAll.png');
    }

    #search-toggle-image {
      content: url('/images/ExpandAll.png');
    }
    </style>
    <% end %>
    """
  end

  defp assign_favorites_state(socket, session) do
    user_id = Map.get(session, "user_id")
    is_patron = LiveFavoritesHelpers.patron_id?(user_id)

    favorited_ids =
      if is_patron, do: Favorites.favorited_ids_for(user_id), else: MapSet.new()

    assign(socket,
      user_id: user_id,
      is_patron: is_patron,
      favorited_ids: favorited_ids
    )
  end
end
