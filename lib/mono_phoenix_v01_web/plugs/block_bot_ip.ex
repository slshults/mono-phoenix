defmodule MonoPhoenixV01Web.Plugs.BlockBotIp do
  @moduledoc """
  Rejects requests from known bot/scraper data-center IP ranges with a
  403 before they reach routing or body parsing.

  Checks *every* IP in the request's forwarding chain — each entry in
  `X-Forwarded-For` plus `conn.remote_ip` — against the blocklist, and
  blocks if any of them falls in a blocked range. Checking the whole
  chain rather than a single resolved client IP is deliberate: behind
  Gigalixir/GCP the load balancer appends the real client IP to
  `X-Forwarded-For`, so a scraper cannot hide its real data-center IP
  by prepending a clean one (which would defeat matching on only the
  leftmost/resolved entry). Blocked ranges live in
  `MonoPhoenixV01Web.BlockedIps`.
  """

  import Plug.Conn
  require Logger

  alias MonoPhoenixV01Web.BlockedIps

  def init(opts), do: opts

  def call(conn, _opts) do
    case blocked_ip(conn) do
      nil ->
        conn

      ip ->
        Logger.info("Blocked bot IP #{:inet.ntoa(ip)} on #{conn.request_path}")

        conn
        |> send_resp(403, "Forbidden")
        |> halt()
    end
  end

  # First IP in the forwarding chain that falls in a blocked range, or
  # nil if none do.
  defp blocked_ip(conn) do
    conn
    |> chain_ips()
    |> Enum.find(&BlockedIps.blocked?/1)
  end

  # conn.remote_ip plus every parseable X-Forwarded-For entry.
  defp chain_ips(conn) do
    forwarded =
      conn
      |> get_req_header("x-forwarded-for")
      |> Enum.flat_map(&String.split(&1, ","))
      |> Enum.map(&String.trim/1)
      |> Enum.map(&parse_ip/1)
      |> Enum.reject(&is_nil/1)

    [conn.remote_ip | forwarded]
  end

  defp parse_ip(str) do
    case :inet.parse_address(String.to_charlist(str)) do
      # Normalize an IPv4-mapped IPv6 address (e.g. ::ffff:47.79.0.1) to
      # its v4 tuple, so a blocked address can't be smuggled past the
      # IPv4-only blocklist in mapped form.
      {:ok, {0, 0, 0, 0, 0, 0xFFFF, g, h}} ->
        {div(g, 256), rem(g, 256), div(h, 256), rem(h, 256)}

      {:ok, ip} ->
        ip

      {:error, _} ->
        nil
    end
  end
end
