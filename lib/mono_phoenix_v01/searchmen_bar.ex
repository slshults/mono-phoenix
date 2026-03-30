defmodule MonoPhoenixV01Web.SearchmenBar do
  @moduledoc """
  The DB query for searches.
  """
  import Ecto.Query

  @spec get_all(String.t()) :: list()

  def get_all(query) do
    query = String.downcase(query)
    cleaned_query = Regex.replace(~r/[^\w\s]/, query, "")
    words = String.split(cleaned_query, ~r/\s+/, trim: true)

    if length(words) <= 1 do
      ranked_search(cleaned_query)
    else
      case phrase_search(cleaned_query) do
        [] -> ranked_search(cleaned_query)
        results -> results
      end
    end
  end

  defp phrase_search(cleaned_query) do
    from(m in "monologues",
      join: p in "plays",
      on: m.play_id == p.id,
      join: g in "genders",
      on: g.id == m.gender_id,
      where:
        (g.name == "Men" or g.name == "Both") and
          (ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", p.title), ^"%#{cleaned_query}%") or
             ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.location), ^"%#{cleaned_query}%") or
             ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.character), ^"%#{cleaned_query}%") or
             ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.body), ^"%#{cleaned_query}%")),
      group_by: [p.id, p.title, m.id, m.location, m.character, m.first_line, m.style, m.body, m.body_link, m.pdf_link],
      select: %{
        play_id: p.id, play: p.title, monologues: m.id, location: m.location,
        style: m.style, character: m.character, firstline: m.first_line,
        body: m.body, scene: m.body_link, pdf: m.pdf_link
      }
    )
    |> MonoPhoenixV01.Repo.all()
  end

  defp ranked_search(cleaned_query) do
    fts_query = normalize_for_fts(cleaned_query)
    if fts_query == "", do: [], else: do_ranked_search(fts_query)
  end

  defp do_ranked_search(fts_query) do
    from(m in "monologues",
      join: p in "plays",
      on: m.play_id == p.id,
      join: g in "genders",
      on: g.id == m.gender_id,
      where: (g.name == "Men" or g.name == "Both") and fragment(
        """
        (setweight(to_tsvector('simple', coalesce(?, '')), 'A') ||
         setweight(to_tsvector('simple', coalesce(?, '')), 'A') ||
         setweight(to_tsvector('simple', coalesce(?, '')), 'B') ||
         setweight(to_tsvector('simple', coalesce(?, '')), 'D'))
        @@ plainto_tsquery('simple', ?)
        """,
        p.title, m.character, m.location, m.body, ^fts_query
      ),
      order_by: [desc: fragment(
        """
        ts_rank(
          setweight(to_tsvector('simple', coalesce(?, '')), 'A') ||
          setweight(to_tsvector('simple', coalesce(?, '')), 'A') ||
          setweight(to_tsvector('simple', coalesce(?, '')), 'B') ||
          setweight(to_tsvector('simple', coalesce(?, '')), 'D'),
          plainto_tsquery('simple', ?))
        """,
        p.title, m.character, m.location, m.body, ^fts_query
      )],
      select: %{
        play_id: p.id, play: p.title, monologues: m.id, location: m.location,
        style: m.style, character: m.character, firstline: m.first_line,
        body: m.body, scene: m.body_link, pdf: m.pdf_link
      }
    )
    |> MonoPhoenixV01.Repo.all()
  end

  defp normalize_for_fts(query) do
    query
    |> String.replace(~r/\bact\b/, "")
    |> String.replace(~r/\bscene\b/, "")
    |> String.replace(~r/\s+/, " ")
    |> String.trim()
  end
end
