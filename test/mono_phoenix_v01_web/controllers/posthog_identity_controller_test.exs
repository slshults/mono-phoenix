defmodule MonoPhoenixV01Web.PostHogIdentityControllerTest do
  @moduledoc """
  This endpoint signs a patron's PostHog distinct_id for the Conversations
  widget. It used to sit on an unauthenticated route and sign whatever
  `distinct_id` the caller sent, which — because patrons are identified to
  PostHog by email — let anyone who knew a patron's email mint a valid identity
  hash for them and open the widget as that person.

  The third test below is the one that matters: it asks for someone else's
  email and asserts you get your own hash back.
  """
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
    test "refuses an unauthenticated caller", %{conn: conn} do
      conn = post(conn, ~p"/api/posthog/identity", %{})

      assert %{"error" => "unauthenticated"} = json_response(conn, 401)
    end

    test "refuses an unauthenticated caller even when it supplies a distinct_id", %{conn: conn} do
      victim = user_fixture()

      conn = post(conn, ~p"/api/posthog/identity", %{"distinct_id" => victim.email})

      assert %{"error" => "unauthenticated"} = json_response(conn, 401)
      refute Map.has_key?(json_response(conn, 401), "hash")
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

      refute body["distinct_id"] == victim.email
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
