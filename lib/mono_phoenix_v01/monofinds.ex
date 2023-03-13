defmodule MonoPhoenixV01.Monofinds do
  @moduledoc """
  The search query thingy
  """
  import Ecto.Query, warn: false

  def search(search_query) do
    search_query = "%#{search_query}%"

    query =
      from(m in "monologues",
        where:
          ilike(m.body, ^search_query) or
            ilike(m.location, ^search_query) or
            ilike(m.character, ^search_query) or
            ilike(m.first_line, ^search_query) or
            ilike(m.style, ^search_query)
      )
      |> limit(15)

    rows = MonoPhoenixV01.Repo.all(query)

    rows
  end
end
