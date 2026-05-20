defmodule MonoPhoenixV01.Billing.StripeClient do
  @moduledoc """
  Thin adapter around the `stripity_stripe` package. Defines a behaviour
  so tests can inject a mock implementation.

  Production code goes through `MonoPhoenixV01.Billing`, which resolves
  this module by default via `Application.get_env(:mono_phoenix_v01,
  :stripe_client)`. Tests configure `:stripe_client` to a Mox-defined
  mock module in `config/test.exs`.
  """

  @callback create_customer(params :: map()) ::
              {:ok, map()} | {:error, term()}
  @callback create_checkout_session(params :: map()) ::
              {:ok, map()} | {:error, term()}
  @callback retrieve_checkout_session(id :: String.t(), params :: map()) ::
              {:ok, map()} | {:error, term()}
  @callback retrieve_subscription(id :: String.t()) ::
              {:ok, map()} | {:error, term()}
  @callback create_portal_session(params :: map()) ::
              {:ok, map()} | {:error, term()}
  @callback construct_webhook_event(
              payload :: String.t(),
              sig_header :: String.t(),
              secret :: String.t()
            ) :: {:ok, Stripe.Event.t()} | {:error, term()}

  @behaviour __MODULE__

  @impl true
  def create_customer(params), do: Stripe.Customer.create(params)

  @impl true
  def create_checkout_session(params), do: Stripe.Checkout.Session.create(params)

  @impl true
  def retrieve_checkout_session(id, params),
    do: Stripe.Checkout.Session.retrieve(id, params)

  @impl true
  def retrieve_subscription(id), do: Stripe.Subscription.retrieve(id)

  @impl true
  def create_portal_session(params),
    do: Stripe.BillingPortal.Session.create(params)

  @impl true
  def construct_webhook_event(payload, sig_header, secret),
    do: Stripe.Webhook.construct_event(payload, sig_header, secret)
end
