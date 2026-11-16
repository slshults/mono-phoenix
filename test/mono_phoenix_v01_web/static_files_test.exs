defmodule MonoPhoenixV01Web.StaticFilesTest do
  @moduledoc """
  Files that browsers and crawlers request by convention at the site root.
  Before these existed, each request fell through to the router as a 404
  and was captured as a `page_not_found` PostHog event.
  """
  use MonoPhoenixV01Web.ConnCase, async: true

  @root_icons ~w(
    /apple-touch-icon.png
    /apple-touch-icon-precomposed.png
    /apple-touch-icon-120x120.png
    /apple-touch-icon-120x120-precomposed.png
    /apple-touch-icon-240x240.png
    /apple-touch-icon-240x240-precomposed.png
  )

  test "opensearch.xml points browsers at the search page", %{conn: conn} do
    conn = get(conn, "/opensearch.xml")

    body = response(conn, 200)
    assert body =~ "<OpenSearchDescription"
    assert body =~ "/search_bar?q={searchTerms}"
  end

  for path <- @root_icons do
    test "#{path} is served as a PNG", %{conn: conn} do
      conn = get(conn, unquote(path))

      assert response(conn, 200)
      assert ["image/png" <> _] = get_resp_header(conn, "content-type")
    end
  end

  test "the layout's precomposed touch icon points at a file that exists" do
    layout = File.read!("lib/mono_phoenix_v01_web/templates/layout/root.html.heex")

    refute layout =~ ~s(href="/img/)
    assert File.exists?("priv/static/images/icon-152x152.png")
  end
end
