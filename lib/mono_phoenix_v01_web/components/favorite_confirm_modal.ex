defmodule MonoPhoenixV01Web.Components.FavoriteConfirmModal do
  @moduledoc """
  Yes/No confirmation modal shown on `/favorites` when a patron clicks
  the heart to unfavorite a monologue (Phase 4 polish).

  Driven by the `@removing_monologue_id` assign on `FavoritesLive`:
  non-nil → modal open. Confirms via `do_remove_favorite` (the id is
  captured via `phx-value-monologue-id`); cancels via
  `cancel_remove_favorite` from the No button, ESC, or a click outside
  the dialog (`phx-click-away`).
  """
  use Phoenix.Component

  attr :monologue_id, :integer, default: nil

  def favorite_confirm_modal(assigns) do
    ~H"""
    <%= if @monologue_id do %>
      <div
        id="favorite-confirm-backdrop"
        class="favs-auth-modal-backdrop"
        role="presentation"
      >
        <div
          id="favorite-confirm-dialog"
          class="favs-auth-modal favorite-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="favorite-confirm-title"
          phx-click-away="cancel_remove_favorite"
          phx-window-keydown="cancel_remove_favorite"
          phx-key="Escape"
          tabindex="-1"
        >
          <h2 id="favorite-confirm-title" class="favs-auth-modal-title">
            Remove this monologue from your favorites?
          </h2>

          <div class="favs-auth-modal-actions">
            <button
              type="button"
              phx-click="do_remove_favorite"
              phx-value-monologue-id={@monologue_id}
              class="btn btn-primary"
            >
              Yes, remove
            </button>
            <button
              type="button"
              phx-click="cancel_remove_favorite"
              class="btn btn-soft"
            >
              No, keep it
            </button>
          </div>
        </div>
      </div>
    <% end %>
    """
  end
end
