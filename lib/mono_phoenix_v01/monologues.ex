defmodule MonoPhoenixV01.Monologues do
  @moduledoc """
  The search query thingy
  """
  import Ecto.Query, warn: false
  alias MonoPhoenixV01.Repo
  alias MonoPhoenixV01.Monologues.Monologue

  def search(search_query) do
    search_query = "%#{search_query}%"

    Monologue
    |> order_by(asc: :body)
    |> where([p], ilike(p.body, ^search_query))
    |> limit(15)
    |> Repo.all()
  end
end
