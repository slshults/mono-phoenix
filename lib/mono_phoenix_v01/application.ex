defmodule MonoPhoenixV01.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      MonoPhoenixV01.Repo,
      # Start the Telemetry supervisor
      MonoPhoenixV01Web.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: MonoPhoenixV01.PubSub},
      # Start the Endpoint (http/https)
      MonoPhoenixV01Web.Endpoint
      # Start a worker by calling: MonoPhoenixV01.Worker.start_link(arg)
      # {MonoPhoenixV01.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MonoPhoenixV01.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MonoPhoenixV01Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
