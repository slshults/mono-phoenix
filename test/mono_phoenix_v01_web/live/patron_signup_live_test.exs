defmodule MonoPhoenixV01Web.PatronSignupLiveTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Mox
  import Phoenix.LiveViewTest
  import MonoPhoenixV01.AccountsFixtures

  alias MonoPhoenixV01.Accounts

  setup :verify_on_exit!

  defp expect_stripe_happy_path(billing_period) do
    MonoPhoenixV01.BillingMock
    |> expect(:create_customer, fn _ -> {:ok, %{id: "cus_NEW"}} end)
    |> expect(:create_checkout_session, fn params ->
      assert params.metadata["billing_period"] == billing_period
      {:ok, %{url: "https://stripe/checkout/abc", id: "cs_NEW"}}
    end)
  end

  describe "GET /signup" do
    test "renders the form with copy blocks", %{conn: conn} do
      {:ok, _lv, html} = live(conn, ~p"/signup")
      assert html =~ "Support the site"
      assert html =~ "very important"
      assert html =~ "Cancel anytime"
      assert html =~ "$10 per year"
      assert html =~ "$1.25 per month"
    end
  end

  describe "POST /signup (submit)" do
    test "with valid attrs: creates pending user and redirects to Stripe Checkout",
         %{conn: conn} do
      expect_stripe_happy_path("yearly")

      {:ok, lv, _html} = live(conn, ~p"/signup")

      result =
        lv
        |> form("#patron_signup_form", %{
          "user" => %{"email" => "new@example.com", "billing_period" => "yearly"}
        })
        |> render_submit()

      assert {:error, {:redirect, %{to: "https://stripe/checkout/abc"}}} = result

      user = Accounts.get_user_by_email("new@example.com")
      assert user
      assert user.subscription_status == "pending_payment"
      assert user.stripe_customer_id == "cus_NEW"
    end

    test "with existing active email: shows 'already have an account' modal",
         %{conn: conn} do
      existing = user_fixture()

      {:ok, lv, _html} = live(conn, ~p"/signup")

      html =
        lv
        |> form("#patron_signup_form", %{
          "user" => %{"email" => existing.email, "billing_period" => "yearly"}
        })
        |> render_submit()

      assert html =~ "You already have an account"
      assert html =~ existing.email
    end

    test "with existing pending email: deletes old row and proceeds",
         %{conn: conn} do
      _old = pending_user_fixture(%{"email" => "pending@example.com"})
      expect_stripe_happy_path("monthly")

      {:ok, lv, _html} = live(conn, ~p"/signup")

      assert {:error, {:redirect, %{to: _}}} =
               lv
               |> form("#patron_signup_form", %{
                 "user" => %{"email" => "pending@example.com", "billing_period" => "monthly"}
               })
               |> render_submit()

      # Old row was deleted and replaced (same email, but a fresh row).
      reloaded = Accounts.get_user_by_email("pending@example.com")
      assert reloaded
      assert reloaded.billing_period == "monthly"
    end

    test "with invalid email: re-renders form with errors",
         %{conn: conn} do
      {:ok, lv, _html} = live(conn, ~p"/signup")

      html =
        lv
        |> form("#patron_signup_form", %{
          "user" => %{"email" => "no-at-sign", "billing_period" => "yearly"}
        })
        |> render_submit()

      assert html =~ "must have the @ sign"
    end
  end
end
