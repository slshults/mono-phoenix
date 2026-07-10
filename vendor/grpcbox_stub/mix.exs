# Module-free stand-in for grpcbox, wired in via `override: true` in the
# root mix.exs.
#
# Why it exists: opentelemetry_exporter hard-depends on grpcbox for its
# :grpc OTLP transport, but this app only exports over :http_protobuf
# (see config/runtime.exs). grpcbox drags in chatterbox, whose h2_*
# modules (h2_connection, h2_frame, ...) collide by name with the `h2`
# package that hackney 4.x requires — and `mix release` aborts with
# "Duplicated modules" when both are present. Gigalixir builds a release,
# so that collision blocked deploys.
#
# The stub keeps the :grpcbox app name resolvable (opentelemetry_exporter's
# .app file lists grpcbox AND ctx as runtime dependencies, so release boot
# validation needs both present) while shipping zero modules — chatterbox,
# acceptor_pool, gproc, and hpack drop out of the tree entirely. The :ctx
# dep is carried here because the real grpcbox was the only thing pulling
# it in.
#
# If we ever switch the exporter to :grpc, delete this stub and the
# override in the root mix.exs — and expect the hackney/h2 collision to
# need a real resolution.
defmodule GrpcboxStub.MixProject do
  use Mix.Project

  def project do
    [
      app: :grpcbox,
      version: "0.17.1",
      deps: [{:ctx, "~> 0.6"}]
    ]
  end

  def application do
    [extra_applications: []]
  end
end
