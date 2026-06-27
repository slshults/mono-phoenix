defmodule MonoPhoenixV01Web.FavoritesLive do
  @moduledoc """
  /favorites — patron-only page listing the monologues a user has
  favorited. Two queries on mount:

    1. Accounts DB → favorite rows (monologue_id + inserted_at).
    2. Main DB → monologue + play rows for those ids (firstline, body,
       pdf link, scene link, etc.).

  We can't JOIN across databases, so we resolve in two steps. Favorites
  whose monologue_id no longer exists on the main DB are filtered out
  (stale-row tolerance — see `Favorites` moduledoc).

  Row layout mirrors `play_page_live` so the look/feel matches the
  rest of the site: each row shows play title · location · style /
  character / first-line; clicking the first line expands the full
  monologue body. Sorting via a button bar at the top (most-recent /
  play / verse-prose / character). Heart click pops a Yes/No confirm
  modal before actually removing.
  """

  use MonoPhoenixV01Web, :live_view

  import Ecto.Query
  import MonoPhoenixV01Web.Components.HeartIcon

  alias MonoPhoenixV01.Favorites
  alias MonoPhoenixV01Web.Components.FavoriteConfirmModal
  alias MonoPhoenixV01Web.LiveFavoritesHelpers

  @allowed_sort_columns ~w(added play style character)a

  @impl true
  def mount(_params, _session, socket) do
    user_id = socket.assigns.current_scope.user.id
    rows = load_rows(user_id)

    {:ok,
     socket
     |> assign(:page_title, "Your favorites")
     |> assign(:sort_column, :added)
     |> assign(:sort_direction, :desc)
     |> assign(:rows, sort_rows(rows, :added, :desc))
     |> assign(:removing_monologue_id, nil)
     |> assign(:show_ph_widget, true)
     |> LiveFavoritesHelpers.push_posthog("favorites_page_viewed", %{
       favorite_count: length(rows)
     })}
  end

  @impl true
  def handle_event("sort", %{"column" => column_str}, socket) do
    column = parse_sort_column(column_str)

    {new_column, new_direction} =
      if column == socket.assigns.sort_column do
        {column, toggle_direction(socket.assigns.sort_direction)}
      else
        {column, default_direction(column)}
      end

    rows = sort_rows(socket.assigns.rows, new_column, new_direction)

    {:noreply,
     socket
     |> assign(:sort_column, new_column)
     |> assign(:sort_direction, new_direction)
     |> assign(:rows, rows)
     |> LiveFavoritesHelpers.push_posthog("favorites_page_sorted", %{
       column: Atom.to_string(new_column),
       direction: Atom.to_string(new_direction)
     })}
  end

  # Heart-click flow on /favorites: surface the Yes/No confirm modal
  # instead of removing immediately. The HeartIcon component renders
  # with `event="confirm_remove_favorite"` on this page so the global
  # LiveFavoritesHelpers hook's catch-all lets the event reach us.
  @impl true
  def handle_event("confirm_remove_favorite", %{"monologue-id" => mid_str}, socket) do
    case parse_monologue_id(mid_str) do
      {:ok, id} -> {:noreply, assign(socket, :removing_monologue_id, id)}
      :error -> {:noreply, socket}
    end
  end

  @impl true
  def handle_event("do_remove_favorite", %{"monologue-id" => mid_str}, socket) do
    case parse_monologue_id(mid_str) do
      :error ->
        {:noreply, assign(socket, :removing_monologue_id, nil)}

      {:ok, monologue_id} ->
        user_id = socket.assigns.current_scope.user.id

        :ok = Favorites.remove(user_id, monologue_id)

        rows = Enum.reject(socket.assigns.rows, &(&1.monologue_id == monologue_id))
        favorited_ids = MapSet.delete(socket.assigns.favorited_ids, monologue_id)

        {:noreply,
         socket
         |> assign(:rows, rows)
         |> assign(:favorited_ids, favorited_ids)
         |> assign(:removing_monologue_id, nil)
         |> LiveFavoritesHelpers.push_posthog("favorite_removed", %{
           monologue_id: monologue_id,
           source: "favorites_page"
         })}
    end
  end

  @impl true
  def handle_event("cancel_remove_favorite", _params, socket) do
    {:noreply, assign(socket, :removing_monologue_id, nil)}
  end

  defp parse_monologue_id(str) when is_binary(str) do
    case Integer.parse(str) do
      {id, ""} when id > 0 -> {:ok, id}
      _ -> :error
    end
  end

  defp parse_monologue_id(_), do: :error

  @impl true
  def render(assigns) do
    ~H"""
    <div class="favorites-page">
      <div class="center-column-header accent-font">
        <h3>Your favorites</h3>
        <p class="favorites-manage-account">
          <.link href={~p"/account"}>Manage Account</.link>
        </p>
      </div>

      <%= if @rows == [] do %>
        <div class="favorites-empty accent-font">
          <p>You haven't favorited any monologues yet.</p>
          <p>
            Browse <.link href="/plays">the plays</.link>
            and click the heart icon next to any monologue to save it here.
          </p>
        </div>
      <% else %>
        <div class="favorites-sort-bar accent-font">
          Sort by:
          <.sort_button
            column={:added}
            label="Most recent"
            current={@sort_column}
            direction={@sort_direction}
          />
          <.sort_button
            column={:play}
            label="Play"
            current={@sort_column}
            direction={@sort_direction}
          />
          <.sort_button
            column={:style}
            label="Verse/Prose"
            current={@sort_column}
            direction={@sort_direction}
          />
          <.sort_button
            column={:character}
            label="Character"
            current={@sort_column}
            direction={@sort_direction}
          />
        </div>

        <div class="center-this monologue-list">
          <table class="monologue-list">
            <tbody>
              <%= for row <- @rows do %>
                <tr class="monologue_list" data-location={row.location} data-firstline={row.firstline}>
                  <td>
                    <span
                      class="monologue-playname"
                      title="The play this monologue appears in"
                    ><%= row.play %></span> &middot; <span
                      class="monologue-actscene"
                      title={"Open the scene in a new tab"}
                    ><%= if row.scene && row.scene != "" do %><%= link to: raw(row.scene), method: :get, target: "_blank" do %><%= row.location %><% end %><% else %><%= row.location %><% end %></span> &middot;
                    <span class="monologue-actscene"><%= row.style %></span>
                    <span class="favorites-row-heart">
                      <.heart_icon
                        monologue_id={row.monologue_id}
                        filled={true}
                        auth_state={:patron}
                        event="confirm_remove_favorite"
                      />
                    </span>
                    <br />
                    <span
                      class="monologue-character"
                      title="The character who speaks this monologue"
                    >
                      <%= row.character %>
                    </span>
                    <br />
                    <div
                      class="monologue-firstline-table"
                      title="Click to hide or display the full monologue"
                      data-toggle="collapse"
                      data-target={"#fav-collapse-" <> Integer.to_string(row.monologue_id)}
                    >
                      <%= row.firstline %>&#x21b4;
                    </div>
                    <div
                      class="collapse multi-collapse monologue-show"
                      id={"fav-collapse-" <> Integer.to_string(row.monologue_id)}
                    >
                      <br />
                      <%= raw(row.body || "") %>&nbsp;
                      <%= if row.pdf && row.pdf != "" do %>
                        <%= link to: raw(row.pdf), method: :get, target: "_blank", rel: "noopener" do %>
                          <img
                            src={Routes.static_path(@socket, "/images/pdf_file_icon_16x16.png")}
                            alt="Click for a double-spaced PDF of this monologue"
                            title="Click for a double-spaced PDF of this monologue"
                            class="monologue-pdflink"
                          />
                        <% end %>
                      <% end %>
                    </div>
                  </td>
                </tr>
              <% end %>
            </tbody>
          </table>
        </div>
      <% end %>
    </div>

    <FavoriteConfirmModal.favorite_confirm_modal monologue_id={@removing_monologue_id} />
    """
  end

  defp sort_button(assigns) do
    ~H"""
    <button
      type="button"
      phx-click="sort"
      phx-value-column={@column}
      class={["favorites-sort-btn", @column == @current && "favorites-sort-btn-active"]}
    >
      {@label}<%= sort_arrow(@column, @current, @direction) %>
    </button>
    """
  end

  defp sort_arrow(column, column, :asc), do: " ↑"
  defp sort_arrow(column, column, :desc), do: " ↓"
  defp sort_arrow(_, _, _), do: ""

  defp parse_sort_column(str) do
    atom = String.to_existing_atom(str)

    if atom in @allowed_sort_columns do
      atom
    else
      :added
    end
  rescue
    ArgumentError -> :added
  end

  defp toggle_direction(:asc), do: :desc
  defp toggle_direction(:desc), do: :asc

  defp default_direction(:added), do: :desc
  defp default_direction(_), do: :asc

  defp sort_rows(rows, column, direction) do
    sorter =
      case column do
        :added -> & &1.added
        :play -> &normalize_string(&1.play)
        :style -> &normalize_string(&1.style)
        :character -> &normalize_string(&1.character)
      end

    Enum.sort_by(rows, sorter, direction)
  end

  defp normalize_string(nil), do: ""
  defp normalize_string(str) when is_binary(str), do: String.downcase(str)
  defp normalize_string(other), do: to_string(other)

  defp load_rows(user_id) do
    favorites = Favorites.list_for_user(user_id)

    case favorites do
      [] ->
        []

      _ ->
        ids = Enum.map(favorites, & &1.monologue_id)
        added_by_id = Map.new(favorites, &{&1.monologue_id, &1.inserted_at})

        monologue_rows =
          from(m in "monologues",
            join: p in "plays",
            on: m.play_id == p.id,
            where: m.id in ^ids,
            select: %{
              monologue_id: m.id,
              play: p.title,
              location: m.location,
              style: m.style,
              character: m.character,
              firstline: m.first_line,
              body: m.body,
              scene: m.body_link,
              pdf: m.pdf_link
            }
          )
          |> MonoPhoenixV01.Repo.all()

        Enum.map(monologue_rows, fn row ->
          Map.put(row, :added, Map.fetch!(added_by_id, row.monologue_id))
        end)
    end
  end
end
