defmodule MonoPhoenixV01Web.Components.HeartIcon do
  @moduledoc """
  Heart icon for favoriting a monologue (Phase 4).

  Renders a single `<button>` with the configured `event` as `phx-click`
  and the monologue_id + auth_state as phx-values.

  On monologue-listing pages the host LiveView (via the favorites
  on_mount hook in `LiveFavoritesHelpers`) handles `toggle_favorite`
  with these branches:

    - `:unauthenticated` → open the auth-prompt modal
    - `:lapsed` → bounce to `/account/lapsed`
    - `:patron` → toggle and update `favorited_ids`

  On `/favorites` the page passes `event="confirm_remove_favorite"` so
  the hook's catch-all `{:cont, socket}` lets the page-local handler
  fire (which surfaces a Yes/No confirm modal).

  Color inherits via `currentColor`; 16x16 to match the
  summary/paraphrase icons.
  """
  use Phoenix.Component

  attr :monologue_id, :integer, required: true
  attr :filled, :boolean, default: false
  attr :auth_state, :atom, default: :unauthenticated
  attr :event, :string, default: "toggle_favorite"

  def heart_icon(assigns) do
    ~H"""
    <button
      type="button"
      phx-click={@event}
      phx-value-monologue-id={@monologue_id}
      phx-value-auth-state={@auth_state}
      aria-label={if @filled, do: "Remove from favorites", else: "Add to favorites"}
      title={if @filled, do: "Remove from favorites", else: "Add to favorites"}
      class={["heart-icon-btn", @filled && "heart-icon-filled"]}
    >
      <%= if @filled do %>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      <% else %>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      <% end %>
    </button>
    """
  end
end
