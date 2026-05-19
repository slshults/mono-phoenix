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

  @doc "Logs the given user into the conn (for authenticated-route tests)."
  def log_in_user(conn, user) do
    token = MonoPhoenixV01.Accounts.generate_user_session_token(user)

    conn
    |> Phoenix.ConnTest.init_test_session(%{})
    |> Plug.Conn.put_session(:user_token, token)
  end
end
