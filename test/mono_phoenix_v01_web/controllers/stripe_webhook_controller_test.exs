defmodule MonoPhoenixV01Web.StripeWebhookControllerTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import Mox

  setup :verify_on_exit!

  defp post_webhook(conn, body, sig) do
    conn =
      conn
      |> Plug.Conn.assign(:raw_body, body)
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

    test "400 when payload is empty (missing raw_body)", %{conn: conn} do
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

      assert conn.status == 400
    end
  end
end
