defmodule MonoPhoenixV01Web.LiveFavoritesHelpers do
  @moduledoc """
  Shared on_mount callback for the Phase 4 favorites feature.

  Wires three pieces of state into every LiveView that participates in
  the public `:public_browse` live_session:

    - `:auth_state` — `:patron | :lapsed | :unauthenticated`
    - `:favorited_ids` — MapSet of monologue ids the current user has
      favorited (empty for non-patrons)
    - `:show_favs_auth_modal` — boolean controlling the auth-prompt
      modal rendered by `live.html.heex`

  Event handlers (`toggle_favorite`, `show_favs_auth_modal`,
  `close_favs_auth_modal`) are attached via `Phoenix.LiveView.attach_hook/4`
  so each host LiveView gets them automatically without duplicating
  `handle_event` clauses.
  """

  import Phoenix.Component, only: [assign: 3]
  import Phoenix.LiveView, only: [attach_hook: 4, push_event: 3, push_navigate: 2]

  alias MonoPhoenixV01.Favorites
  alias MonoPhoenixV01Web.UserAuth

  def on_mount(:default, _params, _session, socket) do
    scope = socket.assigns[:current_scope]
    auth_state = UserAuth.auth_state(scope)
    favorited_ids = load_favorited_ids(scope, auth_state)

    socket =
      socket
      |> assign(:auth_state, auth_state)
      |> assign(:favorited_ids, favorited_ids)
      |> assign(:show_favs_auth_modal, false)
      |> attach_hook(:favs_events, :handle_event, &handle_favs_event/3)

    {:cont, socket}
  end

  defp load_favorited_ids(%{user: %{id: user_id}}, :patron) when is_integer(user_id) do
    Favorites.favorited_ids_for(user_id)
  end

  defp load_favorited_ids(_scope, _), do: MapSet.new()

  @doc """
  Extracts the user_id from a `current_scope` assign, returning nil if
  no user is present. Used by parent LiveViews to pass a stable
  patron-id into nested search `live_render` sessions.
  """
  def user_id_from_scope(%{user: %{id: id}}) when is_integer(id), do: id
  def user_id_from_scope(_), do: nil

  @doc """
  True when the given user_id corresponds to an active patron. Used
  by nested search LiveViews to decide whether to render hearts.
  Returns false on nil or non-active subscription.
  """
  def patron_id?(nil), do: false

  def patron_id?(user_id) when is_integer(user_id) do
    import Ecto.Query

    case MonoPhoenixV01.Accounts.Repo.one(
           from u in MonoPhoenixV01.Accounts.User,
             where: u.id == ^user_id,
             select: u.subscription_status
         ) do
      "active" -> true
      _ -> false
    end
  end

  defp handle_favs_event("toggle_favorite", %{"monologue-id" => mid_str}, socket) do
    case parse_monologue_id(mid_str) do
      :error ->
        # Garbage phx-value from a malformed client. Drop silently
        # rather than crashing the LV process.
        {:halt, socket}

      {:ok, monologue_id} ->
        # Authoritative source for auth state is the socket. The
        # phx-value the client sends is advisory only (could be stale
        # if a tab sat open across a subscription change).
        case socket.assigns[:auth_state] do
          :unauthenticated ->
            socket =
              socket
              |> assign(:show_favs_auth_modal, true)
              |> push_posthog("favorite_modal_shown", %{source: "heart_click"})

            {:halt, socket}

          :lapsed ->
            {:halt, push_navigate(socket, to: "/account/lapsed")}

          :patron ->
            {:halt, toggle(socket, monologue_id)}
        end
    end
  end

  defp handle_favs_event("show_favs_auth_modal", _params, socket) do
    socket =
      socket
      |> assign(:show_favs_auth_modal, true)
      |> push_posthog("favorite_modal_shown", %{source: "favs_nav_link"})

    {:halt, socket}
  end

  defp handle_favs_event("close_favs_auth_modal", _params, socket) do
    {:halt, assign(socket, :show_favs_auth_modal, false)}
  end

  defp handle_favs_event(_event, _params, socket), do: {:cont, socket}

  defp parse_monologue_id(str) when is_binary(str) do
    case Integer.parse(str) do
      {id, ""} when id > 0 -> {:ok, id}
      _ -> :error
    end
  end

  defp parse_monologue_id(_), do: :error

  defp toggle(socket, monologue_id) do
    user_id = socket.assigns.current_scope.user.id
    current = socket.assigns.favorited_ids

    if MapSet.member?(current, monologue_id) do
      :ok = Favorites.remove(user_id, monologue_id)

      socket
      |> assign(:favorited_ids, MapSet.delete(current, monologue_id))
      |> push_posthog("favorite_removed", %{
        monologue_id: monologue_id,
        source: "monologue_page"
      })
    else
      case Favorites.add(user_id, monologue_id) do
        {:ok, _favorite} ->
          socket
          |> assign(:favorited_ids, MapSet.put(current, monologue_id))
          |> push_posthog("favorite_added", %{
            monologue_id: monologue_id,
            source: "monologue_page"
          })

        {:error, _} ->
          socket
      end
    end
  end

  @doc """
  Push a PostHog event from any LiveView socket. JS listener in
  `assets/js/app.js` (see `phx:posthog_capture`) forwards to
  `posthog.capture/2`.
  """
  def push_posthog(socket, event, properties \\ %{}) do
    push_event(socket, "posthog_capture", %{event: event, properties: properties})
  end
end
