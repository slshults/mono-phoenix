defmodule MonoPhoenixV01Web.SummaryAnalytics do
  @moduledoc """
  PostHog events for the AI summary modal, shared by all twelve modal hosts:
  `play_summary_generated`, `scene_summary_generated`, `paraphrasing_generated`
  when a generation starts, and the matching `*_displayed` once it's shown.

  Paraphrase properties come from the monologue's row, looked up by id, so they
  don't depend on what a host's template passed or what a Retry re-sent, and
  `first_line` is the clean column rather than a slice of the HTML body.
  """

  import Phoenix.LiveView, only: [push_event: 3]

  alias MonoPhoenixV01.{AnthropicService, MonologueExtras}

  def push_generated(socket, content_type, params) do
    push(socket, "#{content_type}_generated", properties(content_type, params))
  end

  # record_id is sent as a string because PostHog types the property as String;
  # a number there reads back as null.
  def push_displayed(socket, content_type, params, record_id, source) do
    properties = Map.merge(properties(content_type, params), %{record_id: to_string(record_id), source: source})
    push(socket, "#{content_type}_displayed", properties)
  end

  defp push(socket, event, properties) do
    properties = Map.put(properties, :timestamp, DateTime.utc_now() |> DateTime.to_iso8601())
    push_event(socket, "posthog_capture", %{event: event, properties: properties})
  end

  defp properties("play_summary", params), do: %{play_title: params.play_title}

  defp properties("scene_summary", params),
    do: %{play_title: params.play_title, location: params.location}

  # monologue_id stays a string (PostHog types it String), canonical when it
  # parses, so "01" and "1" are one value.
  defp properties("paraphrasing", params) do
    case AnthropicService.parse_monologue_id(params.monologue_id) do
      {:ok, id} -> Map.put(MonologueExtras.details(id) || %{}, :monologue_id, Integer.to_string(id))
      :error -> %{monologue_id: to_string(params.monologue_id)}
    end
  end
end
