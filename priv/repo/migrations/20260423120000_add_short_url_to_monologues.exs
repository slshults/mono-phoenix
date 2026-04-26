defmodule MonoPhoenixV01.Repo.Migrations.AddShortUrlToMonologues do
  use Ecto.Migration

  def change do
    alter table(:monologues) do
      add :short_url, :string
    end

    create index(:monologues, [:short_url], unique: true, where: "short_url IS NOT NULL")
  end
end
