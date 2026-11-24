import Config

# Test config for CI only. config/test.exs is gitignored, so the CI workflow
# copies this file to config/test.exs before running the suite. It holds no
# secrets: the database is a throwaway Postgres service container, and the
# keys below are dummies that only exist inside the CI job.
#
# If you change your local config/test.exs in a way the tests depend on,
# mirror the change here, or CI will fail where your machine passes.

db = [
  username: System.get_env("PGUSER", "postgres"),
  password: System.get_env("PGPASSWORD", "postgres"),
  hostname: System.get_env("PGHOST", "localhost"),
  port: String.to_integer(System.get_env("PGPORT", "5432")),
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: System.schedulers_online() * 2
]

partition = System.get_env("MIX_TEST_PARTITION")

config :mono_phoenix_v01,
       MonoPhoenixV01.Repo,
       db ++ [database: "mono_phoenix_test#{partition}"]

config :mono_phoenix_v01,
       MonoPhoenixV01.Accounts.Repo,
       db ++ [database: "mono_phoenix_accounts_test#{partition}"]

# The suite doesn't start an HTTP server.
config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "ci-only-not-a-secret-ci-only-not-a-secret-ci-only-not-a-secret-0123",
  server: false

config :mono_phoenix_v01, MonoPhoenixV01.Mailer, adapter: Swoosh.Adapters.Test

# Stripe calls go through the Mox mock defined in test/test_helper.exs.
config :mono_phoenix_v01, :stripe_client, MonoPhoenixV01.BillingMock

config :mono_phoenix_v01, :stripe,
  price_id_monthly: "price_ci_monthly",
  price_id_yearly: "price_ci_yearly",
  webhook_secret: "whsec_ci_only"

config :stripity_stripe, api_key: "sk_test_ci_only"

# AnthropicService is mocked with Tesla.Mock in test/test_helper.exs; this
# key never leaves the job.
config :mono_phoenix_v01, :anthropic,
  api_key: "ci-only-not-a-real-key",
  model: "claude-ci-test"

# No background jobs or cron in tests.
config :mono_phoenix_v01, Oban, testing: :manual

config :mono_phoenix_v01, :otel_enabled, false

config :bcrypt_elixir, :log_rounds, 1

config :swoosh, :api_client, false

config :logger, level: :warning

config :phoenix, :plug_init_mode, :runtime

config :phoenix_live_view, enable_expensive_runtime_checks: true
