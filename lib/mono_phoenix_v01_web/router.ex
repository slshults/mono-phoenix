defmodule MonoPhoenixV01Web.Router do
  # alias MonoPhoenixV01Web.PageController
  use MonoPhoenixV01Web, :router

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

    get("/", PageController, :index)
    get("/plays", PlaysPageController, :plays)
    get("/play/:playid", PlayPageController, :play)
    get("/mens", MensPageController, :mens)
    get("/men/:playid", MenplayPageController, :menplay)
    get("/womens", WomensPageController, :womens)
    get("/women/:playid", WomenplayPageController, :womenplay)
    get("/monologues", MonologuesPageController, :monologues)
    # get("/search", SearchPageController, :search)
    get("/aboutus", StaticPageController, :aboutus)
    get("/faq", StaticPageController, :faq)
    get("/home", StaticPageController, :home)
    get("/links", StaticPageController, :links)
    get("/privacy", StaticPageController, :privacy)
    get("/maintenance", StaticPageController, :maintenance)
    get("/hello", PageController, :hello)
    get("/sandbox", PageController, :sandbox)
  end

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
