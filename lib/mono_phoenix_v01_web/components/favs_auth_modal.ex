defmodule MonoPhoenixV01Web.Components.FavsAuthModal do
  @moduledoc """
  Modal shown when an unauthenticated visitor clicks the heart icon or
  the `Favs` nav link (Phase 4). Two CTAs: Log in, or Support the site
  (i.e. become a patron).

  Visibility is driven by the `@show_favs_auth_modal` socket assign,
  managed by the `MonoPhoenixV01Web.LiveFavoritesHelpers` on_mount hook
  that's attached to every public live_session.

  Closes on: click outside the dialog (backdrop), the x button, or ESC.
  Uses `phx-click-away` on the dialog rather than `phx-click` on the
  backdrop — that pattern lets clicks INSIDE the dialog (the CTAs and
  the close button) still bubble to LiveView normally instead of being
  swallowed by an `event.stopPropagation()` blocker.
  """
  use Phoenix.Component

  use MonoPhoenixV01Web, :verified_routes

  attr :open, :boolean, default: false

  def favs_auth_modal(assigns) do
    ~H"""
    <%= if @open do %>
      <div
        id="favs-auth-modal-backdrop"
        class="favs-auth-modal-backdrop"
        role="presentation"
      >
        <div
          id="favs-auth-modal-dialog"
          class="favs-auth-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="favs-auth-modal-title"
          phx-click-away="close_favs_auth_modal"
          phx-window-keydown="close_favs_auth_modal"
          phx-key="Escape"
          tabindex="-1"
        >
          <button
            type="button"
            phx-click="close_favs_auth_modal"
            class="favs-auth-modal-close"
            aria-label="Close"
          >&times;</button>

          <h2 id="favs-auth-modal-title" class="favs-auth-modal-title">
            Save your favorite monologues with an ad-free account
          </h2>

          <div class="favs-auth-modal-actions">
            <.link href={~p"/users/log-in"} class="btn btn-primary">
              Log in
            </.link>
            <.link href={~p"/signup"} class="btn btn-soft">
              Support the site
            </.link>
          </div>
        </div>
      </div>
    <% end %>
    """
  end
end
