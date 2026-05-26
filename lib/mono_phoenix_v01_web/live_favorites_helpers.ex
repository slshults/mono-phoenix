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
      |> maybe_push_identify(scope, auth_state)

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

  @doc """
  Push a PostHog identify call from any LiveView socket. JS listener
  in `assets/js/app.js` (see `phx:posthog_identify`) forwards to
  `posthog.identify(distinct_id, props)` — this aliases the anonymous
  browser distinct_id onto the new identified distinct_id so anonymous
  frontend events stitch onto the same person as the server-side
  events captured with the same distinct_id.

  We use the user's email as distinct_id so PostHog renders patrons by
  their email in person profile views — handy for support workflows
  (password resets, cancellation requests, etc.).

  `distinct_id` is coerced to a string before sending; person `props`
  are set with `$set`-style semantics (overwrite on each call).
  """
  def push_posthog_identify(socket, distinct_id, props \\ %{}) do
    push_event(socket, "posthog_identify", %{
      distinct_id: to_string(distinct_id),
      props: props
    })
  end

  defp maybe_push_identify(socket, %{user: %{email: email} = user}, auth_state)
       when is_binary(email) do
    push_posthog_identify(socket, email, identify_props(user, auth_state))
  end

  defp maybe_push_identify(socket, _scope, _auth_state), do: socket

  @doc """
  Person properties for a User row, suitable for PostHog `$set` /
  `$set_once`. Email is included as both the distinct_id (separately,
  by the caller) and a person property — PostHog renders the `email`
  property in person profile views.
  """
  def identify_props(user, auth_state) do
    %{
      email: user.email,
      user_id: user.id,
      subscription_status: user.subscription_status,
      billing_period: user.billing_period,
      current_period_end: format_iso8601(user.current_period_end),
      has_password: not is_nil(user.hashed_password),
      has_been_welcomed: not is_nil(user.welcomed_at),
      auth_state: Atom.to_string(auth_state)
    }
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    |> Map.new()
  end

  defp format_iso8601(nil), do: nil
  defp format_iso8601(%DateTime{} = dt), do: DateTime.to_iso8601(dt)
  defp format_iso8601(_), do: nil
end
