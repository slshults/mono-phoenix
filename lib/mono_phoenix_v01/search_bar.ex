defmodule MonoPhoenixV01Web.SearchBar do
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
      # Single word: go straight to ranked FTS (phrase match returns unranked noise)
      ranked_search(cleaned_query)
    else
      # Multi-word: try phrase match first (preserves "to be or not" exact matching)
      case phrase_search(cleaned_query) do
        [] -> ranked_search(cleaned_query)
        results -> results
      end
    end
  end

  # Tier 1: Full query as a contiguous substring in any field
  defp phrase_search(cleaned_query) do
    from(m in "monologues",
      join: p in "plays",
      on: m.play_id == p.id,
      where:
        ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", p.title), ^"%#{cleaned_query}%") or
          ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.location), ^"%#{cleaned_query}%") or
          ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.character), ^"%#{cleaned_query}%") or
          ilike(fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.body), ^"%#{cleaned_query}%"),
      group_by: [p.id, p.title, m.id, m.location, m.character, m.first_line, m.style, m.body, m.body_link, m.pdf_link],
      select: %{
        play_id: p.id, play: p.title, monologues: m.id, location: m.location,
        style: m.style, character: m.character, firstline: m.first_line,
        body: m.body, scene: m.body_link, pdf: m.pdf_link
      }
    )
    |> MonoPhoenixV01.Repo.all()
  end

  # Tier 2: FTS with weighted fields and relevance ranking
  defp ranked_search(cleaned_query) do
    fts_query = normalize_for_fts(cleaned_query)
    if fts_query == "", do: [], else: do_ranked_search(fts_query)
  end

  defp do_ranked_search(fts_query) do
    from(m in "monologues",
      join: p in "plays",
      on: m.play_id == p.id,
      where: fragment(
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

  # Strip structural markers that users type but don't exist in location data
  defp normalize_for_fts(query) do
    query
    |> String.replace(~r/\bact\b/, "")
    |> String.replace(~r/\bscene\b/, "")
    |> String.replace(~r/\s+/, " ")
    |> String.trim()
  end
end
