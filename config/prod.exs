import Config

# For production, don't forget to configure the url host
# to something meaningful, Phoenix uses this information
# when generating URLs.
#
# Note we also include the path to a cache manifest
# containing the digested version of static files. This
# manifest is generated by the `mix phx.digest` task,
# which you should run after static files are built and
# before starting your production server.

# Configure your database
config :mono_phoenix_v01, MonoPhoenixV01.Repo,
  username: System.get_env("DATABASE_USERNAME"),
  password: "System.get_env("DATABASE_PASSWORD"),
  hostname: "ec2-44-196-223-128.compute-1.amazonaws.com",
  database: "d6d0qn3kc71hi0",
  port: 5432,
  pool_size: 18

config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
  url: [
    scheme: "https",
    host: "experimental-narwhal-d8n46nst3i1yfpjw0f94xg25.herokudns.com",
    port: 443,
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
  ],
  force_ssl: [rewrite_on: [:x_forwarded_proto]]

# config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
# url: [host: "mono-phoenix.herokuapp.com", port: 80],
#  cache_static_manifest: "priv/static/cache_manifest.json"

# Do not print debug messages in production
config :logger, level: :info

# ## SSL Support
#
# To get SSL working, you will need to add the `https` key
# to the previous section and set your `:url` port to 443:
#
#     config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
#       ...,
#       url: [host: "example.com", port: 443],
#       https: [
#         ...,
#         port: 443,
#         cipher_suite: :strong,
#         keyfile: System.get_env("SOME_APP_SSL_KEY_PATH"),
#         certfile: System.get_env("SOME_APP_SSL_CERT_PATH")
#       ]
#
# The `cipher_suite` is set to `:strong` to support only the
# latest and more secure SSL ciphers. This means old browsers
# and clients may not be supported. You can set it to
# `:compatible` for wider support.
#
# `:keyfile` and `:certfile` expect an absolute path to the key
# and cert in disk or a relative path inside priv, for example
# "priv/ssl/server.key". For all supported SSL configuration
# options, see https://hexdocs.pm/plug/Plug.SSL.html#configure/1
#
# We also recommend setting `force_ssl` in your endpoint, ensuring
# no data is ever sent via http, always redirecting to https:
#
#     config :mono_phoenix_v01, MonoPhoenixV01Web.Endpoint,
#       force_ssl: [hsts: true]
#
# Check `Plug.SSL` for all available options in `force_ssl`.
