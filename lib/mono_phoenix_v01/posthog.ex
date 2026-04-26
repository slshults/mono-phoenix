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

  ## Options
    * `:distinct_id` — override the per-server default

  ## Examples

      MonoPhoenixV01.PostHog.capture("motd_posted", %{monologue_id: 123, status: "posted"})
  """
  @spec capture(String.t(), map(), keyword()) :: :ok | {:error, term()}
  def capture(event_name, properties, opts \\ []) do
    distinct_id = Keyword.get(opts, :distinct_id, @default_distinct_id)
    host = System.get_env("POSTHOG_HOST", "https://us.i.posthog.com")

    payload = %{
      "api_key" => @project_api_key,
      "event" => event_name,
      "properties" => properties,
      "distinct_id" => distinct_id,
      "timestamp" => DateTime.utc_now() |> DateTime.to_iso8601()
    }

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
end
