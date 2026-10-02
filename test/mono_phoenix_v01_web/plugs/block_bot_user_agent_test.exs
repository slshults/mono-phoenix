defmodule MonoPhoenixV01Web.Plugs.BlockBotUserAgentTest do
  use ExUnit.Case, async: true

  import Plug.Test
  import Plug.Conn

  alias MonoPhoenixV01Web.Plugs.BlockBotUserAgent

  @spoofed_ua "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.117 Mobile Safari/537.36"

  defp run(conn), do: BlockBotUserAgent.call(conn, BlockBotUserAgent.init([]))

  test "blocks a request carrying the spoofed user agent" do
    conn =
      conn(:get, "/plays")
      |> put_req_header("user-agent", @spoofed_ua)
      |> run()

    assert conn.status == 403
    assert conn.halted
  end

  test "allows a request with an ordinary user agent" do
    conn =
      conn(:get, "/plays")
      |> put_req_header(
        "user-agent",
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36"
      )
      |> run()

    refute conn.halted
  end

  test "lets a blocked user agent fetch robots.txt" do
    conn =
      conn(:get, "/robots.txt")
      |> put_req_header("user-agent", @spoofed_ua)
      |> run()

    refute conn.halted
    assert conn.status == nil
  end

  test "still blocks a blocked user agent on robots.txt look-alikes and non-GET methods" do
    for {method, path} <- [
          {:get, "/ROBOTS.TXT"},
          {:get, "/robots.txt/../plays"},
          {:get, "//robots.txt"},
          {:post, "/robots.txt"}
        ] do
      conn =
        conn(method, path)
        |> put_req_header("user-agent", @spoofed_ua)
        |> run()

      assert conn.status == 403, "expected 403 for #{method} #{path}"
      assert conn.halted
    end
  end

  test "allows a request with no user-agent header" do
    conn =
      conn(:get, "/plays")
      |> run()

    refute conn.halted
  end
end
