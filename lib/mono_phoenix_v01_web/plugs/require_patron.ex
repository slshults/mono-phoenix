defmodule MonoPhoenixV01Web.Plugs.RequirePatron do
  @moduledoc """
  Plug for patron-only routes. Allows the request only if the
  current_scope's user is an active patron. Otherwise flashes an error
  and redirects home.

  Used on /favorites (Phase 4) and the heart-toggle event handler.
  Defined in Phase 2 so the auth surface is complete.
  """

  use MonoPhoenixV01Web, :verified_routes

  import Plug.Conn
  import Phoenix.Controller

  alias MonoPhoenixV01Web.UserAuth

  def init(opts), do: opts

  def call(conn, _opts) do
    user = conn.assigns[:current_scope] && conn.assigns.current_scope.user

    if UserAuth.patron?(user) do
      conn
    else
      conn
      |> put_flash(:error, "This area is for active patrons only.")
      |> redirect(to: ~p"/")
      |> halt()
    end
  end
end
