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
        group_by: [
          p.id,
          p.title,
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

    render(conn, "menplay.html", rows: rows)
  end
end
