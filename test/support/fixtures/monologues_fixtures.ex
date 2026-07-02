defmodule MonoPhoenixV01.MonologuesFixtures do
  @moduledoc """
  Fixtures for the main (monologues) DB. The `plays` and `monologues` tables
  have no Ecto schema modules — queries run as raw Ecto against the table
  names — so these fixtures insert rows directly with `insert_all`.

  Only `id` is NOT NULL on either table, so callers override just the fields
  their assertions care about.
  """

  alias MonoPhoenixV01.Repo

  @doc """
  Inserts the three standard gender rows the men/women search filters join on
  (matching the prod data: 1=Both, 2=Women, 3=Men). Returns a name→id map.
  """
  def gender_fixtures do
    rows = [
      %{id: 1, name: "Both"},
      %{id: 2, name: "Women"},
      %{id: 3, name: "Men"}
    ]

    {3, _} = Repo.insert_all("genders", rows)
    %{both: 1, women: 2, men: 3}
  end

  @doc """
  Inserts a play. Pass `:id` and `:title` (both optional). Returns the row map.
  """
  def play_fixture(attrs \\ %{}) do
    row =
      %{id: System.unique_integer([:positive]), title: "Some Play"}
      |> Map.merge(Map.new(attrs))

    {1, _} = Repo.insert_all("plays", [Map.take(row, [:id, :title])])
    row
  end

  @doc """
  Inserts a monologue. Override any of the searchable fields (`:play_id`,
  `:character`, `:location`, `:first_line`, `:body`, `:style`, `:body_link`,
  `:pdf_link`, `:gender_id`). Returns the row map.
  """
  def monologue_fixture(attrs \\ %{}) do
    row =
      %{
        id: System.unique_integer([:positive]),
        play_id: nil,
        location: nil,
        first_line: nil,
        body: nil,
        character: nil,
        style: nil,
        body_link: nil,
        pdf_link: nil,
        gender_id: nil
      }
      |> Map.merge(Map.new(attrs))

    {1, _} = Repo.insert_all("monologues", [row])
    row
  end
end
