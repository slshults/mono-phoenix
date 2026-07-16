defmodule MonoPhoenixV01Web.ApiController do
  use MonoPhoenixV01Web, :controller

  @host "https://www.shakespeare-monologues.org"

  # Read-only public data API. CORS-open so browser tools / agents can fetch it.

  # The monologue index (metadata + first lines).
  def monologues(conn, _params) do
    monos = MonoPhoenixV01.MonologueIndex.all()

    conn
    |> cors()
    |> json(%{
      site: "Shakespeare's Monologues",
      url: @host,
      description:
        "Index of every monologue in Shakespeare's plays. Metadata + first lines; full text, scene context, and a modern-English paraphrase are on each monologue's `url` (or via /api/monologues/{id}.json).",
      text_edition: "Globe edition, matching Open Source Shakespeare (opensourceshakespeare.org)",
      license: "CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)",
      attribution: "shakespeare-monologues.org",
      count: length(monos),
      monologues: monos
    })
  end

  # A single monologue: full text + cached AI paraphrase / scene & play summaries.
  def monologue(conn, %{"id" => id_param}) do
    id_str = String.replace_suffix(id_param, ".json", "")

    case Integer.parse(id_str) do
      {id, ""} when id > 0 ->
        case MonoPhoenixV01.MonologueIndex.get(id) do
          nil ->
            conn |> cors() |> put_status(:not_found) |> json(%{error: "No monologue with id #{id}."})

          m ->
            conn
            |> cors()
            |> json(Map.put(m, :attribution, "shakespeare-monologues.org (CC BY-NC-SA 4.0)"))
        end

      _ ->
        conn |> cors() |> put_status(:bad_request) |> json(%{error: "Invalid monologue id."})
    end
  end

  # The current "Monologue of the Day" (whatever's most recently posted to social).
  def monologue_of_the_day(conn, _params) do
    case MonoPhoenixV01.DailyMonologue.Current.get() do
      nil ->
        conn
        |> cors()
        |> put_status(:not_found)
        |> json(%{error: "No monologue of the day has been posted yet."})

      m ->
        conn
        |> cors()
        |> json(%{
          id: m.id,
          character: m.character,
          play: m.play_title,
          location: m.location,
          style: m.style,
          first_line: m.first_line,
          url: "#{@host}/monologues/#{m.id}",
          attribution: "shakespeare-monologues.org (CC BY-NC-SA 4.0)"
        })
    end
  end

  defp cors(conn), do: put_resp_header(conn, "access-control-allow-origin", "*")
end
