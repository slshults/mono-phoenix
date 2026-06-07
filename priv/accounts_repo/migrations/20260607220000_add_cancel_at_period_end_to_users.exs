defmodule MonoPhoenixV01.Accounts.Repo.Migrations.AddCancelAtPeriodEndToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :cancel_at_period_end, :boolean, null: false, default: false
    end
  end
end
