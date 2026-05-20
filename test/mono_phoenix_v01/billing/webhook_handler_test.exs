defmodule MonoPhoenixV01.Billing.WebhookHandlerTest do
  use MonoPhoenixV01.DataCase, async: true

  import Mox
  import MonoPhoenixV01.AccountsFixtures

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Billing.WebhookHandler

  setup :verify_on_exit!

  defp event(type, object) do
    %Stripe.Event{type: type, data: %{"object" => object}}
  end

  describe "checkout.session.completed" do
    test "flips matching user to active with the period end" do
      user = pending_user_fixture()
      {:ok, user} = Accounts.attach_stripe_customer(user, "cus_X")

      future = DateTime.utc_now() |> DateTime.add(365, :day) |> DateTime.to_unix()

      MonoPhoenixV01.BillingMock
      |> expect(:retrieve_subscription, fn "sub_X" ->
        {:ok, %Stripe.Subscription{id: "sub_X", current_period_end: future}}
      end)

      session = %{
        "customer" => "cus_X",
        "subscription" => "sub_X",
        "metadata" => %{"billing_period" => "yearly"}
      }

      assert :ok = WebhookHandler.handle(event("checkout.session.completed", session))

      reloaded = Accounts.get_user!(user.id)
      assert reloaded.subscription_status == "active"
      assert reloaded.stripe_subscription_id == "sub_X"
      assert reloaded.billing_period == "yearly"
      assert reloaded.confirmed_at
    end

    test "no-op when customer id doesn't match any user" do
      session = %{
        "customer" => "cus_NOPE",
        "subscription" => "sub_X",
        "metadata" => %{}
      }

      # If retrieve_subscription were called, verify_on_exit! would
      # fail (no expectation set).
      assert :ok = WebhookHandler.handle(event("checkout.session.completed", session))
    end
  end

  describe "customer.subscription.updated" do
    test "updates status when Stripe status maps directly" do
      user = user_fixture()

      sub = %{
        "customer" => user.stripe_customer_id,
        "status" => "past_due",
        "current_period_end" =>
          DateTime.utc_now() |> DateTime.add(7, :day) |> DateTime.to_unix()
      }

      assert :ok = WebhookHandler.handle(event("customer.subscription.updated", sub))

      assert Accounts.get_user!(user.id).subscription_status == "past_due"
    end

    test "normalizes 'unpaid' to 'lapsed'" do
      user = user_fixture()

      sub = %{
        "customer" => user.stripe_customer_id,
        "status" => "unpaid"
      }

      assert :ok = WebhookHandler.handle(event("customer.subscription.updated", sub))
      assert Accounts.get_user!(user.id).subscription_status == "lapsed"
    end

    test "recovers a past_due user back to active with a fresh period_end" do
      user = user_fixture()

      # Push the row into past_due so the recovery has somewhere to come
      # from.
      {:ok, user} =
        Accounts.update_subscription_status(user, %{subscription_status: "past_due"})

      assert user.subscription_status == "past_due"

      fresh_period_end =
        DateTime.utc_now() |> DateTime.add(30, :day) |> DateTime.to_unix()

      sub = %{
        "customer" => user.stripe_customer_id,
        "status" => "active",
        "current_period_end" => fresh_period_end
      }

      assert :ok = WebhookHandler.handle(event("customer.subscription.updated", sub))

      reloaded = Accounts.get_user!(user.id)
      assert reloaded.subscription_status == "active"
      assert DateTime.to_unix(reloaded.current_period_end) == fresh_period_end
    end
  end

  describe "customer.subscription.deleted" do
    test "flips to canceled but does NOT delete the row" do
      user = user_fixture()

      sub = %{"customer" => user.stripe_customer_id, "id" => user.stripe_subscription_id}

      assert :ok = WebhookHandler.handle(event("customer.subscription.deleted", sub))

      reloaded = Accounts.get_user!(user.id)
      assert reloaded.subscription_status == "canceled"
      assert reloaded.email == user.email
    end
  end

  describe "invoice.payment_failed" do
    test "flips user to past_due" do
      user = user_fixture()
      invoice = %{"customer" => user.stripe_customer_id}

      assert :ok = WebhookHandler.handle(event("invoice.payment_failed", invoice))
      assert Accounts.get_user!(user.id).subscription_status == "past_due"
    end
  end

  describe "checkout.session.expired" do
    test "deletes a pending_payment user" do
      user = pending_user_fixture()
      {:ok, user} = Accounts.attach_stripe_customer(user, "cus_PEND")

      session = %{"customer" => "cus_PEND"}
      assert :ok = WebhookHandler.handle(event("checkout.session.expired", session))

      assert Accounts.get_user_by_email(user.email) == nil
    end

    test "refuses to delete an active user (defensive)" do
      user = user_fixture()
      session = %{"customer" => user.stripe_customer_id}

      assert :ok = WebhookHandler.handle(event("checkout.session.expired", session))

      assert Accounts.get_user!(user.id).subscription_status == "active"
    end
  end

  describe "unknown event types" do
    test "are logged-and-ignored, return :ok" do
      assert :ok = WebhookHandler.handle(event("payment_intent.created", %{}))
    end
  end
end
