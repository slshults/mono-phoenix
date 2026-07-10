defmodule MonoPhoenixV01.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    otel_enabled = Application.get_env(:mono_phoenix_v01, :otel_enabled, false)

    # PostHog distributed tracing (prod only, see config/runtime.exs). Must
    # run before the Endpoint/Repos start so the instrumentation attaches
    # its :telemetry handlers before any request or query fires.
    if otel_enabled do
      :opentelemetry_cowboy.setup()
      OpentelemetryPhoenix.setup(adapter: :cowboy2)
      OpentelemetryEcto.setup([:mono_phoenix_v01, :repo])
      OpentelemetryEcto.setup([:mono_phoenix_v01, :accounts, :repo])
    end

    children =
      [
        # Start the Ecto repository
        MonoPhoenixV01.Repo,
        MonoPhoenixV01.Accounts.Repo,
        # Start the Telemetry supervisor
        MonoPhoenixV01Web.Telemetry,
        # Start the PubSub system
        {Phoenix.PubSub, name: MonoPhoenixV01.PubSub},
        # Background jobs + daily-monologue cron
        {Oban, Application.fetch_env!(:mono_phoenix_v01, Oban)},
        # Watchdog: restarts Oban if its Notifier connection silently goes
        # `:isolated` (the documented Cron silent-failure mode on Gigalixir).
        MonoPhoenixV01.ObanNotifierHealth,
        # Start the Endpoint (http/https)
        MonoPhoenixV01Web.Endpoint
      ] ++ otel_logs_handler_children(otel_enabled)

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MonoPhoenixV01.Supervisor]
    result = Supervisor.start_link(children, opts)

    # Attach the :logger handler only after MonoPhoenixV01.OtelLogsHandler is
    # already running under supervision above — otherwise a log call between
    # `:logger.add_handler/3` and the child starting would crash trying to
    # cast to a not-yet-registered process.
    if otel_enabled do
      :logger.add_handler(:posthog_otel_logs, MonoPhoenixV01.OtelLogsHandler, %{level: :warning})
    end

    result
  end

  defp otel_logs_handler_children(true), do: [MonoPhoenixV01.OtelLogsHandler]
  defp otel_logs_handler_children(false), do: []

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MonoPhoenixV01Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
