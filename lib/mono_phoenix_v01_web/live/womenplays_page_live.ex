defmodule MonoPhoenixV01Web.WomenplaysPageLive do
  use MonoPhoenixV01Web, :live_view
  import Ecto.Query

  @impl true
  def mount(_params, _session, socket) do
    rows = fetch_monologues(nil, "search_value")
    {:ok, assign(socket, 
      searchwomen_bar: %{}, 
      search_value: "", 
      rows: rows,
      active_requests: MapSet.new(),
      async_metadata: %{}
    )}
  end

  # Add this function to handle the search event
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

  @impl true
  def handle_info({:search, search_value}, socket) do
    # Check if rows are empty before calling hd
    playid = if length(socket.assigns.rows) > 0, do: hd(socket.assigns.rows).play_id, else: nil
    updated_rows = fetch_monologues(playid, search_value)

    {:noreply, assign(socket, rows: updated_rows, search_timer: nil)}
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
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
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
    async_metadata = Map.delete(socket.assigns.async_metadata, request_key)
    
    {:noreply, assign(socket, active_requests: active_requests, async_metadata: async_metadata)}
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

  defp fetch_monologues(nil, search_value) do
    base_query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        where: p.id == m.play_id,
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
