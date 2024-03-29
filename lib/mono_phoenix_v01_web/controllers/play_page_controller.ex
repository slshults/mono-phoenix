defmodule MonoPhoenixV01Web.PlayPageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query

  # Get monologues for the play link clicked
  @spec play(Plug.Conn.t(), map) :: Plug.Conn.t()
  def play(conn, params) do
    playid = String.to_integer(params["playid"])

    query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        where: p.id == ^playid,
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

    rows = MonoPhoenixV01.Repo.all(query)

    render(conn, "play.html", rows: rows)
  end
end
