defmodule MonoPhoenixV01.Repo do
  use Ecto.Repo,
    otp_app: :mono_phoenix_v01,
    adapter: Ecto.Adapters.Postgres
end
