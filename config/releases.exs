import Config

# Configure the web server to start in production
config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint, server: true

# Configure PostHog for production environment
if System.get_env("POSTHOG_API_KEY") do
  config :mono_phoenix_v01, :posthog,
    api_key: System.get_env("POSTHOG_API_KEY"),
    host: System.get_env("POSTHOG_HOST") || "https://app.posthog.com"
end