defmodule MonoPhoenixV01Web.ConnCase do
  @moduledoc """
  Test case template for controller and LiveView tests.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      use MonoPhoenixV01Web, :verified_routes

      import Plug.Conn
      import Phoenix.ConnTest
      import MonoPhoenixV01Web.ConnCase

      alias MonoPhoenixV01Web.Router.Helpers, as: Routes

      @endpoint MonoPhoenixV01Web.Endpoint
    end
  end

  setup tags do
    MonoPhoenixV01.DataCase.setup_sandbox(tags)
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  @doc """
  Setup helper that registers and logs in users.

      setup :register_and_log_in_user

  It stores an updated connection and a registered user in the
  test context.
  """
  def register_and_log_in_user(%{conn: conn} = context) do
    user = MonoPhoenixV01.AccountsFixtures.user_fixture()
    scope = MonoPhoenixV01.Accounts.Scope.for_user(user)

    opts =
      context
      |> Map.take([:token_authenticated_at])
      |> Enum.into([])

    %{conn: log_in_user(conn, user, opts), user: user, scope: scope}
  end

  @doc """
  Logs the given `user` into the `conn`.

  It returns an updated `conn`.
  """
  def log_in_user(conn, user, opts \\ []) do
    token = MonoPhoenixV01.Accounts.generate_user_session_token(user)

    maybe_set_token_authenticated_at(token, opts[:token_authenticated_at])

    conn
    |> Phoenix.ConnTest.init_test_session(%{})
    |> Plug.Conn.put_session(:user_token, token)
  end

  defp maybe_set_token_authenticated_at(_token, nil), do: nil

  defp maybe_set_token_authenticated_at(token, authenticated_at) do
    MonoPhoenixV01.AccountsFixtures.override_token_authenticated_at(token, authenticated_at)
  end
end
