defmodule MonoPhoenixV01Web.PlayPageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query, only: [from: 2]

  # Show monologues for the play link clicked
  @spec play(Plug.Conn.t(), map) :: Plug.Conn.t()
  def play(conn, params) do
    playid = String.to_integer(params["playid"])

    query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        where: p.id == ^playid,
        group_by: [p.id, p.title, m.character, m.first_line, m.location, m.body],
        select: %{
          play: p.title,
          character: m.character,
          firstline: m.first_line,
          location: m.location,
          body: m.body
        }
      )

    rows = MonoPhoenixV01.Repo.all(query)

    render(conn, "play.html", rows: rows)
  end
end
