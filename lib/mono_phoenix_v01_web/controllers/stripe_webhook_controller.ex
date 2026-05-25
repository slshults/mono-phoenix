defmodule MonoPhoenixV01Web.StripeWebhookController do
  @moduledoc """
  Receives Stripe webhooks at POST /api/stripe/webhook.

  The raw body is stashed in `conn.assigns.raw_body` by
  `MonoPhoenixV01Web.Plugs.StripeBodyReader` before Plug.Parsers decodes
  the JSON. Signature verification uses the raw bytes (required by
  Stripe).

  We always respond 200 for successfully verified events (even if the
  handler is a no-op for an unrecognized type). Failure modes:

    - Missing raw body → 503 (our `StripeBodyReader` plug didn't run
      or didn't capture; this is a server-side problem, so Stripe
      should retry).
    - Missing signature header → 400 (probably not a Stripe-originated
      request; no point retrying).
    - Invalid signature → 400 (misconfigured webhook secret; retries
      won't fix it, Stripe will give up after backoff).
  """

  use MonoPhoenixV01Web, :controller

  require Logger

  alias MonoPhoenixV01.Billing
  alias MonoPhoenixV01.Billing.WebhookHandler

  def create(conn, _params) do
    payload = conn.assigns[:raw_body] || ""

    sig_header =
      conn
      |> get_req_header("stripe-signature")
      |> List.first()

    cond do
      payload == "" ->
        # Raw body missing — our StripeBodyReader plug didn't run or
        # didn't stash the body. Server-side problem; return 503 so
        # Stripe retries.
        Logger.error("Stripe webhook missing raw body (StripeBodyReader didn't run?)")
        send_resp(conn, 503, "")

      is_nil(sig_header) ->
        # No Stripe signature header — likely not a real Stripe call.
        # 400 (no retry).
        Logger.warning("Stripe webhook missing signature header")
        send_resp(conn, 400, "")

      true ->
        webhook_event(conn, payload, sig_header)
    end
  end

  defp webhook_event(conn, payload, sig_header) do
    case Billing.construct_webhook_event(payload, sig_header) do
      {:ok, event} ->
        :ok = WebhookHandler.handle(event)
        send_resp(conn, 200, "")

      {:error, reason} ->
        Logger.warning("Stripe webhook signature verification failed: #{inspect(reason)}")
        send_resp(conn, 400, "")
    end
  end
end
