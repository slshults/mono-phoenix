defmodule MonoPhoenixV01Web.LapsedLiveTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Mox
  import Phoenix.LiveViewTest
  import MonoPhoenixV01.AccountsFixtures

  setup :verify_on_exit!

  defp put_lapsed_user(conn, user) do
    conn
    |> Phoenix.ConnTest.init_test_session(%{})
    |> Plug.Conn.put_session(:lapsed_user_id, user.id)
  end

  describe "GET /account/lapsed without lapsed_user_id in session" do
    test "redirects home", %{conn: conn} do
      assert {:error, {:redirect, %{to: "/"}}} = live(conn, ~p"/account/lapsed")
    end
  end

  describe "GET /account/lapsed with lapsed_user_id" do
    test "renders the modal copy", %{conn: conn} do
      user = lapsed_user_fixture()
      conn = put_lapsed_user(conn, user)

      {:ok, _lv, html} = live(conn, ~p"/account/lapsed")

      assert html =~ "Your payment has lapsed"
      assert html =~ "Click here to renew"
      assert html =~ "Continue with ads"
    end
  end

  describe "Renew button" do
    test "redirects to Stripe Checkout for the user's billing_period", %{conn: conn} do
      user = lapsed_user_fixture()
      conn = put_lapsed_user(conn, user)

      MonoPhoenixV01.BillingMock
      |> expect(:create_checkout_session, fn params ->
        assert [%{price: "price_test_yearly", quantity: 1}] = params.line_items
        {:ok, %{url: "https://stripe/renew", id: "cs_R"}}
      end)

      {:ok, lv, _html} = live(conn, ~p"/account/lapsed")

      assert lv |> element(~s|button[phx-click="renew"]|) |> render_click() ==
               {:error, {:redirect, %{to: "https://stripe/renew", status: 302}}}
    end
  end

  describe "Continue with ads button" do
    test "redirects through dismiss endpoint (clears :lapsed_user_id), no session created",
         %{conn: conn} do
      user = lapsed_user_fixture()
      conn = put_lapsed_user(conn, user)

      {:ok, lv, _html} = live(conn, ~p"/account/lapsed")

      # The LV redirects to the controller endpoint that drops
      # `:lapsed_user_id` from the session — see SHOULD #6 from the
      # security review.
      assert lv |> element(~s|button[phx-click="continue_with_ads"]|) |> render_click() ==
               {:error, {:redirect, %{to: "/account/lapsed/dismiss", status: 302}}}
    end

    test "/account/lapsed/dismiss clears :lapsed_user_id and redirects home",
         %{conn: conn} do
      user = lapsed_user_fixture()
      conn = put_lapsed_user(conn, user)

      conn = get(conn, ~p"/account/lapsed/dismiss")

      assert redirected_to(conn) == "/"
      assert get_session(conn, :lapsed_user_id) == nil
      refute get_session(conn, :user_token)
    end
  end
end
