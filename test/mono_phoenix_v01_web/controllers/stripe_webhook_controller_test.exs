defmodule MonoPhoenixV01Web.StripeWebhookControllerTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Mox

  setup :verify_on_exit!

  defp post_webhook(conn, body, sig) do
    conn =
      conn
      |> Plug.Conn.put_req_header("stripe-signature", sig)
      |> Plug.Conn.put_req_header("content-type", "application/json")

    Phoenix.ConnTest.dispatch(conn, MonoPhoenixV01Web.Endpoint, :post, "/api/stripe/webhook", body)
  end

  describe "POST /api/stripe/webhook" do
    test "200 on a verified event", %{conn: conn} do
      MonoPhoenixV01.BillingMock
      |> expect(:construct_webhook_event, fn _, _, _ ->
        {:ok, %Stripe.Event{type: "ping", data: %{}}}
      end)

      conn = post_webhook(conn, "{}", "t=1,v1=abc")
      assert conn.status == 200
    end

    test "400 on an invalid signature", %{conn: conn} do
      MonoPhoenixV01.BillingMock
      |> expect(:construct_webhook_event, fn _, _, _ ->
        {:error, "signature mismatch"}
      end)

      conn = post_webhook(conn, "{}", "t=1,v1=BAD")
      assert conn.status == 400
    end

    test "503 when payload is empty (StripeBodyReader didn't capture)", %{conn: conn} do
      # Missing raw_body assigns indicates our plug didn't run or
      # didn't capture the body. That's a server-side bug, not a
      # client problem — return 503 so Stripe retries instead of
      # giving up like it would for a 400.
      conn =
        conn
        |> Plug.Conn.put_req_header("stripe-signature", "t=1,v1=anything")
        |> Plug.Conn.put_req_header("content-type", "application/json")

      conn =
        Phoenix.ConnTest.dispatch(
          conn,
          MonoPhoenixV01Web.Endpoint,
          :post,
          "/api/stripe/webhook",
          ""
        )

      assert conn.status == 503
    end
  end
end
