defmodule MonoPhoenixV01.Summary do
  @moduledoc """
  Schema for storing AI-generated summaries and paraphrasing.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "summaries" do
    field(:content_type, :string)
    field(:identifier, :string)
    field(:content, :string)
    
    field(:created_at, :utc_datetime)
    field(:updated_at, :utc_datetime)
  end

  @doc false
  def changeset(summary, attrs) do
    summary
    |> cast(attrs, [:content_type, :identifier, :content])
    |> validate_required([:content_type, :identifier, :content])
    |> unique_constraint([:content_type, :identifier])
  end
end