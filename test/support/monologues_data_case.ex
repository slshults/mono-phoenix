defmodule MonoPhoenixV01.MonologuesDataCase do
  @moduledoc """
  Test case for tests that read the main (monologues) database via
  `MonoPhoenixV01.Repo` — search, play/monologue listings, etc.

  Sets up a sandbox transaction per test and imports the monologues/plays
  fixtures. The schema comes from `priv/repo/structure.sql` (loaded by the
  `test` mix alias), since the monologues tables predate Ecto migrations.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias MonoPhoenixV01.Repo

      import Ecto.Query
      import MonoPhoenixV01.MonologuesFixtures
    end
  end

  setup tags do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(MonoPhoenixV01.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
    :ok
  end
end
