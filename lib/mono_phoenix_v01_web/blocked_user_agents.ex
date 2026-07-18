defmodule MonoPhoenixV01Web.BlockedUserAgents do
  @moduledoc """
  Spoofed user-agent signatures blocked at the edge of the web endpoint.

  Populated from the June–July 2026 St. Louis cluster: a fixed
  Android 13 / Chrome 109 user agent that produced hundreds of events
  from dozens of person IDs over weeks, with zero engagement, spread
  thinly across many `148.72.*` addresses. Because the IPs are too
  scattered to blanket a CIDR safely (unlike the Aliyun ranges in
  `MonoPhoenixV01Web.BlockedIps`), the distinctive lever is the UA
  itself. A real Android 13 device auto-updates Chrome, so the
  Android-13-with-Chrome-109 pairing does not occur on legitimate
  traffic and is safe to block.

  Also blocks two July 2026 Ashburn AWS clusters (inbox reports
  019f5bcb… and 019f56a3…): pinned Windows Chrome 127 and Linux
  Chrome 145 UAs, each cycling six unrelated AWS IPs with zero
  engagement events, so again the UA is the only safe lever.

  Each signature is a list of substrings that must **all** appear in
  the user agent (case-insensitively) for it to be blocked. To add or
  remove a signature, edit `@signatures` here. The `BlockBotUserAgent`
  plug reads this list at request time, so no plug changes are needed.
  """

  @signatures [
    ["Android 13", "Chrome/109.0.5414.117"],
    [
      "Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
    ],
    # Chrome 145 went stable 2026-02-10, five versions behind current (150) when
    # this cluster ran — auto-update makes real pinned-145 traffic a rarity.
    [
      "X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
    ]
  ]

  @doc "The blocked user-agent signatures as lists of required substrings."
  def signatures, do: @signatures

  @doc """
  Returns `true` when the given user-agent string matches any blocked
  signature — i.e. contains all of that signature's substrings
  (case-insensitively). Anything that isn't a binary is never blocked.
  """
  def blocked?(user_agent) when is_binary(user_agent) do
    downcased = String.downcase(user_agent)

    Enum.any?(@signatures, fn parts ->
      Enum.all?(parts, fn part -> String.contains?(downcased, String.downcase(part)) end)
    end)
  end

  def blocked?(_), do: false
end
