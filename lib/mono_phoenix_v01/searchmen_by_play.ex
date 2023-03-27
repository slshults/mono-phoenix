defmodule MonoPhoenixV01Web.SearchmenByPlay do
  @moduledoc """
  The DB query for searches.
  """
  import Ecto.Query, only: [from: 2]

  # Get monologues for the search query entered
  @spec get_all(String.t(), non_neg_integer()) :: list()

  def get_all(query, play_id) do
    if is_nil(query) or String.trim(query) == "" do
      []
    else
      query = String.downcase(query)
      cleaned_query = Regex.replace(~r/[^\w\s]/, query, "")

      result =
        from(m in "monologues",
          join: p in "plays",
          on: m.play_id == p.id,
          join: g in "genders",
          on: g.id == m.gender_id,
          where:
            m.play_id == ^play_id and (g.name == "Men" or g.name == "Both") and
              (ilike(
                 fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", p.title),
                 ^"%#{cleaned_query}%"
               ) or
                 ilike(
                   fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.location),
                   ^"%#{cleaned_query}%"
                 ) or
                 ilike(
                   fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.character),
                   ^"%#{cleaned_query}%"
                 ) or
                 ilike(
                   fragment("REGEXP_REPLACE(?, '[^\\w\\s]', '', 'g')", m.body),
                   ^"%#{cleaned_query}%"
                 )),
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

      MonoPhoenixV01.Repo.all(result)
    end
  end
end
