defmodule MonoPhoenixV01Web.PlayPageLive do
  use MonoPhoenixV01Web, :live_view
  import Ecto.Query

  @impl true
  def mount(params, _session, socket) do
    playid = String.to_integer(params["playid"])
    rows = fetch_monologues(playid)
    {:ok, assign(socket, :rows, rows)}
  end

  defp fetch_monologues(play_id) do
    query =
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
