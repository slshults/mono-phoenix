defmodule MonoPhoenixV01.Play do
  @moduledoc """
  This was an early test. Most of the queries are in the controllers, and/or the live stuff.
  """
  use Ecto.Schema

  schema "titles" do
    field(:title, :string)
    field(:classification, :string)
  end
end
