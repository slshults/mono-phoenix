defmodule MonoPhoenixV01Web.PlayPageLive do
  use MonoPhoenixV01Web, :live_view
  alias MonoPhoenixV01Web.Router.Helpers, as: Routes
  import Ecto.Query

  @impl true
  def mount(%{"playid" => playid_str}, _session, socket) do
    playid = String.to_integer(playid_str)
    rows = fetch_monologues(playid, "")
    
    # Subscribe to PubSub events for retry functionality
    Phoenix.PubSub.subscribe(MonoPhoenixV01.PubSub, "play_page_events")
    
    {:ok, assign(socket, search_bar: %{}, search_value: "", rows: rows, play_id: playid, active_requests: MapSet.new(), async_metadata: %{})}
  end

  # Handle search events
  @impl true
  def handle_event("search", %{"search_value" => search_value}, socket) do
    # Cancel any previous timer
    if socket.assigns[:search_timer] do
      Process.cancel_timer(socket.assigns[:search_timer])
    end

    # Set a new timer and store its reference in the socket
    timer_ref = Process.send_after(self(), {:search, search_value}, 300)
    {:noreply, assign(socket, search_timer: timer_ref)}
  end

  # Handle summary icon click events
  @impl true
  def handle_event("show_play_summary", %{"play-title" => play_title}, socket) do
    request_key = "play_summary:#{play_title}"
    
    # Check if this request is already in progress
    if MapSet.member?(socket.assigns.active_requests, request_key) do
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
      active_requests = MapSet.put(socket.assigns.active_requests, request_key)
      send(self(), {:generate_summary, "play_summary", %{play_title: play_title}, "summary-modal", request_key})
      
      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end

  @impl true
  def handle_event("show_scene_summary", %{"play-title" => play_title, "location" => location}, socket) do
    request_key = "scene_summary:#{play_title}:#{location}"
    
    # Check if this request is already in progress
    if MapSet.member?(socket.assigns.active_requests, request_key) do
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
      
      # Track this request and start the content generation
      active_requests = MapSet.put(socket.assigns.active_requests, request_key)
      send(self(), {:generate_summary, "scene_summary", %{play_title: play_title, location: location}, "summary-modal", request_key})
      
      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end

  @impl true
  def handle_event("show_paraphrasing", %{"monologue-id" => monologue_id, "monologue-text" => monologue_text, "character" => character}, socket) do
    request_key = "paraphrasing:#{monologue_id}"
    
    # Check if this request is already in progress
    if MapSet.member?(socket.assigns.active_requests, request_key) do
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
      
      # Track this request and start the content generation
      active_requests = MapSet.put(socket.assigns.active_requests, request_key)
      send(self(), {:generate_summary, "paraphrasing", %{monologue_id: monologue_id, monologue_text: monologue_text}, "summary-modal", request_key})
      
      {:noreply, assign(socket, active_requests: active_requests)}
    end
  end


  @impl true
  def handle_info({:search, search_value}, socket) do
    # Check if rows are empty before calling hd
    playid = if length(socket.assigns.rows) > 0, do: hd(socket.assigns.rows).play_id, else: nil
    updated_rows = fetch_monologues(playid, search_value)

    {:noreply, assign(socket, rows: updated_rows, search_timer: nil)}
  end

  # Handle summary generation events using async processing to avoid blocking
  @impl true
  def handle_info({:generate_summary, content_type, params, component_id, request_key}, socket) do
    # Push PostHog event for generation started
    event_name = case content_type do
      "play_summary" -> "play_summary_generated"
      "scene_summary" -> "scene_summary_generated" 
      "paraphrasing" -> "paraphrasing_generated"
    end
    
    event_properties = case content_type do
      "play_summary" -> 
        %{play_title: params.play_title, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
      "scene_summary" -> 
        %{play_title: params.play_title, location: params.location, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
      "paraphrasing" ->
        # Get first line from monologue text if available
        first_line = case params.monologue_text do
          text when is_binary(text) and byte_size(text) > 0 ->
            text |> String.split("\n") |> List.first() |> String.slice(0, 100)
          _ -> nil
        end
        %{monologue_id: params.monologue_id, first_line: first_line, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
    end
    
    socket = push_event(socket, "posthog_capture", %{event: event_name, properties: event_properties})
    
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
        request_key: request_key,
        params: params
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
        # Push PostHog event for content displayed
        event_name = case metadata.content_type do
          "play_summary" -> "play_summary_displayed"
          "scene_summary" -> "scene_summary_displayed" 
          "paraphrasing" -> "paraphrasing_displayed"
        end
        
        event_properties = case metadata.content_type do
          "play_summary" -> 
            %{play_title: metadata.params.play_title, record_id: record_id, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
          "scene_summary" -> 
            %{play_title: metadata.params.play_title, location: metadata.params.location, record_id: record_id, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
          "paraphrasing" ->
            # Get first line from monologue text if available
            first_line = case metadata.params.monologue_text do
              text when is_binary(text) and byte_size(text) > 0 ->
                text |> String.split("\n") |> List.first() |> String.slice(0, 100)
              _ -> nil
            end
            %{monologue_id: metadata.params.monologue_id, first_line: first_line, record_id: record_id, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
        end
        
        socket = push_event(socket, "posthog_capture", %{event: event_name, properties: event_properties})
        
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "content_generated", 
          content: content,
          record_id: record_id
        )
      {:ok, content} when is_binary(content) ->
        # Fallback for old format (shouldn't happen with new code) - still track display event
        event_name = case metadata.content_type do
          "play_summary" -> "play_summary_displayed"
          "scene_summary" -> "scene_summary_displayed" 
          "paraphrasing" -> "paraphrasing_displayed"
        end
        
        event_properties = case metadata.content_type do
          "play_summary" -> 
            %{play_title: metadata.params.play_title, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
          "scene_summary" -> 
            %{play_title: metadata.params.play_title, location: metadata.params.location, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
          "paraphrasing" ->
            first_line = case metadata.params.monologue_text do
              text when is_binary(text) and byte_size(text) > 0 ->
                text |> String.split("\n") |> List.first() |> String.slice(0, 100)
              _ -> nil
            end
            %{monologue_id: metadata.params.monologue_id, first_line: first_line, timestamp: DateTime.utc_now() |> DateTime.to_iso8601()}
        end
        
        socket = push_event(socket, "posthog_capture", %{event: event_name, properties: event_properties})
        
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "content_generated", 
          content: content
        )
      {:error, error} ->
        require Logger
        Logger.warning("API call failed for #{metadata.content_type}: #{error}")
        send_update(MonoPhoenixV01Web.SummaryModalComponent, 
          id: metadata.component_id, 
          action: "content_error", 
          error: "Failed to generate #{metadata.content_type}: #{error}"
        )
    end
    
    # Clean up metadata and active requests
    active_requests = MapSet.delete(socket.assigns.active_requests, request_key)
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
  end

  @impl true
  def handle_async(request_key, {:exit, reason}, socket) do
    metadata = socket.assigns.async_metadata[request_key]
    
    case reason do
      {:shutdown, :cancel} ->
        # Task was cancelled - this is expected, just clean up
        require Logger
        Logger.info("Async task #{request_key} was cancelled")
      _ ->
        # Unexpected failure - log and notify modal if metadata exists
        require Logger
        Logger.error("Async API call failed for #{request_key}: #{inspect(reason)}")
        
        if metadata do
          send_update(MonoPhoenixV01Web.SummaryModalComponent, 
            id: metadata.component_id, 
            action: "content_error", 
            error: "API call failed unexpectedly"
          )
        end
    end
    
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

  # Update fetch_monologues/1 to fetch_monologues/2 and add search_value as an argument
  defp fetch_monologues(nil, _search_value), do: []

  defp fetch_monologues(play_id, search_value) do
    base_query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        where: p.id == ^play_id,
        group_by: [
          p.id,
          p.title,
          m.id,
          m.location,
          m.character,
          m.first_line,
          m.style,
          m.body,
          m.body_link,
          m.pdf_link
        ],
        select: %{
          play: p.title,
          play_id: p.id,
          monologues: m.id,
          location: m.location,
          style: m.style,
          character: m.character,
          firstline: m.first_line,
          body: m.body,
          scene: m.body_link,
          pdf: m.pdf_link
        }
      )

    query =
      if String.trim(search_value) != "" do
        from(m in base_query,
          where: ilike(m.character, ^"%#{search_value}%")
        )
      else
        base_query
      end

    MonoPhoenixV01.Repo.all(query)
  end
end
