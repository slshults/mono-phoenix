defmodule MonoPhoenixV01.Repo.Migrations.CreatePostedMonologues do
  use Ecto.Migration

  def change do
    create table(:posted_monologues) do
      add :monologue_id,     :integer,       null: false
      add :posted_at,        :utc_datetime,  null: false
      add :status,           :string,        null: false
      add :bluesky_uri,      :string
      add :facebook_post_id, :string
      add :error,            :text

      timestamps()
    end

    create index(:posted_monologues, [:monologue_id])
    create index(:posted_monologues, [:posted_at])
    create index(:posted_monologues, [:status])
  end
end
