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
    websocket: [connect_info: [session: @session_options], timeout: 45_000],
    check_origin: [
      "https://www.shakespeare-monologues.org",
      "//www.shakespeare-monologues.org",
      "www.shakespeare-monologues.org",
      "//shakespeare-monologues.org",
      "//experimental-narwhal-d8n46nst3i1yfpjw0f94xg25.herokudns.com",
      "//mono-phoenix.herokuapp.com",
      "https://mono-phoenix.herokuapp.com",
      "https://experimental-narwhal-d8n46nst3i1yfpjw0f94xg25.herokudns.com"
    ]
  )

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
    json_decoder: Phoenix.json_library()
  )

  plug(Plug.MethodOverride)
  plug(Plug.Head)
  plug(Plug.Session, @session_options)
  plug(MonoPhoenixV01Web.Router)
end
