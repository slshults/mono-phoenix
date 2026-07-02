defmodule MonoPhoenixV01Web.AccountLiveTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Mox
  import Phoenix.LiveViewTest
  import MonoPhoenixV01.AccountsFixtures

  setup :verify_on_exit!

  # /account mount calls Stripe to check for a scheduled cancellation
  # on any active user. Tests that don't care about that state stub a
  # "no cancel" response.
  defp stub_not_canceling do
    MonoPhoenixV01.BillingMock
    |> stub(:retrieve_subscription, fn _ ->
      {:ok, %Stripe.Subscription{cancel_at: nil, cancel_at_period_end: false}}
    end)
  end

  describe "GET /account" do
    test "redirects unauthenticated visitors to log-in", %{conn: conn} do
      assert {:error, {:redirect, %{to: path}}} = live(conn, ~p"/account")
      assert path == ~p"/users/log-in"
    end

    test "renders subscription details for the logged-in user", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)
      stub_not_canceling()

      {:ok, _lv, html} = live(conn, ~p"/account")

      assert html =~ "Your account"
      assert html =~ user.email
      assert html =~ "Active"
      assert html =~ "yearly"
      assert html =~ "Manage subscription"
    end

    test "shows pending cancellation when Stripe reports cancel_at (current API)", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      MonoPhoenixV01.BillingMock
      |> stub(:retrieve_subscription, fn _ ->
        {:ok, %Stripe.Subscription{cancel_at: 1_782_520_397, cancel_at_period_end: false}}
      end)

      {:ok, _lv, html} = live(conn, ~p"/account")

      assert html =~ "Cancelled at the end of the current period"
      assert html =~ "Cancelled"
      refute html =~ "Active 🙏"
    end

    test "shows pending cancellation when Stripe reports cancel_at_period_end (legacy fallback)",
         %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      MonoPhoenixV01.BillingMock
      |> stub(:retrieve_subscription, fn _ ->
        {:ok, %Stripe.Subscription{cancel_at: nil, cancel_at_period_end: true}}
      end)

      {:ok, _lv, html} = live(conn, ~p"/account")

      assert html =~ "Cancelled at the end of the current period"
      refute html =~ "Active 🙏"
    end

    test "falls through to Active when Stripe lookup fails", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)

      MonoPhoenixV01.BillingMock
      |> stub(:retrieve_subscription, fn _ -> {:error, :stripe_unavailable} end)

      {:ok, _lv, html} = live(conn, ~p"/account")

      assert html =~ "Active"
      refute html =~ "Cancelled at the end of the current period"
    end
  end

  describe "open_portal click" do
    test "redirects to Stripe Customer Portal URL", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)
      stub_not_canceling()

      MonoPhoenixV01.BillingMock
      |> expect(:create_portal_session, fn params ->
        assert params.customer == user.stripe_customer_id
        {:ok, %{url: "https://stripe/portal/X"}}
      end)

      {:ok, lv, _html} = live(conn, ~p"/account")

      assert lv |> element("button", "Manage subscription") |> render_click() ==
               {:error, {:redirect, %{to: "https://stripe/portal/X", status: 302}}}
    end

    test "flashes an error when portal creation fails", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)
      stub_not_canceling()

      MonoPhoenixV01.BillingMock
      |> expect(:create_portal_session, fn _ -> {:error, :stripe_unavailable} end)

      {:ok, lv, _html} = live(conn, ~p"/account")

      html = lv |> element("button", "Manage subscription") |> render_click()
      assert html =~ "couldn"
      assert html =~ "open the billing portal"
    end
  end
end
