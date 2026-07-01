defmodule MonoPhoenixV01Web.BlockedIpsTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01Web.BlockedIps

  describe "blocked?/1" do
    test "blocks IPs inside the Aliyun ranges seen in the June 2026 fleet" do
      assert BlockedIps.blocked?({47, 79, 0, 0})
      assert BlockedIps.blocked?({47, 79, 11, 42})
      assert BlockedIps.blocked?({47, 79, 255, 255})
      assert BlockedIps.blocked?({47, 82, 8, 13})
      assert BlockedIps.blocked?({47, 82, 54, 200})
    end

    test "allows IPs just outside the blocked /16s" do
      refute BlockedIps.blocked?({47, 78, 255, 255})
      refute BlockedIps.blocked?({47, 80, 0, 0})
      refute BlockedIps.blocked?({47, 81, 0, 1})
      refute BlockedIps.blocked?({47, 83, 0, 0})
    end

    test "allows ordinary public IPs" do
      refute BlockedIps.blocked?({8, 8, 8, 8})
      refute BlockedIps.blocked?({142, 250, 72, 78})
    end

    test "never blocks IPv6 addresses or malformed input" do
      refute BlockedIps.blocked?({0, 0, 0, 0, 0, 0, 0, 1})
      refute BlockedIps.blocked?(nil)
      refute BlockedIps.blocked?("47.79.0.1")
    end
  end
end
