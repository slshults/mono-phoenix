import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

# ## Using releases
#
# If you use `mix release`, you need to explicitly enable the server
# by passing the PHX_SERVER=true when you start it:
#
#     PHX_SERVER=true bin/mono_phoenix_v01 start
#
# Alternatively, you can use `mix phx.gen.release` to generate a `bin/server`
# script that automatically sets the env var above.
if System.get_env("PHX_SERVER") do
  config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint, server: true
end

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  maybe_ipv6 = if System.get_env("ECTO_IPV6"), do: [:inet6], else: []

  # Postgres connection options for prod. The `keepalive` socket option +
  # short `idle_interval` keep pool connections warm so Gigalixir's network
  # layer doesn't drop them after some idle period (we observed
  # `ssl recv (idle): closed` errors before adding these). This protects the
  # Repo's pool but does NOT directly protect Oban's separate Notifier
  # connection — see `lib/mono_phoenix_v01/oban_notifier_health.ex` for that.
  config :mono_phoenix_v01, MonoPhoenixV01.Repo,
    ssl: true,
    ssl_opts: [
      verify: :verify_none,
      cacerts: :public_key.cacerts_get()
    ],
    allowed_tls_versions: [:"tlsv1.2"],
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "2"),
    socket_options: maybe_ipv6 ++ [keepalive: true],
    idle_interval: 30_000

  # The secret key base is used to sign/encrypt cookies and other secrets.
  # A default value is used in config/dev.exs and config/test.exs but you
  # want to use a different value for prod and you most likely don't want
  # to check this value into version control, so we use an environment
  # variable instead.
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "www.shakespeare-monologues.org"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      # Enable IPv6 and bind on all interfaces.
      # Set it to  {0, 0, 0, 0, 0, 0, 0, 1} for local network only access.
      # See the documentation on https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html
      # for details about using IPv6 vs IPv4 and loopback vs public addresses.
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base

  # ## Configuring the mailer
  #
  # In production you need to configure the mailer to use a different adapter.
  # Also, you may need to configure the Swoosh API client of your choice if you
  # are not using SMTP. Here is an example of the configuration:
  #
  #     config :mono_phoenix_v01, MonoPhoenixV01.Mailer,
  #       adapter: Swoosh.Adapters.Mailgun,
  #       api_key: System.get_env("MAILGUN_API_KEY"),
  #       domain: System.get_env("MAILGUN_DOMAIN")
  #
  # For this example you need include a HTTP client required by Swoosh API client.
  # Swoosh supports Hackney and Finch out of the box:
  #
  #     config :swoosh, :api_client, Swoosh.ApiClient.Hackney
  #
  # See https://hexdocs.pm/swoosh/Swoosh.html#module-installation for details.

  # Configure mailer for production - using Google Workspace SMTP with app password
  config :mono_phoenix_v01, MonoPhoenixV01.Mailer,
    adapter: Swoosh.Adapters.SMTP,
    relay: "smtp.gmail.com",
    port: 587,
    username: System.get_env("SMTP_USERNAME"),
    password: System.get_env("SMTP_PASSWORD"),
    ssl: false,
    tls: :always,
    tls_options: [verify: :verify_none],
    auth: :always

  # Configure Swoosh API client for production
  config :swoosh, :api_client, Swoosh.ApiClient.Hackney


  # Anthropic API configuration for Shakespeare summaries
  config :mono_phoenix_v01, :anthropic,
    api_key: System.get_env("ANTHROPIC_API_KEY"),
    model: "claude-sonnet-4-6"

  # Validate required social posting credentials at boot. If any are missing
  # in :prod, raise so the release fails to start and Gigalixir keeps the
  # previous healthy pod serving traffic. Better to fail loud at startup than
  # to schedule a daily cron that silently writes "failed" rows.
  for var <- ~w(BLUESKY_HANDLE BLUESKY_APP_PASSWORD FACEBOOK_PAGE_ID FACEBOOK_PAGE_ACCESS_TOKEN),
      System.get_env(var) in [nil, ""] do
    raise """
    Environment variable #{var} is missing or empty in production.
    Set it with: gigalixir config:set #{var}=...
    Required for the daily Monologue of the Day cron job.
    """
  end

  # Oban plugins for prod. Note: setting `plugins:` to an explicit list opts
  # out of any Oban defaults, so we enumerate everything we want here.
  # Oban 2.17+ folded the old Stager plugin into the queue producers, so
  # there's no Stager to add here (and trying to load it raises at boot).
  #
  # Pruner — keeps oban_jobs from growing unbounded
  # Lifeline — rescues `executing` jobs orphaned by a crashed node
  # Cron — daily MOTD trigger at 13:00 UTC (== 09:00 US Eastern DST,
  #        08:00 EST outside DST). Repo + queues live in config/config.exs.
  config :mono_phoenix_v01, Oban,
    plugins: [
      {Oban.Plugins.Pruner, max_age: 60 * 60 * 24 * 7},
      Oban.Plugins.Lifeline,
      {Oban.Plugins.Cron,
       crontab: [
         {"0 13 * * *", MonoPhoenixV01.DailyMonologue.Scheduler}
       ]}
    ]
end

# Social posting credentials for the daily "Monologue of the Day" job.
# Read in every env (dev/test/prod) so local testing via `export VAR=...`
# works without duplicating config in dev.exs. Adapters return a graceful
# `:credentials_missing` error if the env vars are unset.
#
# Facebook Page Access Tokens derived from a long-lived User token usually
# have "Expires: Never" (verify in the Graph API Access Token Debugger).
# If a token is ever revoked, generate a new one and run:
#   gigalixir config:set FACEBOOK_PAGE_ACCESS_TOKEN=...
config :mono_phoenix_v01, :bluesky,
  handle: System.get_env("BLUESKY_HANDLE"),
  app_password: System.get_env("BLUESKY_APP_PASSWORD")

config :mono_phoenix_v01, :facebook,
  page_id: System.get_env("FACEBOOK_PAGE_ID"),
  page_access_token: System.get_env("FACEBOOK_PAGE_ACCESS_TOKEN")
