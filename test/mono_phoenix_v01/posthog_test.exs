defmodule MonoPhoenixV01.PostHogTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01.PostHog

  describe "build_payload/4 person-profile handling" do
    test "anonymous events (default) carry $process_person_profile: false" do
      payload = PostHog.build_payload("used_search", %{term: "hamlet"}, "anon-123", false)

      assert payload["event"] == "used_search"
      assert payload["distinct_id"] == "anon-123"
      assert payload["properties"]["$process_person_profile"] == false
      assert payload["properties"][:term] == "hamlet"
    end

    test "account-holder events do not suppress the person profile" do
      payload =
        PostHog.build_payload("signup_completed", %{user_id: 7}, "patron@example.com", true)

      refute Map.has_key?(payload["properties"], "$process_person_profile")
      assert payload["properties"][:user_id] == 7
      assert payload["distinct_id"] == "patron@example.com"
    end

    test "a non-true person_profile value stays anonymous rather than crashing" do
      payload = PostHog.build_payload("used_search", %{}, "anon-123", nil)

      assert payload["properties"]["$process_person_profile"] == false
    end

    test "the anonymous flag never clobbers existing event properties" do
      props = %{"a" => 1, "b" => 2}
      payload = PostHog.build_payload("motd_posted", props, "shakespeare_monologues_server", false)

      assert payload["properties"]["a"] == 1
      assert payload["properties"]["b"] == 2
      assert payload["properties"]["$process_person_profile"] == false
    end
  end
end
