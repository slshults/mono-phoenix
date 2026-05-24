defmodule MonoPhoenixV01.Favorites.Favorite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "favorites" do
    belongs_to :user, MonoPhoenixV01.Accounts.User
    field :monologue_id, :integer
    timestamps(updated_at: false)
  end

  def changeset(favorite, attrs) do
    favorite
    |> cast(attrs, [:user_id, :monologue_id])
    |> validate_required([:user_id, :monologue_id])
    |> unique_constraint([:user_id, :monologue_id])
  end
end
