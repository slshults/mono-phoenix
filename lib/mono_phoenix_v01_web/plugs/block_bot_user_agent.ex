defmodule MonoPhoenixV01Web.Plugs.BlockBotUserAgent do
  @moduledoc """
  Rejects requests whose `User-Agent` header matches a known spoofed
  bot signature with a 403 before they reach routing or body parsing.

  Complements `BlockBotIp`: that plug blocks scraper data-center IP
  ranges, while this one catches fleets that rotate across too many
  addresses to blocklist by CIDR but share one distinctive spoofed UA.
  Blocked signatures live in `MonoPhoenixV01Web.BlockedUserAgents`.
  """

  import Plug.Conn
  require Logger

  alias MonoPhoenixV01Web.BlockedUserAgents

  def init(opts), do: opts

  def call(conn, _opts) do
    user_agent = conn |> get_req_header("user-agent") |> List.first()

    if BlockedUserAgents.blocked?(user_agent) do
      Logger.info("Blocked bot UA #{inspect(user_agent)} on #{conn.request_path}")

      conn
      |> send_resp(403, "Forbidden")
      |> halt()
    else
      conn
    end
  end
end
