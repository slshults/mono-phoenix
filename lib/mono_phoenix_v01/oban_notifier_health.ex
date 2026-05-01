defmodule MonoPhoenixV01.ObanNotifierHealth do
  @moduledoc """
  Watchdog for Oban's Postgres notifier connection.

  Background: Oban's Cron plugin needs a healthy `Oban.Notifier` to
  function reliably (leader signaling, queue notifications). The Notifier
  holds a dedicated `LISTEN` connection separate from `MonoPhoenixV01.Repo`'s
  pool, and that connection can silently degrade — on Gigalixir we saw the
  daily 13:00 UTC Cron tick stop firing after ~12-24h of pod uptime, while
  manual `Oban.insert!` calls (which don't go through the Notifier) kept
  working. The pattern matched `Oban.Notifier.status/1` returning
  `:isolated` after the underlying connection dropped without auto-recovery.

  This module periodically polls `Oban.Notifier.status/0`. If the status
  stays `:isolated` (or any other non-healthy state) across two consecutive
  checks, we restart the Oban supervisor — the simplest, most surgical way
  to force the Notifier to reconnect cleanly.

  Healthy states: `:solitary` (single node) and `:clustered` (multi-node).
  """

  use GenServer
  require Logger

  # Poll every 60 seconds. Tolerate one unhealthy reading; restart on the
  # second consecutive one. (~2 minute detection window.)
  @poll_interval_ms 60_000
  @healthy_statuses [:solitary, :clustered]

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl GenServer
  def init(_opts) do
    Process.send_after(self(), :poll, @poll_interval_ms)
    {:ok, %{consecutive_unhealthy: 0}}
  end

  @impl GenServer
  def handle_info(:poll, state) do
    state = check_status(state)
    Process.send_after(self(), :poll, @poll_interval_ms)
    {:noreply, state}
  end

  defp check_status(state) do
    status =
      try do
        Oban.Notifier.status()
      rescue
        _ -> :unknown
      catch
        _, _ -> :unknown
      end

    cond do
      status in @healthy_statuses ->
        if state.consecutive_unhealthy > 0 do
          Logger.info("[ObanNotifierHealth] notifier recovered: #{inspect(status)}")
        end

        %{state | consecutive_unhealthy: 0}

      state.consecutive_unhealthy >= 1 ->
        Logger.error(
          "[ObanNotifierHealth] notifier still unhealthy (#{inspect(status)}) after retry, restarting Oban supervisor"
        )

        restart_oban()
        %{state | consecutive_unhealthy: 0}

      true ->
        Logger.warning(
          "[ObanNotifierHealth] notifier status #{inspect(status)} — will recheck in #{div(@poll_interval_ms, 1000)}s"
        )

        %{state | consecutive_unhealthy: state.consecutive_unhealthy + 1}
    end
  end

  defp restart_oban do
    case Process.whereis(MonoPhoenixV01.Supervisor) do
      nil ->
        Logger.error("[ObanNotifierHealth] application supervisor not found, cannot restart Oban")

      sup ->
        case Supervisor.terminate_child(sup, Oban) do
          :ok ->
            Supervisor.restart_child(sup, Oban)
            Logger.info("[ObanNotifierHealth] Oban supervisor restarted")

          {:error, reason} ->
            Logger.error("[ObanNotifierHealth] Oban restart failed: #{inspect(reason)}")
        end
    end
  end
end
