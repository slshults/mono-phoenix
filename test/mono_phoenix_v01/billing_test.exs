defmodule MonoPhoenixV01.BillingTest do
  use MonoPhoenixV01.DataCase, async: true

  import Mox
  import MonoPhoenixV01.AccountsFixtures

  alias MonoPhoenixV01.Billing

  setup :verify_on_exit!

  describe "ensure_stripe_customer/1" do
    test "creates a Stripe customer and attaches the id when missing" do
      user = pending_user_fixture()

      MonoPhoenixV01.BillingMock
      |> expect(:create_customer, fn params ->
        assert params.email == user.email
        assert params.metadata == %{"user_id" => to_string(user.id)}
        {:ok, %{id: "cus_TEST123"}}
      end)

      assert {:ok, updated} = Billing.ensure_stripe_customer(user)
      assert updated.stripe_customer_id == "cus_TEST123"
    end

    test "is a no-op when the user already has a customer id" do
      user = %MonoPhoenixV01.Accounts.User{stripe_customer_id: "cus_already"}

      # No expectations on the mock → if it were called, verify_on_exit!
      # would fail the test.
      assert {:ok, ^user} = Billing.ensure_stripe_customer(user)
    end

    test "returns the error from Stripe if customer creation fails" do
      user = pending_user_fixture()

      MonoPhoenixV01.BillingMock
      |> expect(:create_customer, fn _ -> {:error, :rate_limited} end)

      assert {:error, :rate_limited} = Billing.ensure_stripe_customer(user)
    end
  end

  describe "create_checkout_session/2" do
    setup do
      user = pending_user_fixture()
      {:ok, user} = MonoPhoenixV01.Accounts.attach_stripe_customer(user, "cus_TEST")
      %{user: user}
    end

    test "builds correct params for yearly", %{user: user} do
      MonoPhoenixV01.BillingMock
      |> expect(:create_checkout_session, fn params ->
        assert params.mode == "subscription"
        assert params.customer == "cus_TEST"
        assert params.client_reference_id == to_string(user.id)
        assert params.metadata["billing_period"] == "yearly"
        assert [%{price: "price_test_yearly", quantity: 1}] = params.line_items
        assert params.allow_promotion_codes == true
        assert String.contains?(params.success_url, "/signup/success")
        assert String.contains?(params.cancel_url, "/signup/cancel")

        {:ok, %{url: "https://stripe/checkout/xyz", id: "cs_test"}}
      end)

      assert {:ok, %{url: url}} = Billing.create_checkout_session(user, "yearly")
      assert url == "https://stripe/checkout/xyz"
    end

    test "uses the monthly price id when billing_period is monthly", %{user: user} do
      MonoPhoenixV01.BillingMock
      |> expect(:create_checkout_session, fn params ->
        assert [%{price: "price_test_monthly", quantity: 1}] = params.line_items
        {:ok, %{url: "u", id: "cs"}}
      end)

      assert {:ok, _} = Billing.create_checkout_session(user, "monthly")
    end
  end

  describe "verify_checkout_session/1" do
    test "returns enriched data when payment_status is paid" do
      session_id = "cs_paid"
      now = DateTime.utc_now() |> DateTime.add(30, :day) |> DateTime.to_unix()

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn id, opts ->
        assert id == session_id
        assert opts == %{expand: ["subscription"]}

        {:ok,
         %Stripe.Checkout.Session{
           payment_status: "paid",
           client_reference_id: "42",
           metadata: %{"billing_period" => "yearly", "user_id" => "42"},
           subscription: %Stripe.Subscription{
             id: "sub_X",
             items: %{data: [%{current_period_end: now}]}
           }
         }}
      end)

      assert {:ok, data} = Billing.verify_checkout_session(session_id)
      assert data.stripe_subscription_id == "sub_X"
      assert data.billing_period == "yearly"
      assert data.user_id == 42
      assert %DateTime{} = data.current_period_end
    end

    test "returns :not_paid tuple when payment_status is not paid" do
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

      assert {:error, {:not_paid, "unpaid"}} =
               Billing.verify_checkout_session("cs_unpaid")
    end

    test "passes through Stripe errors" do
      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_checkout_session, fn _, _ -> {:error, :no_such_session} end)

      assert {:error, :no_such_session} =
               Billing.verify_checkout_session("cs_bogus")
    end
  end

  describe "create_portal_session/1" do
    test "calls Stripe portal session with user's customer id" do
      user = %MonoPhoenixV01.Accounts.User{stripe_customer_id: "cus_X"}

      MonoPhoenixV01.BillingMock
      |> expect(:create_portal_session, fn params ->
        assert params.customer == "cus_X"
        assert String.ends_with?(params.return_url, "/account")
        {:ok, %{url: "https://portal/X"}}
      end)

      assert {:ok, %{url: "https://portal/X"}} = Billing.create_portal_session(user)
    end

    test "returns :no_stripe_customer when user has no customer id" do
      user = %MonoPhoenixV01.Accounts.User{stripe_customer_id: nil}
      assert {:error, :no_stripe_customer} = Billing.create_portal_session(user)
    end
  end

  describe "construct_webhook_event/2" do
    test "delegates to the stripe client with the configured secret" do
      MonoPhoenixV01.BillingMock
      |> expect(:construct_webhook_event, fn payload, sig, secret ->
        assert payload == "raw_payload"
        assert sig == "t=123,v1=abc"
        assert secret == "whsec_test_dummy"

        {:ok, %Stripe.Event{type: "ping", data: %{}}}
      end)

      assert {:ok, %Stripe.Event{type: "ping"}} =
               Billing.construct_webhook_event("raw_payload", "t=123,v1=abc")
    end

    test "rejects missing payload/signature" do
      assert {:error, :missing_payload_or_signature} =
               Billing.construct_webhook_event(nil, "sig")

      assert {:error, :missing_payload_or_signature} =
               Billing.construct_webhook_event("payload", nil)
    end
  end
end
