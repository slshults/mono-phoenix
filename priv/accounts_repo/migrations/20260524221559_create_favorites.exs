defmodule MonoPhoenixV01.Accounts.Repo.Migrations.CreateFavorites do
  use Ecto.Migration

  def change do
    create table(:favorites) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :monologue_id, :integer, null: false
      timestamps(updated_at: false)
    end

    create unique_index(:favorites, [:user_id, :monologue_id])
  end
end
