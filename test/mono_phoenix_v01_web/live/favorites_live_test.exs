defmodule MonoPhoenixV01Web.FavoritesLiveTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Phoenix.LiveViewTest
  import MonoPhoenixV01.AccountsFixtures

  describe "access control" do
    test "unauthenticated visitor is redirected to log-in", %{conn: conn} do
      assert {:error, {:redirect, %{to: path}}} = live(conn, ~p"/favorites")
      assert path == ~p"/users/log-in"
    end

    test "lapsed patron is redirected by the require_patron plug", %{conn: conn} do
      user = lapsed_user_fixture()
      conn = log_in_user(conn, user)

      assert {:error, {:redirect, %{to: path}}} = live(conn, ~p"/favorites")
      # RequirePatron flashes an error and redirects home.
      assert path == "/"
    end
  end

  describe "empty state" do
    test "active patron with no favorites sees the empty-state copy", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      {:ok, _lv, html} = live(conn, ~p"/favorites")

      assert html =~ "Your favorites"
      assert html =~ "haven&#39;t favorited any monologues" or html =~ "haven't favorited"
    end
  end
end
