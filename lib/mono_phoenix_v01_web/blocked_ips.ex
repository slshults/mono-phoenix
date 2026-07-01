defmodule MonoPhoenixV01Web.BlockedIps do
  @moduledoc """
  Data-center IP ranges blocked at the edge of the web endpoint.

  Populated from the June 2026 Alibaba Cloud (Aliyun) scraper fleet
  that swept the monologue catalog: hundreds of rotating IPs, one
  pageview each, spoofing real desktop Chrome user agents so the UA
  bot list couldn't catch them. Every source IP sat in `47.79.0.0/16`
  or `47.82.0.0/16` — pure Aliyun data-center space with no expected
  human traffic for a monologues catalog, so blocking the full /16s is
  safe.

  To add or remove a range, edit `@cidrs` here. The `BlockBotIp` plug
  reads this list at request time, so no plug changes are needed.
  """

  # {network_tuple, prefix_length}. IPv4 only — the ranges we block and
  # the client IPs Gigalixir forwards are all v4.
  @cidrs [
    {{47, 79, 0, 0}, 16},
    {{47, 82, 0, 0}, 16}
  ]

  @doc "The blocked CIDR ranges as `{ip_tuple, prefix_len}`."
  def cidrs, do: @cidrs

  @doc """
  Returns `true` when the given `:inet` IPv4 tuple falls inside any
  blocked range. Non-IPv4 addresses (including IPv6 8-tuples) are never
  blocked.
  """
  def blocked?({_, _, _, _} = ip) do
    Enum.any?(@cidrs, fn {network, prefix} -> in_cidr?(ip, network, prefix) end)
  end

  def blocked?(_), do: false

  defp in_cidr?({a, b, c, d}, {na, nb, nc, nd}, prefix) do
    <<ip_prefix::size(prefix), _::bitstring>> = <<a, b, c, d>>
    <<net_prefix::size(prefix), _::bitstring>> = <<na, nb, nc, nd>>
    ip_prefix == net_prefix
  end
end
