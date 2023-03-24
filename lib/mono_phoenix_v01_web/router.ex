defmodule MonoPhoenixV01Web.Router do
  use MonoPhoenixV01Web, :router

  import Redirect

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, {MonoPhoenixV01Web.LayoutView, :root})
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/", MonoPhoenixV01Web do
    pipe_through(:browser)

    get("/", StaticPageController, :home)
    live("/plays", PlaysPageLive)
    live("/play/:playid", PlayPageLive)
    get("/mens", MensPageController, :mens)
    get("/men/:playid", MenplayPageController, :menplay)
    get("/womens", WomensPageController, :womens)
    get("/women/:playid", WomenplayPageController, :womenplay)
    get("/monologues/:monoid", MonologuesPageController, :monologues)
    get("/aboutus", StaticPageController, :aboutus)
    get("/faq", StaticPageController, :faq)
    get("/home", StaticPageController, :home)
    get("/links", StaticPageController, :links)
    get("/privacy", StaticPageController, :privacy)
    get("/maintenance", StaticPageController, :maintenance)
    get("/hello", PageController, :hello)
    get("/sandbox", PageController, :sandbox)
    live("/search_bar", SearchBarLive, :search_bar)
  end

  ## redirects for deep links from other sites. Will not work inside a scope.
  # redirect from /men/plays/123 to /men/123
  # redirect from /men/plays/123 to /men/123
  redirect("/men", "/mens", :permanent, preserve_query_string: true)
  redirect("/women", "/womens", :permanent, preserve_query_string: true)
  redirect("/men/plays/13", "/men/13", :permanent, preserve_query_string: true)
  redirect("/men/plays/9", "/men/9", :permanent, preserve_query_string: true)
  redirect("/men/plays/1", "/men/1", :permanent, preserve_query_string: true)
  redirect("/men/plays/3", "/men/3", :permanent, preserve_query_string: true)
  redirect("/men/plays/4", "/men/4", :permanent, preserve_query_string: true)
  redirect("/men/plays/10", "/men/10", :permanent, preserve_query_string: true)
  redirect("/men/plays/11", "/men/11", :permanent, preserve_query_string: true)
  redirect("/men/plays/6", "/men/6", :permanent, preserve_query_string: true)
  redirect("/men/plays/18", "/men/18", :permanent, preserve_query_string: true)
  redirect("/men/plays/2", "/men/2", :permanent, preserve_query_string: true)
  redirect("/men/plays/5", "/men/5", :permanent, preserve_query_string: true)
  redirect("/men/plays/7", "/men/7", :permanent, preserve_query_string: true)
  redirect("/men/plays/14", "/men/14", :permanent, preserve_query_string: true)
  redirect("/men/plays/17", "/men/17", :permanent, preserve_query_string: true)
  redirect("/men/plays/15", "/men/15", :permanent, preserve_query_string: true)
  redirect("/men/plays/8", "/men/8", :permanent, preserve_query_string: true)
  redirect("/men/plays/16", "/men/16", :permanent, preserve_query_string: true)
  redirect("/men/plays/19", "/men/19", :permanent, preserve_query_string: true)
  redirect("/men/plays/20", "/men/20", :permanent, preserve_query_string: true)
  redirect("/men/plays/21", "/men/21", :permanent, preserve_query_string: true)
  redirect("/men/plays/22", "/men/22", :permanent, preserve_query_string: true)
  redirect("/men/plays/23", "/men/23", :permanent, preserve_query_string: true)
  redirect("/men/plays/24", "/men/24", :permanent, preserve_query_string: true)
  redirect("/men/plays/25", "/men/25", :permanent, preserve_query_string: true)
  redirect("/men/plays/26", "/men/26", :permanent, preserve_query_string: true)
  redirect("/men/plays/27", "/men/27", :permanent, preserve_query_string: true)
  redirect("/men/plays/28", "/men/28", :permanent, preserve_query_string: true)
  redirect("/men/plays/29", "/men/29", :permanent, preserve_query_string: true)
  redirect("/men/plays/30", "/men/30", :permanent, preserve_query_string: true)
  redirect("/men/plays/31", "/men/31", :permanent, preserve_query_string: true)
  redirect("/men/plays/38", "/men/38", :permanent, preserve_query_string: true)
  redirect("/men/plays/32", "/men/32", :permanent, preserve_query_string: true)
  redirect("/men/plays/33", "/men/33", :permanent, preserve_query_string: true)
  redirect("/men/plays/34", "/men/34", :permanent, preserve_query_string: true)
  redirect("/men/plays/35", "/men/35", :permanent, preserve_query_string: true)
  redirect("/men/plays/36", "/men/36", :permanent, preserve_query_string: true)
  redirect("/men/plays/37", "/men/37", :permanent, preserve_query_string: true)
  # redirect /women/plays/123 to /women/123
  redirect("/women/plays/13", "/women/13", :permanent, preserve_query_string: true)
  redirect("/women/plays/9", "/women/9", :permanent, preserve_query_string: true)
  redirect("/women/plays/1", "/women/1", :permanent, preserve_query_string: true)
  redirect("/women/plays/3", "/women/3", :permanent, preserve_query_string: true)
  redirect("/women/plays/4", "/women/4", :permanent, preserve_query_string: true)
  redirect("/women/plays/10", "/women/10", :permanent, preserve_query_string: true)
  redirect("/women/plays/11", "/women/11", :permanent, preserve_query_string: true)
  redirect("/women/plays/6", "/women/6", :permanent, preserve_query_string: true)
  redirect("/women/plays/18", "/women/18", :permanent, preserve_query_string: true)
  redirect("/women/plays/2", "/women/2", :permanent, preserve_query_string: true)
  redirect("/women/plays/5", "/women/5", :permanent, preserve_query_string: true)
  redirect("/women/plays/7", "/women/7", :permanent, preserve_query_string: true)
  redirect("/women/plays/14", "/women/14", :permanent, preserve_query_string: true)
  redirect("/women/plays/17", "/women/17", :permanent, preserve_query_string: true)
  redirect("/women/plays/15", "/women/15", :permanent, preserve_query_string: true)
  redirect("/women/plays/8", "/women/8", :permanent, preserve_query_string: true)
  redirect("/women/plays/16", "/women/16", :permanent, preserve_query_string: true)
  redirect("/women/plays/19", "/women/19", :permanent, preserve_query_string: true)
  redirect("/women/plays/20", "/women/20", :permanent, preserve_query_string: true)
  redirect("/women/plays/21", "/women/21", :permanent, preserve_query_string: true)
  redirect("/women/plays/22", "/women/22", :permanent, preserve_query_string: true)
  redirect("/women/plays/23", "/women/23", :permanent, preserve_query_string: true)
  redirect("/women/plays/24", "/women/24", :permanent, preserve_query_string: true)
  redirect("/women/plays/25", "/women/25", :permanent, preserve_query_string: true)
  redirect("/women/plays/26", "/women/26", :permanent, preserve_query_string: true)
  redirect("/women/plays/27", "/women/27", :permanent, preserve_query_string: true)
  redirect("/women/plays/28", "/women/28", :permanent, preserve_query_string: true)
  redirect("/women/plays/29", "/women/29", :permanent, preserve_query_string: true)
  redirect("/women/plays/30", "/women/30", :permanent, preserve_query_string: true)
  redirect("/women/plays/31", "/women/31", :permanent, preserve_query_string: true)
  redirect("/women/plays/38", "/women/38", :permanent, preserve_query_string: true)
  redirect("/women/plays/32", "/women/32", :permanent, preserve_query_string: true)
  redirect("/women/plays/33", "/women/33", :permanent, preserve_query_string: true)
  redirect("/women/plays/34", "/women/34", :permanent, preserve_query_string: true)
  redirect("/women/plays/35", "/women/35", :permanent, preserve_query_string: true)
  redirect("/women/plays/36", "/women/36", :permanent, preserve_query_string: true)
  redirect("/women/plays/37", "/women/37", :permanent, preserve_query_string: true)
  # redirect /plays/123 to /play/123
  redirect("/plays/13", "/play/13", :permanent, preserve_query_string: true)
  redirect("/plays/9", "/play/9", :permanent, preserve_query_string: true)
  redirect("/plays/1", "/play/1", :permanent, preserve_query_string: true)
  redirect("/plays/3", "/play/3", :permanent, preserve_query_string: true)
  redirect("/plays/4", "/play/4", :permanent, preserve_query_string: true)
  redirect("/plays/10", "/play/10", :permanent, preserve_query_string: true)
  redirect("/plays/11", "/play/11", :permanent, preserve_query_string: true)
  redirect("/plays/6", "/play/6", :permanent, preserve_query_string: true)
  redirect("/plays/18", "/play/18", :permanent, preserve_query_string: true)
  redirect("/plays/2", "/play/2", :permanent, preserve_query_string: true)
  redirect("/plays/5", "/play/5", :permanent, preserve_query_string: true)
  redirect("/plays/7", "/play/7", :permanent, preserve_query_string: true)
  redirect("/plays/14", "/play/14", :permanent, preserve_query_string: true)
  redirect("/plays/17", "/play/17", :permanent, preserve_query_string: true)
  redirect("/plays/15", "/play/15", :permanent, preserve_query_string: true)
  redirect("/plays/8", "/play/8", :permanent, preserve_query_string: true)
  redirect("/plays/16", "/play/16", :permanent, preserve_query_string: true)
  redirect("/plays/19", "/play/19", :permanent, preserve_query_string: true)
  redirect("/plays/20", "/play/20", :permanent, preserve_query_string: true)
  redirect("/plays/21", "/play/21", :permanent, preserve_query_string: true)
  redirect("/plays/22", "/play/22", :permanent, preserve_query_string: true)
  redirect("/plays/23", "/play/23", :permanent, preserve_query_string: true)
  redirect("/plays/24", "/play/24", :permanent, preserve_query_string: true)
  redirect("/plays/25", "/play/25", :permanent, preserve_query_string: true)
  redirect("/plays/26", "/play/26", :permanent, preserve_query_string: true)
  redirect("/plays/27", "/play/27", :permanent, preserve_query_string: true)
  redirect("/plays/28", "/play/28", :permanent, preserve_query_string: true)
  redirect("/plays/29", "/play/29", :permanent, preserve_query_string: true)
  redirect("/plays/30", "/play/30", :permanent, preserve_query_string: true)
  redirect("/plays/31", "/play/31", :permanent, preserve_query_string: true)
  redirect("/plays/38", "/play/38", :permanent, preserve_query_string: true)
  redirect("/plays/32", "/play/32", :permanent, preserve_query_string: true)
  redirect("/plays/33", "/play/33", :permanent, preserve_query_string: true)
  redirect("/plays/34", "/play/34", :permanent, preserve_query_string: true)
  redirect("/plays/35", "/play/35", :permanent, preserve_query_string: true)
  redirect("/plays/36", "/play/36", :permanent, preserve_query_string: true)
  redirect("/plays/37", "/play/37", :permanent, preserve_query_string: true)

  # Other scopes may use custom stacks.
  # scope "/api", MonoPhoenixV01Web do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through(:browser)

      live_dashboard("/dashboard", metrics: MonoPhoenixV01Web.Telemetry)
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through(:browser)

      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end
