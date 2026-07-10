defmodule MonoPhoenixV01.OtelLogsHandlerTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01.OtelLogsHandler

  describe "to_log_record/1" do
    test "converts a :logger log event to an OTLP log record" do
      log_event = %{
        level: :warning,
        msg: {:string, "queue backed up"},
        meta: %{time: 1_752_000_000_000_000, request_id: "req-123"}
      }

      record = OtelLogsHandler.to_log_record(log_event)

      assert record["severityText"] == "WARNING"
      assert record["severityNumber"] == 13
      assert record["timeUnixNano"] == "1752000000000000000"
      assert record["body"]["stringValue"] =~ "queue backed up"
    end

    test "includes request_id and call-site metadata as attributes" do
      log_event = %{
        level: :error,
        msg: {:string, "boom"},
        meta: %{
          time: 1_752_000_000_000_000,
          request_id: "req-abc",
          file: ~c"lib/foo.ex",
          line: 42,
          pid: self()
        }
      }

      record = OtelLogsHandler.to_log_record(log_event)
      attribute_keys = Enum.map(record["attributes"], & &1["key"])

      assert "request_id" in attribute_keys
      assert "line" in attribute_keys
      refute "pid" in attribute_keys
    end

    test "falls back to severityNumber 0 for an unrecognized level" do
      log_event = %{level: :weird, msg: {:string, "?"}, meta: %{time: 0}}

      assert OtelLogsHandler.to_log_record(log_event)["severityNumber"] == 0
    end
  end

  describe "to_otlp_payload/1" do
    test "wraps log records in the resourceLogs/scopeLogs envelope" do
      log_event = %{level: :error, msg: {:string, "oops"}, meta: %{time: 0}}

      payload = OtelLogsHandler.to_otlp_payload([log_event])

      assert [%{"resource" => resource, "scopeLogs" => [%{"logRecords" => [record]}]}] =
               payload["resourceLogs"]

      assert %{"key" => "service.name", "value" => %{"stringValue" => "mono_phoenix_v01"}} in resource[
               "attributes"
             ]

      assert record["body"]["stringValue"] =~ "oops"
    end
  end
end
