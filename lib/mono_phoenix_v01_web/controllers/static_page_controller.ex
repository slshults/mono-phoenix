defmodule MonoPhoenixV01Web.StaticPageController do
  use MonoPhoenixV01Web, :controller

  def home(conn, _params) do
    page_title = "Welcome"
    render(conn, "home.html", page_title: page_title)
  end

  def faq(conn, _params) do
    page_title = "Frequently Asked Questions"
    render(conn, "faq.html", page_title: page_title)
  end

  def aboutus(conn, _params) do
    page_title = "About Us"
    render(conn, "aboutus.html", page_title: page_title)
  end

  def links(conn, _params) do
    page_title = "Reciprocal Links"
    render(conn, "links.html", page_title: page_title)
  end

  def privacy(conn, _params) do
    page_title = "Privacy"
    render(conn, "privacy.html", page_title: page_title)
  end

  def maintenance(conn, _params) do
    page_title = "Our Apologies. We'll be back."
    render(conn, "maintenance.html", page_title: page_title)
  end
end
