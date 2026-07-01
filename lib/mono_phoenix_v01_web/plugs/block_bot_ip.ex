defmodule MonoPhoenixV01Web.Plugs.BlockBotIp do
  @moduledoc """
  Rejects requests from known bot/scraper data-center IP ranges with a
  403 before they reach routing or body parsing.

  Relies on `RemoteIp` having already rewritten `conn.remote_ip` from
  the `X-Forwarded-For` header. On Gigalixir the raw `conn.remote_ip`
  is the load balancer, not the client, so this plug must run *after*
  `RemoteIp` in the endpoint. Blocked ranges live in
  `MonoPhoenixV01Web.BlockedIps`.
  """

  import Plug.Conn
  require Logger

  alias MonoPhoenixV01Web.BlockedIps

  def init(opts), do: opts

  def call(conn, _opts) do
    if BlockedIps.blocked?(conn.remote_ip) do
      Logger.info("Blocked bot IP #{:inet.ntoa(conn.remote_ip)} on #{conn.request_path}")

      conn
      |> send_resp(403, "Forbidden")
      |> halt()
    else
      conn
    end
  end
end
