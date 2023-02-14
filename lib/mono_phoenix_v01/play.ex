defmodule MonoPhoenixV01.Play do
  @moduledoc """
  This module provides the schema for the title from the Plays table.
  """
  use Ecto.Schema

  schema "titles" do
    field(:title, :string)
    field(:classification, :string)
  end
end
