defmodule MonoPhoenixV01Web.NotFoundTrackerTest do
  use ExUnit.Case, async: true

  import Plug.Test
  import Plug.Conn

  alias MonoPhoenixV01Web.NotFoundTracker

  describe "properties/1" do
    test "captures the request path, referrer, and status without a query string" do
      conn =
        conn(:get, "/monologues/999999?foo=bar")
        |> Map.put(:status, 404)
        |> put_req_header("referer", "https://example.com/search?q=secret")

      assert NotFoundTracker.properties(conn) == %{
               :path => "/monologues/999999",
               :referrer => "https://example.com/search?q=secret",
               :status => 404,
               "$ip" => "127.0.0.1"
             }
    end

    test "carries the visitor's IP and user agent so PostHog can geolocate and bot-filter" do
      ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15"

      conn =
        conn(:get, "/apple-touch-icon.png")
        |> Map.put(:status, 404)
        |> Map.put(:remote_ip, {203, 0, 113, 7})
        |> put_req_header("user-agent", ua)

      properties = NotFoundTracker.properties(conn)

      assert properties["$ip"] == "203.0.113.7"
      assert properties["$raw_user_agent"] == ua
    end

    test "formats an IPv6 visitor address" do
      conn =
        conn(:get, "/nope")
        |> Map.put(:status, 404)
        |> Map.put(:remote_ip, {0x2001, 0xDB8, 0, 0, 0, 0, 0, 1})

      assert NotFoundTracker.properties(conn)["$ip"] == "2001:db8::1"
    end

    test "leaves $raw_user_agent out when the header is absent" do
      conn = conn(:get, "/nope") |> Map.put(:status, 404)

      refute Map.has_key?(NotFoundTracker.properties(conn), "$raw_user_agent")
    end

    test "referrer is nil when the header is absent" do
      conn = conn(:get, "/nope") |> Map.put(:status, 404)

      assert NotFoundTracker.properties(conn).referrer == nil
    end
  end

  describe "distinct_id/1" do
    @cookie_name "ph_#{MonoPhoenixV01.PostHog.project_api_key()}_posthog"

    test "reads the real distinct_id out of the posthog-js cookie" do
      cookie_value = URI.encode(Jason.encode!(%{"distinct_id" => "0198abc-real-visitor"}))

      conn =
        conn(:get, "/nope")
        |> put_req_header("cookie", "#{@cookie_name}=#{cookie_value}")

      assert NotFoundTracker.distinct_id(conn) == "0198abc-real-visitor"
    end

    test "falls back to cold404 when there is no posthog cookie" do
      conn = conn(:get, "/nope")

      assert NotFoundTracker.distinct_id(conn) == "cold404"
    end

    test "falls back to cold404 when the cookie value isn't valid JSON" do
      conn =
        conn(:get, "/nope")
        |> put_req_header("cookie", "#{@cookie_name}=not-json-at-all")

      assert NotFoundTracker.distinct_id(conn) == "cold404"
    end

    test "falls back to cold404 when the cookie has no distinct_id key" do
      cookie_value = URI.encode(Jason.encode!(%{"other_field" => "x"}))

      conn =
        conn(:get, "/nope")
        |> put_req_header("cookie", "#{@cookie_name}=#{cookie_value}")

      assert NotFoundTracker.distinct_id(conn) == "cold404"
    end
  end

  describe "handle_event/4" do
    test "ignores non-404 endpoint stop events" do
      conn = conn(:get, "/plays") |> Map.put(:status, 200)

      assert NotFoundTracker.handle_event([:phoenix, :endpoint, :stop], %{}, %{conn: conn}, nil) == :ok
    end

    test "ignores unrelated telemetry events" do
      assert NotFoundTracker.handle_event([:some, :other, :event], %{}, %{}, nil) == :ok
    end
  end
end
