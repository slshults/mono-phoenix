defmodule MonoPhoenixV01Web.SitemapController do
  use MonoPhoenixV01Web, :controller

  # Served dynamically (was a stale static priv/static/sitemap.xml) so the
  # 745 monologue permalink pages are included with real per-page lastmods.
  def index(conn, _params) do
    conn
    |> put_resp_content_type("application/xml")
    |> send_resp(200, MonoPhoenixV01.Sitemap.to_xml())
  end
end
