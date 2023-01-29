defmodule MonoPhoenixV01Web.StaticPageController do
  use MonoPhoenixV01Web, :controller

  def home(conn, _params) do
    render(conn, "home.html")
  end

  def faq(conn, _params) do
    render(conn, "faq.html")
  end

  def aboutus(conn, _params) do
    render(conn, "aboutus.html")
  end

  def links(conn, _params) do
    render(conn, "links.html")
  end

  def privacy(conn, _params) do
    render(conn, "privacy.html")
  end

  def maintenance(conn, _params) do
    render(conn, "maintenance.html")
  end
end
