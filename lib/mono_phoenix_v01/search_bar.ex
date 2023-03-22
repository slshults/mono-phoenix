defmodule MonoPhoenixV01Web.SearchBar do
  @moduledoc """
  The DB query for searches.
  """
  import Ecto.Query, only: [from: 2]

  # Get monologues for the search query entered
  @spec get_all(String.t()) :: list()

  def get_all(query) do
    query = String.downcase(query)

    result =
      from(m in "monologues",
        join: p in "plays",
        on: m.play_id == p.id,
        where:
          ilike(p.title, ^"%#{query}%") or
            ilike(m.location, ^"%#{query}%") or
            ilike(m.character, ^"%#{query}%") or
            ilike(m.body, ^"%#{query}%"),
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
