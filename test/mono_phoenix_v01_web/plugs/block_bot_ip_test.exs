defmodule MonoPhoenixV01Web.Plugs.BlockBotIpTest do
  use ExUnit.Case, async: true

  import Plug.Test
  import Plug.Conn

  alias MonoPhoenixV01Web.Plugs.BlockBotIp

  defp run(conn), do: BlockBotIp.call(conn, BlockBotIp.init([]))

  test "blocks when conn.remote_ip is in a blocked range" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {47, 79, 0, 1})
      |> run()

    assert conn.status == 403
    assert conn.halted
  end

  test "blocks when a blocked IP appears anywhere in x-forwarded-for" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {10, 0, 0, 1})
      |> put_req_header("x-forwarded-for", "8.8.8.8, 47.79.0.1, 10.0.0.1")
      |> run()

    assert conn.status == 403
    assert conn.halted
  end

  test "blocks even when a clean IP is prepended to evade the leftmost match" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {10, 0, 0, 1})
      |> put_req_header("x-forwarded-for", "8.8.8.8, 47.82.8.13")
      |> run()

    assert conn.status == 403
  end

  test "blocks a blocked IP split across multiple x-forwarded-for headers" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {10, 0, 0, 1})
      |> put_req_header("x-forwarded-for", "8.8.8.8")
      |> prepend_req_headers([{"x-forwarded-for", "47.79.0.1"}])
      |> run()

    assert conn.status == 403
  end

  test "blocks a blocked IP given in IPv4-mapped IPv6 form" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {10, 0, 0, 1})
      |> put_req_header("x-forwarded-for", "::ffff:47.79.0.1")
      |> run()

    assert conn.status == 403
  end

  test "allows when no chain entry is blocked" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {75, 156, 108, 152})
      |> put_req_header("x-forwarded-for", "8.8.8.8, 75.156.108.152")
      |> run()

    refute conn.halted
  end

  test "allows a normal request with no forwarding header" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {75, 156, 108, 152})
      |> run()

    refute conn.halted
  end

  test "ignores malformed x-forwarded-for entries" do
    conn =
      conn(:get, "/plays")
      |> Map.put(:remote_ip, {75, 156, 108, 152})
      |> put_req_header("x-forwarded-for", "not-an-ip, , 8.8.8.8")
      |> run()

    refute conn.halted
  end
end
