ExUnit.start()

# Both repos run in manual sandbox mode. The Accounts repo (users/auth/Stripe)
# is set up by the `test` mix alias via migrations; the main MonoPhoenixV01.Repo
# (monologues/plays) is loaded from priv/repo/structure.sql by the same alias,
# since its schema predates Ecto migrations. Tests that touch monologues data
# use MonoPhoenixV01.MonologuesDataCase.
Ecto.Adapters.SQL.Sandbox.mode(MonoPhoenixV01.Accounts.Repo, :manual)
Ecto.Adapters.SQL.Sandbox.mode(MonoPhoenixV01.Repo, :manual)

# Mox mock for the Stripe client. config/test.exs sets
# :stripe_client → MonoPhoenixV01.BillingMock; Billing reads that and
# routes all Stripe calls through this mock in tests. Per-test
# expectations live in the individual test files.
Mox.defmock(MonoPhoenixV01.BillingMock,
  for: MonoPhoenixV01.Billing.StripeClient
)
