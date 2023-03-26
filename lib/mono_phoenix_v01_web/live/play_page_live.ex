defmodule MonoPhoenixV01Web.PlayPageLive do
  use MonoPhoenixV01Web, :live_view
  alias MonoPhoenixV01Web.Router.Helpers, as: Routes
  import Ecto.Query

  @impl true
  def mount(%{"playid" => playid_str}, _session, socket) do
    playid = String.to_integer(playid_str)
    rows = fetch_monologues(playid, "")
    {:ok, assign(socket, search_bar: %{}, search_value: "", rows: rows, play_id: playid)}
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
