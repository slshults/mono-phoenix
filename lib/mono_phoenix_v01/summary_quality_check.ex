defmodule MonoPhoenixV01.SummaryQualityCheck do
  @moduledoc """
  Oban worker that looks for cached AI summaries/paraphrases in the
  `summaries` table that are really chatbot-style non-answers ("I'd be happy
  to...", "As an AI...") instead of content, and reports the result to
  PostHog as one `summary_quality_checked` event per run.

  Triggered daily on a cron schedule (see `config/runtime.exs`) and can also
  be invoked manually with `Oban.insert!(SummaryQualityCheck.new(%{}))`.

  The event is the check's only output, so the daily-note routine (which can
  only read PostHog) can tell a clean run (`status: "pass"`), bad rows
  (`"fail"`) and a broken query (`"error"`) apart. No event at all within a
  day means the check didn't run. Only row ids, content types and
  identifiers are sent — never the content itself.
  """

  # Don't auto-retry: a retry would send a second event for the same day.
  # The next daily cron tick runs the check again anyway.
  #
  # No uniqueness window either (unlike the MOTD worker): running the check
  # twice is harmless, and a manual re-run right after cleaning up bad rows
  # should not be blocked by that morning's cron run.
  use Oban.Worker, queue: :default, max_attempts: 1

  require Logger

  alias MonoPhoenixV01.Repo

  @event "summary_quality_checked"

  # Cap the row list sent to PostHog; bad_count still carries the full total.
  @max_reported_rows 20

  # Same patterns the old daily-note script used. Chatbot openings are only
  # matched in the first 100 characters; the always-bad patterns anywhere.
  @bad_rows_sql """
  SELECT id, content_type, identifier
  FROM summaries
  WHERE
    -- Chatbot openings (first 100 chars only)
    LEFT(content, 100) ILIKE '%I need to clarif%'
    OR LEFT(content, 100) ILIKE '%I cannot access%'
    OR LEFT(content, 100) ILIKE '%I''d be happy to%'
    OR LEFT(content, 100) ILIKE '%I''m not able%'
    OR LEFT(content, 100) ILIKE '%I''m unable%'
    OR LEFT(content, 100) ILIKE '%I must clarif%'
    OR LEFT(content, 100) ILIKE '%I notice there may be%'
    OR LEFT(content, 100) ILIKE '%I notice you%'
    OR LEFT(content, 100) ILIKE '%I believe there may be%'
    OR LEFT(content, 100) ILIKE '%I appreciate your%'
    OR LEFT(content, 100) ILIKE '%Please note that%'
    OR LEFT(content, 100) ILIKE '%I apologize%'
    OR LEFT(content, 100) ILIKE '%reference%'
    -- Always-bad patterns (never legitimate Shakespeare, check full content)
    OR content ILIKE '%as an ai%'
    OR content ILIKE '%access external URLs%'
  ORDER BY id
  """

  @impl Oban.Worker
  def perform(%Oban.Job{}) do
    properties = check()

    # PostHog.capture/2 never raises (it logs and returns {:error, _}), so a
    # PostHog outage can't fail the job or affect anything else.
    MonoPhoenixV01.PostHog.capture(@event, properties)

    case properties do
      %{status: "error", error: error} -> {:error, error}
      _ -> :ok
    end
  end

  @doc """
  Runs the check and returns the event properties, without sending anything.
  """
  @spec check() :: map()
  def check do
    case find_bad_rows() do
      {:ok, rows} ->
        properties = result_properties(rows)
        log_result(properties)
        properties

      {:error, error} ->
        properties = error_properties(error)
        Logger.error("[SummaryQualityCheck] check query failed: #{properties.error}")
        properties
    end
  end

  defp find_bad_rows do
    case Ecto.Adapters.SQL.query(Repo, @bad_rows_sql, []) do
      {:ok, %{rows: rows}} ->
        {:ok,
         Enum.map(rows, fn [id, content_type, identifier] ->
           %{id: id, content_type: content_type, identifier: identifier}
         end)}

      {:error, error} ->
        {:error, error}
    end
  rescue
    # Pool timeouts and dropped connections raise rather than return.
    error in [DBConnection.ConnectionError, Postgrex.Error] -> {:error, error}
  end

  @doc false
  def result_properties(rows) do
    %{
      status: if(rows == [], do: "pass", else: "fail"),
      bad_count: length(rows),
      bad_rows: Enum.take(rows, @max_reported_rows),
      environment: Application.get_env(:mono_phoenix_v01, :environment)
    }
  end

  @doc false
  def error_properties(error) do
    %{
      status: "error",
      bad_count: nil,
      bad_rows: [],
      error: safe_error(error),
      environment: Application.get_env(:mono_phoenix_v01, :environment)
    }
  end

  defp log_result(%{status: "pass"}),
    do: Logger.info("[SummaryQualityCheck] status=pass bad_count=0")

  defp log_result(%{bad_count: count, bad_rows: rows}) do
    ids = Enum.map_join(rows, ",", & &1.id)
    Logger.warning("[SummaryQualityCheck] status=fail bad_count=#{count} ids=#{ids}")
  end

  # A short, credential-free description of what went wrong. Postgrex and
  # DBConnection messages describe the failure (an SQLSTATE, a timeout), not
  # the connection, but anything else is reduced to its exception name so an
  # unexpected error can't carry connection details into PostHog.
  defp safe_error(%Postgrex.Error{postgres: %{code: code, message: message}}),
    do: truncate("postgres #{code}: #{message}")

  defp safe_error(%Postgrex.Error{} = error), do: truncate(Exception.message(error))
  defp safe_error(%DBConnection.ConnectionError{} = error), do: truncate(Exception.message(error))
  defp safe_error(%{__exception__: true, __struct__: module}), do: inspect(module)
  defp safe_error(_other), do: "unknown error"

  defp truncate(message), do: String.slice(message, 0, 200)
end
