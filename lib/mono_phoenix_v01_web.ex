defmodule MonoPhoenixV01Web do
  @moduledoc """
  The entrypoint for defining your web interface, such
  as controllers, views, channels and so on.

  This can be used in your application as:

      use MonoPhoenixV01Web, :controller
      use MonoPhoenixV01Web, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below. Instead, define any helper function in modules
  and import those modules here.
  """

  def static_paths do
    ~w(assets fonts images favicon.ico robots.txt ads.txt sitemap.xml)
  end

  def controller do
    quote do
      use Phoenix.Controller, namespace: MonoPhoenixV01Web
      import Plug.Conn
      import MonoPhoenixV01Web.Gettext
      alias MonoPhoenixV01Web.Router.Helpers, as: Routes
      unquote(verified_routes())
    end
  end

  def view do
    quote do
      use Phoenix.View,
        root: "lib/mono_phoenix_v01_web/templates",
        namespace: MonoPhoenixV01Web

      # Import convenience functions from controllers
      import Phoenix.Controller,
        only: [get_flash: 1, get_flash: 2, view_module: 1, view_template: 1]

      import Phoenix.Component

      # Include shared imports and aliases for views
      unquote(view_helpers())
    end
  end

  def live_view do
    quote do
      use Phoenix.LiveView,
        layout: {MonoPhoenixV01Web.LayoutView, :live}

      unquote(view_helpers())
    end
  end

  def live_component do
    quote do
      use Phoenix.LiveComponent

      unquote(view_helpers())
    end
  end

  def component do
    quote do
      use Phoenix.Component

      unquote(view_helpers())
    end
  end

  def router do
    quote do
      use Phoenix.Router

      import Plug.Conn
      import Phoenix.Controller
      import Phoenix.LiveView.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
      import MonoPhoenixV01Web.Gettext
    end
  end

  defp view_helpers do
    quote do
      # Use all HTML functionality (forms, tags, etc)
      import Phoenix.HTML
      import Phoenix.HTML.Form
      use PhoenixHTMLHelpers

      # Import LiveView and .heex helpers (live_render, live_patch, <.form>, etc)
      import Phoenix.Component

      # Import basic rendering functionality (render, render_layout, etc)
      import Phoenix.View

      import MonoPhoenixV01Web.ErrorHelpers
      import MonoPhoenixV01Web.Gettext
      alias MonoPhoenixV01Web.Router.Helpers, as: Routes

      unquote(verified_routes())
    end
  end

  def verified_routes do
    quote do
      use Phoenix.VerifiedRoutes,
        endpoint: MonoPhoenixV01Web.Endpoint,
        router: MonoPhoenixV01Web.Router,
        statics: MonoPhoenixV01Web.static_paths()
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end

# Custom 404 error page : from https://tmbb.github.io/phoenix/custom_error_pages.html

# This approach, handles the NoRouteErrors, but not the bad args

defmodule MonoPhoenixV01Web.FileNotFoundError do
  defexception [:message, plug_status: 404]
end
