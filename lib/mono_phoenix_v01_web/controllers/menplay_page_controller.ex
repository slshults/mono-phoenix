defmodule MonoPhoenixV01Web.MenplayPageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query

  # Show monologues for the play link clicked
  @spec menplay(Plug.Conn.t(), map) :: Plug.Conn.t()
  def menplay(conn, params) do
    playid = String.to_integer(params["playid"])

    query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        join: g in "genders",
        on: g.id == m.gender_id,
        where: p.id == ^playid and (g.name == "Men" or g.name == "Both"),
        group_by: [p.id, g.name, p.title, m.character, m.first_line, m.location, m.body],
        select: %{
          play: p.title,
          character: m.character,
          firstline: m.first_line,
          location: m.location,
          body: m.body
        }
      )

    rows = MonoPhoenixV01.Repo.all(query)

    render(conn, "menplay.html", rows: rows)
  end
end
