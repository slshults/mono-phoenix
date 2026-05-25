defmodule MonoPhoenixV01Web.SignupControllerTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Mox
  import MonoPhoenixV01.AccountsFixtures

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Billing

  setup :verify_on_exit!

  describe "GET /signup/success" do
    test "with a paid session AND valid signup token: flips user active, creates session, redirects to /welcome",
         %{conn: conn} do
      user = pending_user_fixture()
      future = DateTime.utc_now() |> DateTime.add(365, :day) |> DateTime.to_unix()

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _id, opts ->
        assert opts == %{expand: ["subscription"]}

        {:ok,
         %Stripe.Checkout.Session{
           payment_status: "paid",
           client_reference_id: to_string(user.id),
           metadata: %{"billing_period" => "yearly", "user_id" => to_string(user.id)},
           subscription: %Stripe.Subscription{
             id: "sub_TEST",
             current_period_end: future
           }
         }}
      end)

      token = Billing.sign_signup_token(user.id)
      conn = get(conn, ~p"/signup/success?session_id=cs_TEST&t=#{token}")

      assert get_session(conn, :user_token)
      assert redirected_to(conn) == ~p"/welcome"

      reloaded = Accounts.get_user!(user.id)
      assert reloaded.subscription_status == "active"
    end

    test "with paid session but MISSING token: still marks active, but redirects to log-in (no auto-session)",
         %{conn: conn} do
      user = pending_user_fixture()
      future = DateTime.utc_now() |> DateTime.add(365, :day) |> DateTime.to_unix()

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _id, _opts ->
        {:ok,
         %Stripe.Checkout.Session{
           payment_status: "paid",
           client_reference_id: to_string(user.id),
           metadata: %{"billing_period" => "yearly", "user_id" => to_string(user.id)},
           subscription: %Stripe.Subscription{
             id: "sub_TEST",
             current_period_end: future
           }
         }}
      end)

      conn = get(conn, ~p"/signup/success?session_id=cs_TEST")

      refute get_session(conn, :user_token)
      assert redirected_to(conn) == ~p"/users/log-in"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Please log in"
      assert Accounts.get_user!(user.id).subscription_status == "active"
    end

    test "with paid session but token for a DIFFERENT user: redirects to log-in (no auto-session)",
         %{conn: conn} do
      paying_user = pending_user_fixture()
      attacker = user_fixture()
      future = DateTime.utc_now() |> DateTime.add(365, :day) |> DateTime.to_unix()

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _id, _opts ->
        {:ok,
         %Stripe.Checkout.Session{
           payment_status: "paid",
           client_reference_id: to_string(paying_user.id),
           metadata: %{
             "billing_period" => "yearly",
             "user_id" => to_string(paying_user.id)
           },
           subscription: %Stripe.Subscription{
             id: "sub_TEST",
             current_period_end: future
           }
         }}
      end)

      # Attacker forges a token for THEIR id, intercepts the paying
      # user's cs_… and tries to claim the account.
      stolen_token = Billing.sign_signup_token(attacker.id)
      conn = get(conn, ~p"/signup/success?session_id=cs_TEST&t=#{stolen_token}")

      refute get_session(conn, :user_token)
      assert redirected_to(conn) == ~p"/users/log-in"
    end

    test "with an unpaid session: flash error, redirect home, no session",
         %{conn: conn} do
      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _, _ ->
        {:ok,
         %Stripe.Checkout.Session{
           payment_status: "unpaid",
           client_reference_id: "1",
           metadata: %{},
           subscription: nil
         }}
      end)

      conn = get(conn, ~p"/signup/success?session_id=cs_BAD")

      refute get_session(conn, :user_token)
      assert redirected_to(conn) == ~p"/"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~ "couldn't verify"
    end

    test "with missing session_id: flash error", %{conn: conn} do
      conn = get(conn, ~p"/signup/success")
      assert redirected_to(conn) == ~p"/"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~ "Missing"
    end

    test "is idempotent: a second hit on the same session_id doesn't corrupt user state",
         %{conn: conn} do
      user = pending_user_fixture()
      future = DateTime.utc_now() |> DateTime.add(365, :day) |> DateTime.to_unix()

      session_payload = %Stripe.Checkout.Session{
        payment_status: "paid",
        client_reference_id: to_string(user.id),
        metadata: %{"billing_period" => "yearly", "user_id" => to_string(user.id)},
        subscription: %Stripe.Subscription{
          id: "sub_TEST",
          current_period_end: future
        }
      }

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, 2, fn _id, _opts -> {:ok, session_payload} end)

      token = Billing.sign_signup_token(user.id)
      conn1 = get(conn, ~p"/signup/success?session_id=cs_TEST&t=#{token}")
      assert get_session(conn1, :user_token)
      assert redirected_to(conn1) == ~p"/welcome"
      first = Accounts.get_user!(user.id)
      assert first.subscription_status == "active"
      assert first.stripe_subscription_id == "sub_TEST"

      # Second hit (e.g. user reloads the success URL) — should still
      # redirect cleanly and must not regress the user's state.
      conn2 = get(build_conn(), ~p"/signup/success?session_id=cs_TEST&t=#{token}")
      assert redirected_to(conn2) == ~p"/welcome"

      reloaded = Accounts.get_user!(user.id)
      assert reloaded.subscription_status == "active"
      assert reloaded.stripe_subscription_id == "sub_TEST"
      assert reloaded.billing_period == "yearly"
    end
  end

  describe "GET /signup/cancel" do
    test "deletes a pending user identified by the canceled session's customer",
         %{conn: conn} do
      user = pending_user_fixture()
      {:ok, user} = Accounts.attach_stripe_customer(user, "cus_PEND")

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _, _ ->
        {:ok, %Stripe.Checkout.Session{customer: "cus_PEND"}}
      end)

      conn = get(conn, ~p"/signup/cancel?session_id=cs_X")

      assert redirected_to(conn) == ~p"/"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Signup canceled"
      assert Accounts.get_user_by_email(user.email) == nil
    end

    test "is a no-op (still redirects with flash) when the user is already active",
         %{conn: conn} do
      user = user_fixture()

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _, _ ->
        {:ok, %Stripe.Checkout.Session{customer: user.stripe_customer_id}}
      end)

      conn = get(conn, ~p"/signup/cancel?session_id=cs_LATE")

      assert redirected_to(conn) == ~p"/"
      assert Accounts.get_user!(user.id).subscription_status == "active"
    end

    test "with missing session_id: just flashes + redirects", %{conn: conn} do
      conn = get(conn, ~p"/signup/cancel")
      assert redirected_to(conn) == ~p"/"
    end
  end
end
