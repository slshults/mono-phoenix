defmodule MonoPhoenixV01.PostHog do
  @moduledoc """
  Server-side PostHog event capture over HTTP.

  Used by `AnthropicService` for LLM analytics (`$ai_generation`) and by the
  daily monologue Scheduler for the `motd_posted` event. Sends to the same
  PostHog project that the frontend posthog-js bundle reports to.

  The Project API Key is hardcoded — this is the same public key embedded in
  the frontend snippet (no secret value).
  """

  require Logger

  # Project API Key for event ingestion. Same key as the frontend PostHog
  # snippet — public by design, distinct from the Personal API Key used for MCP.
  @project_api_key "phc_6aYLpkqQsmYJanYseJ8SJcOMicomCxj9v9Pl6hnZQS3"
  @default_distinct_id "shakespeare_monologues_server"

  @doc """
  Capture a server-side event. Returns `:ok` on success or `{:error, reason}`
  on transport / HTTP failure. Exceptions are caught and logged.

  ## Person profiles

  Server-side events are **anonymous by default**: we send
  `$process_person_profile: false` so PostHog does not create or update a
  person profile for the event's `distinct_id`. This mirrors the frontend's
  `person_profiles: 'identified_only'` policy — but note that setting is a
  posthog-js-only feature and has no effect on events sent directly to the
  `/batch` endpoint, so the flag must be set explicitly here.

  Only events that belong to a user who has actually created an account
  should pass `person_profile: true` (see the `identify/2` lifecycle calls
  and the signup/subscription conversion events). Everything else — AI
  generations, the daily-monologue post, abandoned signups — stays anonymous.

  ## Options
    * `:distinct_id` — override the per-server default
    * `:person_profile` — when `true`, allow PostHog to create/update a
      person profile for this event. Defaults to `false` (anonymous).

  ## Examples

      MonoPhoenixV01.PostHog.capture("motd_posted", %{monologue_id: 123, status: "posted"})
  """
  @spec capture(String.t(), map(), keyword()) :: :ok | {:error, term()}
  def capture(event_name, properties, opts \\ []) do
    distinct_id = Keyword.get(opts, :distinct_id, @default_distinct_id)
    person_profile = Keyword.get(opts, :person_profile, false)
    host = System.get_env("POSTHOG_HOST", "https://us.i.posthog.com")

    payload =
      build_payload(event_name, properties, distinct_id, person_profile)

    body = Jason.encode!(%{"api_key" => @project_api_key, "batch" => [payload]})

    headers = [
      {"Content-Type", "application/json"},
      {"User-Agent", "MonoPhoenixV01/1.0"}
    ]

    case Tesla.post("#{host}/batch", body, headers: headers) do
      {:ok, %{status: status}} when status in 200..299 ->
        Logger.debug("PostHog event #{event_name} sent successfully")
        :ok

      {:ok, %{status: status, body: error_body}} ->
        Logger.warning("PostHog API error #{status} for #{event_name}: #{inspect(error_body)}")
        {:error, "HTTP #{status}"}

      {:error, error} ->
        Logger.warning("Failed to send PostHog event #{event_name}: #{inspect(error)}")
        {:error, error}
    end
  rescue
    error ->
      Logger.warning("Exception sending PostHog event #{event_name}: #{inspect(error)}")
      {:error, error}
  end

  @doc """
  Set person properties for a user. Sends an `$identify` event with `$set`
  (overwrite) and optionally `$set_once` (write only if unset) maps.

  Use this server-side after lifecycle transitions (signup completed,
  subscription renewed, subscription canceled, payment failed) so the
  person profile in PostHog mirrors the user's current state.

  `$identify` is the one server-side event that intentionally creates a
  person profile, so it is sent with `person_profile: true`. Only call this
  for users who have created an account.

  ## Examples

      MonoPhoenixV01.PostHog.identify("42",
        set: %{subscription_status: "active", billing_period: "monthly"},
        set_once: %{signup_completed_at: "2026-05-25T18:00:00Z"})
  """
  @spec identify(String.t(), keyword()) :: :ok | {:error, term()}
  def identify(distinct_id, opts) when is_binary(distinct_id) do
    set = Keyword.get(opts, :set, %{})
    set_once = Keyword.get(opts, :set_once, %{})

    properties =
      %{}
      |> maybe_put("$set", set)
      |> maybe_put("$set_once", set_once)

    capture("$identify", properties, distinct_id: distinct_id, person_profile: true)
  end

  defp maybe_put(map, _key, value) when value == %{}, do: map
  defp maybe_put(map, key, value), do: Map.put(map, key, value)

  # Build the per-event payload for the /batch request. Anonymous events
  # (the default) carry `$process_person_profile: false` so PostHog does not
  # mint a person profile for the distinct_id; account-holder events pass
  # `person_profile: true` and are left untouched.
  @doc false
  def build_payload(event_name, properties, distinct_id, person_profile) do
    %{
      "api_key" => @project_api_key,
      "event" => event_name,
      "properties" => anonymize(properties, person_profile),
      "distinct_id" => distinct_id,
      "timestamp" => DateTime.utc_now() |> DateTime.to_iso8601()
    }
  end

  # Only an explicit `true` opts into person processing; anything else
  # (the `false` default, or an unexpected value) stays anonymous.
  defp anonymize(properties, true), do: properties
  defp anonymize(properties, _), do: Map.put(properties, "$process_person_profile", false)
end
