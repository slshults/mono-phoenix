defmodule MonoPhoenixV01Web.PlayPageLive do
  use MonoPhoenixV01Web, :live_view
  import Ecto.Query

  def mount(%{"playid" => playid_str}, _session, socket) do
    playid = String.to_integer(playid_str)
    rows = fetch_monologues(playid, "")
    {:ok, assign(socket, search_bar: %{}, search_value: "", rows: rows)}
  end

  # Add this function to handle the search event
  @impl true
  def handle_event("search", %{"search_value" => search_value}, socket) do
    playid = hd(socket.assigns.rows).play_id
    updated_rows = fetch_monologues(playid, search_value)
    {:noreply, assign(socket, :rows, updated_rows)}
  end

  # Update fetch_monologues/1 to fetch_monologues/2 and add search_value as an argument
  defp fetch_monologues(play_id, search_value) do
    query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        where: p.id == ^play_id,
        # Add this line to filter by character
        where: ilike(m.character, ^"%#{search_value}%"),
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
          # Add this line to include play_id in the result
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

    MonoPhoenixV01.Repo.all(query)
  end
end
