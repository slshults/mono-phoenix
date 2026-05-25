defmodule MonoPhoenixV01.DataCase do
  @moduledoc """
  Test case template for tests that interact with the database
  via the Accounts repo. Sets up a sandbox transaction per test.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias MonoPhoenixV01.Accounts.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import MonoPhoenixV01.DataCase
    end
  end

  setup tags do
    MonoPhoenixV01.DataCase.setup_sandbox(tags)
    :ok
  end

  def setup_sandbox(tags) do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(MonoPhoenixV01.Accounts.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
  end

  @doc "Transforms changeset errors into a map of messages."
  def errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end
end
