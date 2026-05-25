defmodule MonoPhoenixV01.Accounts.Repo do
  @moduledoc """
  Ecto Repo for the Accounts database (users, tokens, favorites).

  Kept separate from MonoPhoenixV01.Repo (which holds monologues
  content) so a compromise of one database doesn't yield the other.

  ## Gigalixir setup (production — done once per environment)

      gigalixir pg:create
      # Gigalixir prints a new DATABASE_URL. Copy it.
      gigalixir config:set ACCOUNTS_DATABASE_URL=ecto://USER:PASS@HOST/DATABASE

  On deploy, the supervision tree starts this Repo using
  ACCOUNTS_DATABASE_URL (see config/runtime.exs).

  Migrations live in `priv/accounts_repo/migrations/` and run
  automatically via `mix ecto.migrate` because Accounts.Repo is
  in the `ecto_repos:` list in config/config.exs. The migration
  path is set explicitly via `priv: "priv/accounts_repo"` in
  config/config.exs because Ecto's default priv-path derivation
  from the module name's last segment would collide with the main
  Repo (both end in `Repo`).
  """

  use Ecto.Repo,
    otp_app: :mono_phoenix_v01,
    adapter: Ecto.Adapters.Postgres
end
