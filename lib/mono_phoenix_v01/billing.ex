defmodule MonoPhoenixV01.Billing do
  @moduledoc """
  Stripe wrapper for patron subscriptions.

  App code calls these functions, not `Stripe.*` directly, so we can
  mock the Stripe client in tests via `Application.get_env(:mono_phoenix_v01,
  :stripe_client)`.

  All functions return `{:ok, value}` or `{:error, reason}`.

  ## stripity_stripe 3.x API notes

  - Checkout sessions live at `Stripe.Checkout.Session.create/1` (not
    `Stripe.Session` as some older docs suggest).
  - Customer Portal lives at `Stripe.BillingPortal.Session.create/1`.
  - Webhook events come in as `Stripe.Event` with `data` as a `term` (a
    bare map; stripity_stripe does NOT decode `data.object` into a typed
    struct). Webhook handlers must work with map access.
  """

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Accounts.User

  @doc """
  Returns the configured Stripe client module. Defaults to the
  `MonoPhoenixV01.Billing.StripeClient` adapter that wraps real
  `Stripe.*` calls. Tests inject a Mox-defined mock via config.
  """
  def stripe_client do
    Application.get_env(
      :mono_phoenix_v01,
      :stripe_client,
      MonoPhoenixV01.Billing.StripeClient
    )
  end

  @doc """
  Create a Stripe Customer for `user` (if not already created) and
  attach the customer_id to the user row. Idempotent: returns the
  existing user unchanged if it already has a customer ID.
  """
  def ensure_stripe_customer(%User{stripe_customer_id: cus_id} = user)
      when is_binary(cus_id) and cus_id != "" do
    {:ok, user}
  end

  def ensure_stripe_customer(%User{} = user) do
    case stripe_client().create_customer(%{
           email: user.email,
           metadata: %{"user_id" => to_string(user.id)}
         }) do
      {:ok, %{id: cus_id}} ->
        Accounts.attach_stripe_customer(user, cus_id)

      {:error, _} = err ->
        err
    end
  end

  @doc """
  Build a Stripe Checkout Session for `user` and the chosen billing
  period. Returns `{:ok, %{url: url, id: id}}` on success.
  """
  def create_checkout_session(%User{} = user, billing_period)
      when billing_period in ["monthly", "yearly"] do
    config = Application.fetch_env!(:mono_phoenix_v01, :stripe)

    price_id =
      case billing_period do
        "monthly" -> config[:price_id_monthly]
        "yearly" -> config[:price_id_yearly]
      end

    stripe_client().create_checkout_session(%{
      mode: "subscription",
      customer: user.stripe_customer_id,
      client_reference_id: to_string(user.id),
      metadata: %{
        "user_id" => to_string(user.id),
        "billing_period" => billing_period
      },
      line_items: [%{price: price_id, quantity: 1}],
      allow_promotion_codes: true,
      success_url: success_url(user.id),
      cancel_url: cancel_url()
    })
  end

  # Phoenix.Token-signed value bound to the user_id and the endpoint's
  # secret_key_base, embedded as the `t=...` query param in the success
  # URL we hand to Stripe. The success handler refuses to auto-login
  # without a valid token for the matching user — closes the "anyone
  # who learns the cs_… session id can claim the account" hole.
  #
  # 5-minute max_age — long enough to cover Stripe checkout (typically
  # under a minute), short enough to limit the replay window if the
  # token leaks via Referer to web-server logs (security review #2
  # SHOULD #1).
  @signup_token_salt "signup_success"
  @signup_token_max_age 300

  defp success_url(user_id) do
    base = MonoPhoenixV01Web.Endpoint.url()
    token = sign_signup_token(user_id)
    base <> "/signup/success?session_id={CHECKOUT_SESSION_ID}&t=#{URI.encode_www_form(token)}"
  end

  defp cancel_url do
    base = MonoPhoenixV01Web.Endpoint.url()
    base <> "/signup/cancel?session_id={CHECKOUT_SESSION_ID}"
  end

  @doc """
  Sign a short-lived token binding the user_id to the success URL we
  hand to Stripe. Lives 30 minutes (more than enough for a Checkout
  flow, less than enough for a leaked URL in old logs to stay live).
  """
  def sign_signup_token(user_id) when is_integer(user_id) do
    Phoenix.Token.sign(MonoPhoenixV01Web.Endpoint, @signup_token_salt, user_id)
  end

  @doc """
  Verify the signup token from the success URL. Returns
  `{:ok, user_id}` or `{:error, reason}`.
  """
  def verify_signup_token(token) when is_binary(token) do
    Phoenix.Token.verify(
      MonoPhoenixV01Web.Endpoint,
      @signup_token_salt,
      token,
      max_age: @signup_token_max_age
    )
  end

  def verify_signup_token(_), do: {:error, :missing}

  @doc """
  Verify a Checkout Session is paid; return enriched subscription data
  ready for `Accounts.mark_subscription_active/2`.
  """
  def verify_checkout_session(session_id) when is_binary(session_id) do
    with {:ok, session} <-
           stripe_client().retrieve_checkout_session(session_id, %{
             expand: ["subscription"]
           }),
         "paid" <- session.payment_status do
      sub = session.subscription
      metadata = session.metadata || %{}

      data = %{
        stripe_subscription_id: sub.id,
        current_period_end: DateTime.from_unix!(current_period_end_unix(sub)),
        billing_period: Map.get(metadata, "billing_period"),
        user_id:
          metadata
          |> Map.get("user_id", session.client_reference_id)
          |> to_integer()
      }

      {:ok, data}
    else
      status when is_binary(status) ->
        {:error, {:not_paid, status}}

      {:error, _} = err ->
        err
    end
  end

  @doc """
  Extract `current_period_end` (as a unix timestamp integer) from a
  Stripe Subscription.

  As of API version 2025-03-31 (Basil release), Stripe moved
  `current_period_end` and `current_period_start` off the top-level
  Subscription object onto its individual `SubscriptionItem`s. For
  single-item subscriptions like ours (one price per user) the value
  lives on `subscription.items.data[0].current_period_end`.

  This helper handles both the typed `Stripe.Subscription` struct
  (from `retrieve_subscription` and similar API calls) and the raw
  string-keyed map shape that arrives in webhook payloads.
  """
  def current_period_end_unix(sub) when is_map(sub) do
    items = Map.get(sub, :items) || Map.get(sub, "items")
    data = items && (Map.get(items, :data) || Map.get(items, "data"))

    case data do
      [first | _] when is_map(first) ->
        Map.get(first, :current_period_end) || Map.get(first, "current_period_end")

      _ ->
        nil
    end
  end

  def current_period_end_unix(_), do: nil

  defp to_integer(value) when is_integer(value), do: value
  defp to_integer(value) when is_binary(value), do: String.to_integer(value)

  @doc """
  Retrieve a Stripe Subscription by ID. Used by the webhook handler
  when the event only carries the subscription ID.
  """
  def retrieve_subscription(sub_id) when is_binary(sub_id) do
    stripe_client().retrieve_subscription(sub_id)
  end

  @doc """
  Retrieve a Checkout Session by ID without expanding subscription.
  Used by the cancel-handler to find which pending user to delete.
  """
  def retrieve_checkout_session(session_id) when is_binary(session_id) do
    stripe_client().retrieve_checkout_session(session_id, %{})
  end

  @doc """
  Build a Customer Portal session URL for `user`.
  """
  def create_portal_session(%User{stripe_customer_id: cus_id})
      when is_binary(cus_id) and cus_id != "" do
    stripe_client().create_portal_session(%{
      customer: cus_id,
      return_url: MonoPhoenixV01Web.Endpoint.url() <> "/account"
    })
  end

  def create_portal_session(_), do: {:error, :no_stripe_customer}

  @doc """
  Verify a Stripe webhook signature and return the parsed event.
  """
  def construct_webhook_event(payload, sig_header)
      when is_binary(payload) and is_binary(sig_header) do
    secret =
      Application.fetch_env!(:mono_phoenix_v01, :stripe)[:webhook_secret]

    stripe_client().construct_webhook_event(payload, sig_header, secret)
  end

  def construct_webhook_event(_, _),
    do: {:error, :missing_payload_or_signature}
end
