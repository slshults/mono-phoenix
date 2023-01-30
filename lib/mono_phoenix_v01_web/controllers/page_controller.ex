defmodule MonoPhoenixV01Web.PageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query, only: [from: 2]

  @spec index(Plug.Conn.t(), any) :: Plug.Conn.t()
  def index(conn, _params) do
    query =
      from(p in "plays",
        join: m in "monologues",
        on: m.play_id == p.id,
        group_by: [p.title, m.character, m.first_line, m.location],
        select: %{
          play: p.title,
          character: m.character,
          firstline: m.first_line,
          location: m.location
        }
      )

    rows = MonoPhoenixV01.Repo.all(query)

    render(conn, "index.html", rows: rows)
  end

  def sandbox(conn, _params) do
    render(conn, "sandbox.html")
  end

  def hello(conn, _params) do
    html(conn, "hello, world!")
  end
end
