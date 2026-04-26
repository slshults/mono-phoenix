defmodule MonoPhoenixV01.DailyMonologue.Scheduler do
  @moduledoc """
  Oban worker that posts the monologue of the day to BlueSky and Facebook.

  Triggered on a cron schedule (see `config/runtime.exs`) and can also be
  invoked manually with `Oban.insert!(DailyMonologue.Scheduler.new(%{}))`.
  """

  # Don't auto-retry: a failed run logs once and writes a 'failed' row to
  # posted_monologues for later inspection. Retries here would just thrash
  # because each new attempt re-runs the Selector and picks a different
  # monologue, polluting the audit trail. The next daily cron tick will try
  # again with a fresh pick.
  #
  # Uniqueness: prevent double-posting if cron and a manual `Oban.insert!`
  # collide, or if a clock anomaly fires the cron twice in one day. Within a
  # 24h window, only one MOTD job (worker + same args) can be in any of the
  # listed states at once.
  use Oban.Worker,
    queue: :social,
    max_attempts: 1,
    unique: [
      period: 86_400,
      states: [:available, :scheduled, :executing, :retryable, :completed]
    ]

  require Logger

  alias MonoPhoenixV01.DailyMonologue.{Formatter, Selector}
  alias MonoPhoenixV01.Repo
  alias MonoPhoenixV01.Social.{BlueSky, Facebook}

  @impl Oban.Worker
  def perform(%Oban.Job{}) do
    case Selector.pick() do
      {:ok, mono} ->
        post = Formatter.format(mono)

        bsky = BlueSky.post(post)
        fb = Facebook.post(post)

        record_result(mono, bsky, fb)

      {:error, :no_monologues_available} ->
        Logger.error("[DailyMonologue] No monologues available to post.")
        {:error, :no_monologues_available}
    end
  end

  defp record_result(mono, bsky_result, fb_result) do
    {status, bluesky_uri, fb_post_id, error_text} =
      case {bsky_result, fb_result} do
        {{:ok, %{uri: uri}}, {:ok, %{id: id}}} ->
          {"posted", uri, id, nil}

        {{:ok, %{uri: uri}}, {:error, fb_err}} ->
          {"partial", uri, nil, safe_error(fb_err)}

        {{:error, bsky_err}, {:ok, %{id: id}}} ->
          {"partial", nil, id, safe_error(bsky_err)}

        {{:error, bsky_err}, {:error, fb_err}} ->
          {"failed", nil, nil, safe_error(%{bluesky: bsky_err, facebook: fb_err})}
      end

    now = DateTime.utc_now() |> DateTime.truncate(:second)

    Ecto.Adapters.SQL.query!(
      Repo,
      """
      INSERT INTO posted_monologues
        (monologue_id, posted_at, status, bluesky_uri, facebook_post_id, error,
         inserted_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
      """,
      [mono.id, now, status, bluesky_uri, fb_post_id, error_text, now]
    )

    Logger.info(
      "[DailyMonologue] monologue_id=#{mono.id} status=#{status} bsky=#{safe_error(bsky_result)} fb=#{safe_error(fb_result)}"
    )

    MonoPhoenixV01.PostHog.capture("motd_posted", %{
      monologue_id: mono.id,
      play_title: mono.play_title,
      character: mono.character,
      status: status,
      bluesky_uri: bluesky_uri,
      facebook_post_id: fb_post_id,
      error: error_text,
      used_short_url: not is_nil(mono.short_url)
    })

    if status == "failed" do
      {:error, error_text}
    else
      :ok
    end
  end

  # Inspect a value with credentials redacted. Tesla.Env structs may contain
  # the full request body — including the Facebook access_token, which is
  # passed in the body — so we strip that before logging or persisting.
  defp safe_error(term) do
    inspect(redact(term), limit: 10, printable_limit: 200)
  end

  defp redact(%Tesla.Env{} = env), do: %{env | body: "[REDACTED]", opts: []}
  defp redact(t) when is_tuple(t), do: t |> Tuple.to_list() |> Enum.map(&redact/1) |> List.to_tuple()
  defp redact(l) when is_list(l), do: Enum.map(l, &redact/1)
  defp redact(m) when is_map(m), do: Map.new(m, fn {k, v} -> {k, redact(v)} end)
  defp redact(other), do: other
end
