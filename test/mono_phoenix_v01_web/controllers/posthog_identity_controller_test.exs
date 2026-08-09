defmodule MonoPhoenixV01Web.PostHogIdentityControllerTest do
  @moduledoc """
  This endpoint signs a patron's PostHog distinct_id for the Conversations
  widget. It used to sit on an unauthenticated route and sign whatever
  `distinct_id` the caller sent, which — because patrons are identified to
  PostHog by email — let anyone who knew a patron's email mint a valid identity
  hash for them and open the widget as that person.

  The test that matters is "ignores a client-supplied distinct_id and signs the
  session's own email": it asks for someone else's email while logged in as
  somebody, and asserts you get your own hash back.
  """
  # async: false — POSTHOG_SECRET_API_KEY is process-global env, not per-test config.
  use MonoPhoenixV01Web.ConnCase, async: false

  import MonoPhoenixV01.AccountsFixtures

  @secret "test-posthog-secret-key"

  setup do
    previous = System.get_env("POSTHOG_SECRET_API_KEY")
    System.put_env("POSTHOG_SECRET_API_KEY", @secret)

    on_exit(fn ->
      case previous do
        nil -> System.delete_env("POSTHOG_SECRET_API_KEY")
        value -> System.put_env("POSTHOG_SECRET_API_KEY", value)
      end
    end)

    :ok
  end

  defp expected_hash(value) do
    :crypto.mac(:hmac, :sha256, @secret, value) |> Base.encode16(case: :lower)
  end

  describe "POST /api/posthog/identity" do
    test "refuses an unauthenticated caller, even one naming a victim", %{conn: conn} do
      victim = user_fixture()

      conn = post(conn, ~p"/api/posthog/identity", %{"distinct_id" => victim.email})

      body = json_response(conn, 401)
      assert %{"error" => "unauthenticated"} = body
      refute Map.has_key?(body, "hash")
    end

    test "ignores a client-supplied distinct_id and signs the session's own email", %{conn: conn} do
      caller = user_fixture()
      victim = user_fixture()

      conn =
        conn
        |> log_in_user(caller)
        |> post(~p"/api/posthog/identity", %{"distinct_id" => victim.email})

      body = json_response(conn, 200)

      # The caller asked for the victim's identity and got their own.
      assert body["distinct_id"] == caller.email
      assert body["hash"] == expected_hash(caller.email)
      refute body["hash"] == expected_hash(victim.email)
    end

    test "signs the current patron's email", %{conn: conn} do
      user = user_fixture()

      conn = conn |> log_in_user(user) |> post(~p"/api/posthog/identity", %{})

      assert %{"distinct_id" => distinct_id, "hash" => hash} = json_response(conn, 200)
      assert distinct_id == user.email
      assert hash == expected_hash(user.email)
    end

    test "reports unavailable rather than signing with a blank secret", %{conn: conn} do
      System.delete_env("POSTHOG_SECRET_API_KEY")
      user = user_fixture()

      conn = conn |> log_in_user(user) |> post(~p"/api/posthog/identity", %{})

      assert %{"error" => "not_configured"} = json_response(conn, 503)
    end
  end
end
