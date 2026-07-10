# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :mono_phoenix_v01, :scopes,
  user: [
    default: true,
    module: MonoPhoenixV01.Accounts.Scope,
    assign_key: :current_scope,
    access_path: [:user, :id],
    schema_key: :user_id,
    schema_type: :id,
    schema_table: :users,
    test_data_fixture: MonoPhoenixV01.AccountsFixtures,
    test_setup_helper: :register_and_log_in_user
  ]

config :mono_phoenix_v01,
  ecto_repos: [MonoPhoenixV01.Repo, MonoPhoenixV01.Accounts.Repo]

# Tell Ecto where to find Accounts.Repo migrations (avoids default
# "priv/repo/migrations" which collides with MonoPhoenixV01.Repo).
config :mono_phoenix_v01, MonoPhoenixV01.Accounts.Repo,
  priv: "priv/accounts_repo"

# Configures the endpoint
config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: MonoPhoenixV01Web.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: MonoPhoenixV01.PubSub,
  live_view: [signing_salt: "UwCow6OD"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :mono_phoenix_v01, MonoPhoenixV01.Mailer, adapter: Swoosh.Adapters.Local

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, false

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.29",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps:../node_modules", __DIR__)}
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# PostHog logs + distributed tracing (see docs/superpowers/specs/
# 2026-07-10-posthog-logs-and-tracing-design.md). Off by default; only
# config/runtime.exs's :prod block turns this on, gated by
# POSTHOG_OTEL_ENABLED. `traces_exporter: :none` keeps the OTel SDK from
# attempting any network connection in dev/test.
config :mono_phoenix_v01, :otel_enabled, false
config :opentelemetry, traces_exporter: :none

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Suppress Tesla deprecated builder warning (soft-deprecated, no action needed yet)
config :tesla, disable_deprecated_builder_warning: true

# Force hackney to negotiate HTTP/1.1 (not HTTP/2) on outbound calls.
# hackney 4.0 defaults to advertising HTTP/2 via ALPN, but stripity_stripe
# still injects a `Connection: keep-alive` header on every request — that
# header is forbidden in HTTP/2 (RFC 7540 §8.1.2.2). On the new Stripe
# account's live API endpoint the negotiation lands on HTTP/2, hackney
# emits the disallowed header, the receiver rejects the frame, and the
# whole request fails with `{:error, %Stripe.Error{extra: %{hackney_reason:
# :protocol_error}}}`. Until stripity_stripe stops sending that header
# (tracked in stripity-stripe issue #905), pinning to HTTP/1.1 here keeps
# Stripe Checkout, webhook fetches, and Customer Portal sessions working.
config :hackney, default_protocols: [:http1]

# Stripe configuration (stripity_stripe). API key + price IDs come from
# environment variables, sourced from `config/.env` in dev or Gigalixir
# env vars in production (see `config/runtime.exs`).
config :stripity_stripe,
  api_key: System.get_env("STRIPE_SECRET_KEY")

config :mono_phoenix_v01, :stripe,
  price_id_monthly: System.get_env("STRIPE_PRICE_ID_MONTHLY"),
  price_id_yearly: System.get_env("STRIPE_PRICE_ID_YEARLY"),
  webhook_secret: System.get_env("STRIPE_WEBHOOK_SECRET")

# Oban background jobs. Cron plugin is added only in production (see
# `config/runtime.exs`) so local servers don't post to BlueSky/Facebook while
# we're just developing.
config :mono_phoenix_v01, Oban,
  repo: MonoPhoenixV01.Repo,
  queues: [default: 10, social: 2]


# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
