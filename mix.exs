defmodule MonoPhoenixV01.MixProject do
  use Mix.Project

  def project do
    [
      app: :mono_phoenix_v01,
      version: "0.1.0",
      elixir: "~> 1.15",
      elixirc_paths: elixirc_paths(Mix.env()),
      # compilers: [] ++ Mix.compilers(), no longer needed in Elixir 1.14+
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      listeners: [Phoenix.CodeReloader]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {MonoPhoenixV01.Application, []},
      extra_applications: [:logger, :runtime_tools, :os_mon]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.8.0"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.6"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_html_helpers, "~> 1.0"},
      {:phoenix_view, "~> 2.0"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 1.0.0"},
      {:phoenix_live_dashboard, "~> 0.8"},
      {:esbuild, "~> 0.4", runtime: Mix.env() == :dev},
      {:swoosh, "~> 1.3"},
      {:gen_smtp, "~> 1.0"},
      {:certifi, "~> 2.9"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.22.1"},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.5"},
      {:redirect, "~> 0.4.0"},
      {:tesla, "~> 1.8"},
      # Mint is the HTTP engine behind Tesla.Adapter.Mint, used by
      # AnthropicService. We switched away from Tesla.Adapter.Hackney
      # to let stripity_stripe 3.3+ pull hackney 4.x transitively.
      {:mint, "~> 1.0"},
      {:castore, "~> 1.0"},
      # Force hackney 4 even though Swoosh declares `hackney ~> 1.9`
      # as an optional dep. Swoosh only uses hackney for HTTP-based
      # mail adapters (Mailgun, SendGrid, etc.); we use SMTP via
      # gen_smtp, so Swoosh never touches hackney at runtime — the
      # override is safe.
      {:hackney, "~> 4.0", override: true},
      {:html_assertion, "0.1.5", only: :test},
      {:floki, ">= 0.34.2", only: :test},
      {:credo, "~> 1.6", only: [:dev, :test], runtime: false},
      {:earmark, "~> 1.4"},
      {:oban, "~> 2.22"},
      {:bcrypt_elixir, "~> 3.0"},
      {:stripity_stripe, "~> 3.3.1"},
      {:mox, "~> 1.1", only: :test}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: [
        "ecto.create --quiet --repo MonoPhoenixV01.Accounts.Repo",
        "ecto.migrate --quiet --repo MonoPhoenixV01.Accounts.Repo",
        "test"
      ],
      "assets.deploy": [
        "esbuild default --minify --sourcemap=external",
        "cmd bash scripts/upload_sourcemaps.sh",
        "phx.digest"
      ]
    ]
  end
end
