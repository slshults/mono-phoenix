defmodule MonoPhoenixV01.Accounts.Repo.Migrations.AddStripeFieldsToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :stripe_customer_id, :string
      add :stripe_subscription_id, :string
      add :subscription_status, :string, null: false, default: "pending_payment"
      add :current_period_end, :utc_datetime
      add :billing_period, :string
      add :welcomed_at, :utc_datetime
    end

    create unique_index(:users, [:stripe_customer_id])
    create unique_index(:users, [:stripe_subscription_id])
    create index(:users, [:subscription_status])
  end
end
