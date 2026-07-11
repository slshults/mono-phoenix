defmodule MonoPhoenixV01Web.Endpoint do
  use Phoenix.Endpoint, otp_app: :mono_phoenix_v01

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_mono_phoenix_v01_key",
    signing_salt: "s8druUxv"
  ]

  socket("/live", Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options], timeout: 45_000]
  )

  # Resolve the real client IP from X-Forwarded-For (Gigalixir runs
  # behind a proxy, so conn.remote_ip is otherwise the load balancer)
  # and drop known scraper/data-center ranges with a 403. Placed at the
  # very edge — before Plug.Static — so blocked IPs can't even pull
  # static assets, robots.txt, or sitemap.xml.
  plug(RemoteIp)
  plug(MonoPhoenixV01Web.Plugs.BlockBotIp)

  # Drop fleets that rotate across too many IPs to blocklist by CIDR
  # but share one distinctive spoofed user agent (e.g. the St. Louis
  # Android 13 / Chrome 109 cluster). Same 403, same edge placement.
  plug(MonoPhoenixV01Web.Plugs.BlockBotUserAgent)

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug(Plug.Static,
    at: "/",
    from: :mono_phoenix_v01,
    gzip: false,
    only: MonoPhoenixV01Web.static_paths()
  )

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket("/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket)
    plug(Phoenix.LiveReloader)
    plug(Phoenix.CodeReloader)
    plug(Phoenix.Ecto.CheckRepoStatus, otp_app: :mono_phoenix_v01)
  end

  plug(Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"
  )

  plug(Plug.RequestId)
  plug(Plug.Telemetry, event_prefix: [:phoenix, :endpoint])

  plug(Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library(),
    body_reader: {MonoPhoenixV01Web.Plugs.StripeBodyReader, :read_body, []}
  )

  plug(Plug.MethodOverride)
  plug(Plug.Head)
  plug(Plug.Session, @session_options)
  plug(MonoPhoenixV01Web.Router)
end
