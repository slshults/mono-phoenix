defmodule MonoPhoenixV01Web.Plugs.StripeBodyReader do
  @moduledoc """
  Custom body reader for Plug.Parsers that captures the raw request
  body when the request is for the Stripe webhook endpoint. Stripe's
  signature verification requires the exact original bytes — once
  Plug.Parsers reads the body for JSON decoding, the raw bytes are
  gone. By stashing them in `conn.assigns.raw_body` for the webhook
  path only, the controller can pass them to
  `Stripe.Webhook.construct_event/3`.

  For all other paths, behavior is identical to the default
  `Plug.Conn.read_body/2`.
  """

  @webhook_path "/api/stripe/webhook"

  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)

    conn =
      if conn.request_path == @webhook_path do
        Plug.Conn.assign(conn, :raw_body, body)
      else
        conn
      end

    {:ok, body, conn}
  end
end
