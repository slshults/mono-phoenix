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
               path: "/monologues/999999",
               referrer: "https://example.com/search?q=secret",
               status: 404
             }
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
