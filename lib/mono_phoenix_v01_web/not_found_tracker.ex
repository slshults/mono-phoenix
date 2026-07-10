defmodule MonoPhoenixV01Web.NotFoundTracker do
  @moduledoc """
  Captures a `page_not_found` PostHog event for every request that ends in
  a 404 response.

  Hooks into the `[:phoenix, :endpoint, :stop]` telemetry event already
  emitted by the `Plug.Telemetry` plug in the endpoint, so it covers both
  router-level `Phoenix.Router.NoRouteError` 404s and in-app 404 renders
  (e.g. `MonologuesPageController` on an invalid `:monoid`).

  The event's `distinct_id` is read from the visitor's existing posthog-js
  cookie when present, so it lines up with the same person/anonymous ID
  posthog-js already assigned them. Visitors with no PostHog cookie yet
  (no prior page load with consent granted) have no assigned ID to read;
  minting and persisting a fresh one here would bypass the CMP consent
  gate in `root.html.heex`, so those events are bucketed under the literal
  `"cold404"` distinct_id instead. Watch `cold404` with its own trends
  alert so a spike (broken deploy, misbehaving crawler) surfaces before
  it becomes an ingestion problem.
  """

  @cold_distinct_id "cold404"

  def attach do
    :telemetry.attach(
      "mono-phoenix-not-found-tracker",
      [:phoenix, :endpoint, :stop],
      &__MODULE__.handle_event/4,
      nil
    )
  end

  def handle_event([:phoenix, :endpoint, :stop], _measurements, %{conn: %{status: 404} = conn}, _config) do
    properties = properties(conn)
    distinct_id = distinct_id(conn)

    Task.start(fn ->
      MonoPhoenixV01.PostHog.capture("page_not_found", properties, distinct_id: distinct_id)
    end)

    :ok
  end

  def handle_event(_event, _measurements, _metadata, _config), do: :ok

  @doc false
  def properties(conn) do
    %{
      path: conn.request_path,
      referrer: conn |> Plug.Conn.get_req_header("referer") |> List.first(),
      status: conn.status
    }
  end

  @doc false
  def distinct_id(conn) do
    conn = Plug.Conn.fetch_cookies(conn)

    conn.cookies
    |> Map.get(posthog_cookie_name())
    |> decode_distinct_id()
  end

  defp posthog_cookie_name, do: "ph_#{MonoPhoenixV01.PostHog.project_api_key()}_posthog"

  defp decode_distinct_id(nil), do: @cold_distinct_id

  defp decode_distinct_id(raw) when is_binary(raw) do
    with {:ok, decoded} <- safe_uri_decode(raw),
         {:ok, %{"distinct_id" => id}} when is_binary(id) and id != "" <- Jason.decode(decoded) do
      id
    else
      _ -> @cold_distinct_id
    end
  end

  defp safe_uri_decode(raw) do
    {:ok, URI.decode(raw)}
  rescue
    ArgumentError -> :error
  end
end
