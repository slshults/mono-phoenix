defmodule MonoPhoenixV01Web.StripeWebhookController do
  @moduledoc """
  Receives Stripe webhooks at POST /api/stripe/webhook.

  The raw body is stashed in `conn.assigns.raw_body` by
  `MonoPhoenixV01Web.Plugs.StripeBodyReader` before Plug.Parsers decodes
  the JSON. Signature verification uses the raw bytes (required by
  Stripe).

  We always respond 200 for successfully verified events (even if the
  handler is a no-op for an unrecognized type). For invalid signatures
  we respond 400 — Stripe will retry with backoff, but a 400 indicates
  permanent failure (misconfigured secret), so retries won't fix it.
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

    if payload == "" or is_nil(sig_header) do
      Logger.warning(
        "Stripe webhook missing payload or signature header " <>
          "(payload_empty=#{payload == ""}, sig_nil=#{is_nil(sig_header)})"
      )

      send_resp(conn, 400, "")
    else
      case Billing.construct_webhook_event(payload, sig_header) do
        {:ok, event} ->
          :ok = WebhookHandler.handle(event)
          send_resp(conn, 200, "")

        {:error, reason} ->
          Logger.warning(
            "Stripe webhook signature verification failed: #{inspect(reason)}"
          )

          send_resp(conn, 400, "")
      end
    end
  end
end
