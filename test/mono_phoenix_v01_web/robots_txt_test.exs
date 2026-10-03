defmodule MonoPhoenixV01Web.RobotsTxtTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  @meta_ua "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 (compatible; meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler))"

  test "a blocked crawler can read robots.txt and its Disallow", %{conn: conn} do
    conn =
      conn
      |> put_req_header("user-agent", @meta_ua)
      |> get("/robots.txt")

    body = response(conn, 200)
    # Whole group as one string: the header comment also contains
    # "Disallow: /", so a bare match on that would pin nothing.
    assert body =~
             "User-agent: meta-externalagent\nUser-agent: meta-webindexer\n" <>
               "User-agent: meta-externalads\nUser-agent: meta-externalfetcher\nDisallow: /\n"

    refute body =~ "User-agent: facebookexternalhit"
  end

  test "the same crawler is still blocked everywhere else", %{conn: conn} do
    conn =
      conn
      |> put_req_header("user-agent", @meta_ua)
      |> get("/plays")

    assert response(conn, 403)
  end
end
