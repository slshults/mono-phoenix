defmodule MonoPhoenixV01Web.MonologuesPageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query, only: [from: 2]

  # Constant
  # @display_limit 100

  # Show a monologue from the database
  @spec monologues(Plug.Conn.t(), any) :: Plug.Conn.t()
  def monologues(conn, params) do
    case Integer.parse(params["monoid"]) do
      {monoid, ""} when monoid > 0 ->
        query =
          from(m in "monologues",
            join: p in "plays",
            on: m.play_id == p.id,
            where: m.id == ^monoid,
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
              id: p.id,
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

        case MonoPhoenixV01.Repo.all(query) do
          [] ->
            # Valid positive integer, but no such monologue — 404 rather than a
            # blank 200 (thin empty pages hurt indexing).
            not_found(conn)

          rows ->
            conn
            |> assign_monologue_meta(rows, monoid)
            |> render("monologues.html",
              rows: rows,
              extras: monologue_extras(rows, monoid),
              layout: {MonoPhoenixV01Web.LayoutView, "static.html"}
            )
        end

      _ ->
        not_found(conn)
    end
  end

  defp not_found(conn) do
    conn
    |> put_status(:not_found)
    |> put_view(MonoPhoenixV01Web.ErrorView)
    |> render("404.html")
    |> halt()
  end

  # Assigns the per-page SEO metadata the root layout renders (unique <title>,
  # meta description, canonical URL). Only set here, so every other page is
  # unaffected. No-op when the id matched no row (leaves the site-wide defaults).
  defp assign_monologue_meta(conn, [row | _], monoid) do
    conn
    |> assign(:meta_title, MonoPhoenixV01.MonologueMeta.title(row))
    |> assign(:meta_description, MonoPhoenixV01.MonologueMeta.description(row))
    |> assign(:canonical_url, MonoPhoenixV01.MonologueMeta.canonical_url(monoid))
    |> assign(:json_ld, MonoPhoenixV01.MonologueMeta.json_ld(row))
  end

  defp assign_monologue_meta(conn, _rows, _monoid), do: conn

  # Related monologues (same play) + any cached AI paraphrase/summaries, rendered
  # server-side so they're visible to crawlers/LLMs. nil when the id had no row.
  defp monologue_extras([row | _], monoid) do
    %{
      related: MonoPhoenixV01.MonologueExtras.related_in_play(row.id, monoid),
      paraphrase: MonoPhoenixV01.MonologueExtras.paraphrase_html(monoid),
      play_summary: MonoPhoenixV01.MonologueExtras.play_summary_html(row.play),
      scene_summary: MonoPhoenixV01.MonologueExtras.scene_summary_html(row.play, row.location)
    }
  end

  defp monologue_extras(_rows, _monoid), do: nil
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
