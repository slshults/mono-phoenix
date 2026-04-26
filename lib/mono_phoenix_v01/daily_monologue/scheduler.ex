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
  use Oban.Worker, queue: :social, max_attempts: 1

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
          {"partial", uri, nil, inspect(fb_err)}

        {{:error, bsky_err}, {:ok, %{id: id}}} ->
          {"partial", nil, id, inspect(bsky_err)}

        {{:error, bsky_err}, {:error, fb_err}} ->
          {"failed", nil, nil, inspect(%{bluesky: bsky_err, facebook: fb_err})}
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
      "[DailyMonologue] monologue_id=#{mono.id} status=#{status} bsky=#{inspect(bsky_result)} fb=#{inspect(fb_result)}"
    )

    # TODO: emit PostHog event "motd_posted" with {monologue_id, status,
    # bluesky_uri, facebook_post_id, error} — reuse anthropic_service.ex's
    # send_to_posthog once it's extracted to a shared helper.

    if status == "failed" do
      {:error, error_text}
    else
      :ok
    end
  end
end
