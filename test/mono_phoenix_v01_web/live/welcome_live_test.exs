defmodule MonoPhoenixV01Web.WelcomeLiveTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Phoenix.LiveViewTest
  import MonoPhoenixV01.AccountsFixtures

  alias MonoPhoenixV01.Accounts

  describe "GET /welcome" do
    test "redirects to login when unauthenticated", %{conn: conn} do
      assert {:error, {:redirect, %{to: path}}} = live(conn, ~p"/welcome")
      assert path == ~p"/users/log-in"
    end

    test "shows the prompt when welcomed_at is nil", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      {:ok, _lv, html} = live(conn, ~p"/welcome")

      assert html =~ "Welcome!"
      assert html =~ "Want to set a password"
      assert html =~ "Set a password"
      assert html =~ "Skip"
    end

    test "hides the prompt when welcomed_at is set", %{conn: conn} do
      user = user_fixture()
      {:ok, _user} = Accounts.mark_welcomed(user)
      conn = log_in_user(conn, user)

      {:ok, _lv, html} = live(conn, ~p"/welcome")

      assert html =~ "Welcome!"
      refute html =~ "Want to set a password"
    end
  end

  describe "Skip click" do
    test "marks welcomed and redirects to /", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      {:ok, lv, _html} = live(conn, ~p"/welcome")

      assert lv |> element("button", "Skip") |> render_click() ==
               {:error, {:live_redirect, %{kind: :push, to: "/"}}}

      assert Accounts.get_user!(user.id).welcomed_at
    end
  end

  describe "Set a password click" do
    test "marks welcomed and redirects to /users/settings", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      {:ok, lv, _html} = live(conn, ~p"/welcome")

      assert lv |> element("button", "Set a password") |> render_click() ==
               {:error, {:live_redirect, %{kind: :push, to: "/users/settings"}}}

      assert Accounts.get_user!(user.id).welcomed_at
    end
  end
end
