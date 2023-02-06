defmodule MonoPhoenixV01Web.PageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query, only: [from: 2]

  # Constant
  @display_limit 100

  # Show all the monologues in the database
  @spec monologues(Plug.Conn.t(), any) :: Plug.Conn.t()
  def monologues(conn, _params) do
    query =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        group_by: [p.title, m.character, m.first_line, m.location],
        select: %{
          play: p.title,
          character: m.character,
          firstline: m.first_line,
          location: m.location,
          body: m.body
        }
      )

    rows = MonoPhoenixV01.Repo.all(query)
    render(conn, "monologues.html", rows: rows)
  end
end

# rows below this line commented out while trying to get test route for all monologues working
# GET /monologues/:id
# Returns a single monologue
#  def show(conn, %{"id" => id}) do
#    try do
#      {:ok, monologue} = Monologue.find(id)
#      title = "#{monologue.character}'s \"#{monologue.first_line}\" in #{monologue.play.title}"
#      conn = assign(conn, :play, nil)
#
#      if conn.req_headers["X-Requested-With"] == "XMLHttpRequest" do
#        conn
#        |> put_resp_content_type("text/plain")
#        |> send_resp(200, monologue.body)
#      else
#        render(conn, "monologues/show", title: title)
#      end
#    catch
#      _ -> render(conn, "errors/404", layout: false)
#    end
#  end
#
#  # POST /search
#  # Searches for monologues
#  found_monologues =
#    if conn.private[:play] > 0 do
#      {:ok, play} = Play.find(conn.private[:play])
#
#     \ play.monologues
#      |> Monologue.gender(params["gender"])
#      |> Monologue.matching(params["query"])
#    else
#      Monologue.list_monologues()
#      |> Monologue.gender(params["gender"])
#      |> Monologue.matching(params["query"])
#    end
#
#  # Take the first @display_limit monologues
#  monologues = Enum.take(found_monologues, @display_limit)
#  # Debug output, displayed in development env
#  debug_output = """
#  play: #{conn.private[:play]}<br/>
#  gender: #{conn.private[:gender]}<br/>
#  toggle: #{conn.private[:toggle]}<br/>
#  query: #{conn.private[:query]}<br/>
#  found: #{Enum.count(found_monologues)}<br/>
#  displayed: #{Enum.count(monologues)}
#  """
#
#  # Render the monologues list
#  render(conn, "monologues/_list",
#    layout: false,
#    locals: %{toggle: conn.private[:toggle]},
#    assigns: %{
#      show_play_title: show_play_title,
#      monologues: monologues,
#      debug_output: debug_output
#    }
#  )
# end
#
