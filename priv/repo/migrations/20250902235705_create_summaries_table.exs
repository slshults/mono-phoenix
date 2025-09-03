defmodule MonoPhoenixV01.Repo.Migrations.CreateSummariesTable do
  use Ecto.Migration

  def change do
    create table(:summaries) do
      add :content_type, :string, null: false
      add :identifier, :string, null: false
      add :content, :text, null: false
      
      add :created_at, :utc_datetime, null: false, default: fragment("NOW()")
      add :updated_at, :utc_datetime, null: false, default: fragment("NOW()")
    end

    create unique_index(:summaries, [:content_type, :identifier])
    create index(:summaries, [:content_type])
  end
end
