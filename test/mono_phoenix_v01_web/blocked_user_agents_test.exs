defmodule MonoPhoenixV01Web.BlockedUserAgentsTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01Web.BlockedUserAgents

  @spoofed_ua "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.117 Mobile Safari/537.36"
  @ashburn_windows_ua "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
  @ashburn_linux_ua "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"

  describe "blocked?/1" do
    test "blocks the St. Louis Android 13 / Chrome 109 spoofed UA" do
      assert BlockedUserAgents.blocked?(@spoofed_ua)
    end

    test "blocks the Ashburn Windows Chrome 127 spoofed UA" do
      assert BlockedUserAgents.blocked?(@ashburn_windows_ua)
    end

    test "blocks the Ashburn Linux Chrome 145 spoofed UA" do
      assert BlockedUserAgents.blocked?(@ashburn_linux_ua)
    end

    test "matches case-insensitively" do
      assert BlockedUserAgents.blocked?(String.downcase(@spoofed_ua))
      assert BlockedUserAgents.blocked?(String.upcase(@spoofed_ua))
    end

    test "requires all substrings of a signature — a partial match is not blocked" do
      # Real Android 13 device on a current Chrome build.
      refute BlockedUserAgents.blocked?(
               "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36"
             )

      # Chrome 109 build on a different OS (not the spoofed pairing).
      refute BlockedUserAgents.blocked?(
               "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.117 Safari/537.36"
             )
    end

    test "allows ordinary browser user agents" do
      refute BlockedUserAgents.blocked?(
               "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
             )

      # Current-version Chrome (150, July 2026) on the same platforms as
      # the pinned Ashburn signatures must not be caught.
      refute BlockedUserAgents.blocked?(
               "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
             )

      refute BlockedUserAgents.blocked?(
               "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
             )

      refute BlockedUserAgents.blocked?(
               "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1"
             )
    end

    test "never blocks non-binary input" do
      refute BlockedUserAgents.blocked?(nil)
      refute BlockedUserAgents.blocked?([])
    end
  end
end
