# PostHog Logs & Distributed Tracing — Design

Date: 2026-07-10

## Goal

Ship application logs and distributed traces from the ShakesMonos Phoenix app
to PostHog (project 55178), using PostHog's generic OTLP receiver
(https://posthog.com/docs/logs, https://posthog.com/docs/distributed-tracing).
Both products are alpha/new — no PostHog-specific SDK exists; PostHog just
accepts standard OpenTelemetry Protocol (OTLP) traffic.

## Scope decisions (confirmed with Steven)

- **Tracing**: full stack — HTTP (Cowboy) + Phoenix router/controllers +
  LiveView (mount/handle_params/handle_event) + both Ecto repos (`Repo` and
  `Accounts.Repo`).
- **Logs**: `:warning` and `:error` level only. Not full `:info`-and-up
  capture, and not a bare "manual events only" approach.
- **Environments**: production only. Nothing sent from dev/test.

## Why logs need custom code but traces don't

The Erlang/Elixir OpenTelemetry ecosystem (`opentelemetry`,
`opentelemetry_exporter`, `opentelemetry_phoenix`, `opentelemetry_ecto`,
`opentelemetry_cowboy`) has first-class, actively maintained support for
**traces** via OTLP/HTTP protobuf. There is no equivalent Logs Bridge/exporter
for Erlang — `opentelemetry_exporter`'s docs confirm it "currently only
supports the Tracer protocol." `opentelemetry_experimental` covers metrics,
not logs. So:

- **Traces**: use the standard hex packages, configured to export to
  PostHog's OTLP traces endpoint. No hand-rolled code beyond config +
  `setup()` calls.
- **Logs**: no existing package can do this for Erlang/Elixir. We write a
  small custom `:logger` handler that converts qualifying log events to
  OTLP/HTTP **JSON** (not protobuf — PostHog's Node.js logs guide uses the
  JSON OTLP exporter package, confirming the logs endpoint accepts JSON) and
  POSTs them via Tesla, the same HTTP client `MonoPhoenixV01.PostHog` already
  uses to talk to PostHog.

## Endpoints & auth

Both confirmed from PostHog's Node.js installation guides (the only
language-specific guides with concrete details — no Elixir guide exists):

- Traces: `https://us.i.posthog.com/i/v1/traces`, protobuf, header
  `Authorization: Bearer <project token>`.
- Logs: `https://us.i.posthog.com/i/v1/logs`, JSON, same header format.
- Auth uses the **project token** (`phc_...`), never the personal API key
  (`phx_...`). This is the same public token already hardcoded in
  `lib/mono_phoenix_v01/posthog.ex` as `@project_api_key` — not a secret, so
  no new env var is needed to hold it.

## Kill switch

One config flag, `otel_enabled`:
- `config.exs` — defaults to `false` (dev/test never send anything;
  `:opentelemetry` app env sets `traces_exporter: :none` by default so no
  exporter even attempts a connection).
- `runtime.exs` (`:prod` block) — reads `POSTHOG_OTEL_ENABLED` (default
  `"true"`) and sets `otel_enabled` accordingly. Lets Steven disable both
  pipelines via `gigalixir config:set POSTHOG_OTEL_ENABLED=false` without a
  redeploy, matching the operational pattern already used for other
  feature toggles in this app (e.g. optional Bluesky/Facebook credentials).

## Components

- **`mix.exs`** — new deps: `opentelemetry`, `opentelemetry_api`,
  `opentelemetry_exporter`, `opentelemetry_phoenix`, `opentelemetry_cowboy`,
  `opentelemetry_ecto`. No new dep for logs (reuses `Tesla` + `Jason`,
  already present).
- **`config.exs`** — `config :mono_phoenix_v01, :otel_enabled, false`;
  `config :opentelemetry, traces_exporter: :none`.
- **`runtime.exs`** (`:prod` block) — flips `otel_enabled` from
  `POSTHOG_OTEL_ENABLED`; when enabled, configures `:opentelemetry`
  (`traces_exporter: :otlp`, `span_processor: :batch`) and
  `:opentelemetry_exporter` (`otlp_protocol: :http_protobuf`,
  `otlp_traces_endpoint: "https://us.i.posthog.com/i/v1/traces"`,
  `otlp_traces_headers: [{"authorization", "Bearer phc_..."}]`).
- **`lib/mono_phoenix_v01/application.ex`** — when `otel_enabled` is true,
  before the supervisor's children start:
  `:opentelemetry_cowboy.setup()`,
  `OpentelemetryPhoenix.setup(adapter: :cowboy2)`,
  `OpentelemetryEcto.setup([:mono_phoenix_v01, :repo])`, and the equivalent
  call for the accounts repo's telemetry prefix. The logs-handler GenServer
  (below) is added as a supervised child only when `otel_enabled` is true,
  and the `:logger` handler is attached at the same point.
- **New module `lib/mono_phoenix_v01/otel_logs_handler.ex`** — an Erlang
  `:logger` handler (added via `:logger.add_handler/3` with
  `level: :warning` in its config, so info/debug never reach it) that hands
  each qualifying log event to a small batching `GenServer`. The GenServer
  buffers records and flushes them on a timer (a few seconds) as one OTLP
  JSON payload POSTed to `/i/v1/logs`. The record→OTLP-JSON conversion is a
  pure function, independently unit-testable.

## Data flow

- **Traces**: request hits Cowboy → Phoenix router/controller/LiveView →
  Ecto query, each layer's `:telemetry` events picked up by the
  corresponding `opentelemetry_*` instrumentation library → spans collected
  into one trace → batch span processor exports via protobuf to
  `/i/v1/traces`.
- **Logs**: a `:warning` or `:error` `Logger` call → dispatched by `:logger`
  to `OtelLogsHandler` (filtered by level, so nothing lower reaches it) →
  buffered in the GenServer → timer-triggered flush → one batched OTLP JSON
  POST to `/i/v1/logs`.

The two pipelines share only the `otel_enabled` flag and the PostHog host —
no other coupling.

## Error handling

Both paths are fire-and-forget: a failed POST (network blip, PostHog
downtime) is caught, logged via `Logger.warning` (careful: this must not
itself re-enter the logs handler and loop — the handler's own internal
logging should bypass itself, e.g. by using `:logger.info` with a metadata
flag the handler explicitly ignores, or by simply not logging failures
through the standard `Logger` at all and instead using `IO.puts`/`:stderr`),
and the batch is dropped. Never crashes the app or blocks a request.

## Testing plan

- Unit test for `OtelLogsHandler`'s pure record→OTLP-JSON conversion
  function (given a `:logger` event map, assert the JSON shape: timestamp,
  severity, body, attributes).
- Manual smoke test: temporarily set `POSTHOG_OTEL_ENABLED=true` plus the
  real project token in a local shell, run `iex -S mix phx.server`, trigger
  one HTTP request and one `Logger.warning/1` call, then check the PostHog
  Logs and Tracing UI for project 55178 to confirm both arrive.
- `mix credo` and full `mix test` suite must stay green (206 existing tests
  + new handler test).
- Kill the local server process at the end of the session per project
  convention.

## Out of scope

- No sampling/rate-limiting beyond the warning/error level filter (log
  volume at that level is expected to be low; revisit if it isn't).
- No dev/test-environment instrumentation.
- No changes to the existing `MonoPhoenixV01.PostHog` analytics-event module
  (`$ai_generation`, `motd_posted`, etc.) — that pipeline is unrelated to
  OTLP logs/traces and stays as-is.
