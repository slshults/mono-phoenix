defmodule MonoPhoenixV01.OtelLogsHandler do
  @moduledoc """
  Custom `:logger` handler that forwards `:warning`/`:error` log events to
  PostHog Logs as OTLP/HTTP JSON.

  There is no Erlang/Elixir OTLP logs exporter — `opentelemetry_exporter`
  only supports the trace protocol — so this hand-rolls the minimal OTLP
  JSON shape PostHog's generic OTLP receiver accepts
  (https://posthog.com/docs/logs). Traces use the standard
  `opentelemetry_exporter` package instead; see `MonoPhoenixV01.Application`.

  Only attached when `:mono_phoenix_v01, :otel_enabled` is true (production,
  see `config/runtime.exs`). The `:logger` handler is configured with
  `level: :warning` so info/debug events never reach `log/2` at all.

  Log events are buffered and flushed on a timer so the `:logger` callback
  itself never blocks on network I/O.
  """

  use GenServer

  @flush_interval_ms 5_000

  @severity_number %{
    debug: 5,
    info: 9,
    notice: 10,
    warning: 13,
    error: 17,
    critical: 18,
    alert: 19,
    emergency: 21
  }

  # --- :logger handler callback ---------------------------------------------

  @doc false
  def log(log_event, _handler_config) do
    GenServer.cast(__MODULE__, {:log, log_event})
  end

  # --- GenServer -------------------------------------------------------------

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  @impl true
  def init([]) do
    schedule_flush()
    {:ok, %{buffer: []}}
  end

  @impl true
  def handle_cast({:log, log_event}, state) do
    {:noreply, %{state | buffer: [log_event | state.buffer]}}
  end

  @impl true
  def handle_info(:flush, state) do
    schedule_flush()

    case state.buffer do
      [] -> :ok
      records -> send_batch(Enum.reverse(records))
    end

    {:noreply, %{state | buffer: []}}
  end

  defp schedule_flush do
    Process.send_after(self(), :flush, @flush_interval_ms)
  end

  defp send_batch(records) do
    %{endpoint: endpoint, headers: headers} = Application.fetch_env!(:mono_phoenix_v01, :otel_logs)
    body = Jason.encode!(to_otlp_payload(records))
    request_headers = [{"content-type", "application/json"} | headers]

    case Tesla.post(endpoint, body, headers: request_headers) do
      {:ok, %{status: status}} when status in 200..299 -> :ok
      {:ok, %{status: status}} -> report_failure("HTTP #{status}")
      {:error, reason} -> report_failure(inspect(reason))
    end
  rescue
    error -> report_failure(Exception.format(:error, error, __STACKTRACE__))
  end

  # Deliberately not Logger.warning/1 here: this handler receives
  # :warning/:error level events, so routing our own transport failures
  # through Logger would feed straight back into this handler.
  defp report_failure(reason) do
    IO.puts(:stderr, "OtelLogsHandler failed to send log batch to PostHog: #{reason}")
  end

  # --- OTLP JSON conversion (pure, unit-tested) -------------------------------

  @doc false
  def to_otlp_payload(records) do
    %{
      "resourceLogs" => [
        %{
          "resource" => %{
            "attributes" => [
              %{"key" => "service.name", "value" => %{"stringValue" => "mono_phoenix_v01"}}
            ]
          },
          "scopeLogs" => [
            %{"logRecords" => Enum.map(records, &to_log_record/1)}
          ]
        }
      ]
    }
  end

  @doc false
  def to_log_record(%{level: level, meta: meta} = log_event) do
    %{
      "timeUnixNano" => Integer.to_string(meta.time * 1_000),
      "severityText" => level |> to_string() |> String.upcase(),
      "severityNumber" => Map.get(@severity_number, level, 0),
      "body" => %{"stringValue" => format_message(log_event)},
      "attributes" => build_attributes(meta)
    }
  end

  defp format_message(log_event) do
    log_event
    |> :logger_formatter.format(%{})
    |> IO.chardata_to_string()
    |> String.trim()
  end

  defp build_attributes(meta) do
    meta
    |> Map.take([:request_id, :mfa, :file, :line])
    |> Enum.map(fn {key, value} ->
      %{"key" => to_string(key), "value" => %{"stringValue" => attribute_value(value)}}
    end)
  end

  # Strings (e.g. request_id) render as-is; anything else (mfa tuples,
  # charlists) falls back to inspect/1 for a readable representation.
  defp attribute_value(value) when is_binary(value), do: value
  defp attribute_value(value), do: inspect(value)
end
