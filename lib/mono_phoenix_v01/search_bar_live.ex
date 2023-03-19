defmodule MonoPhoenixV01Web.SearchBarLive do
  use MonoPhoenixV01Web, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, search_bar: [])}
  end

  ## socket assigns

  @impl true
  @impl true
  def handle_event("search", %{"search" => %{"query" => search_value}}, socket) do
    send(self(), {:search, search_value})
    {:noreply, socket}
  end

  @impl Phoenix.LiveView
  def handle_info({:search, search_value}, socket) do
    push_event(socket, "search", %{search_value: search_value})
    {:noreply, socket}
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~L"""

      <%= render_search_form(assigns) %> <%# added %>
      <%= render_search_bar(assigns) %>
    """
  end

  ## render the search form
  defp render_search_form(assigns) do
    ~L"""
    <div class="input-group accent-font">
      <%= form_for :search, "#", [phx_submit: "search", phx_change: "search"], fn f -> %>
        <%= label f, :query, "" %>

        <%= text_input f, :query,
          value: Map.get(assigns, :query, ""),
          placeholder: "Search for monologues...",
          class: "navbar-form;" %>
          <%= submit "Search" %>
      <% end %>
      <h3>Search results</h3>
    </div>
    """
  end

  ## render the search results
  def render_search_bar(assigns) do
    ~L"""
    <div class="center-this">
      <table class="monologue-list">
        <tbody>
          <%= for %{row: row} <- @search_bar do %>
            <tr class="monologue_list">
              <td class="{ (index.even? ? 'even' : 'odd') }">
                <span class="monologue-playname"><%= row.play %></span>&nbsp; · <span class="monologue-actscene"><%= link to: raw(row.scene), method: :get, target: "_blank" do %><%= row.location %><% end %></span>&nbsp; ·
                <span class="monologue-actscene"><%= row.style %></span>
                <br />
                <span class="monologue-character"><%= row.character %></span>
                <br />
                <div
                  class="monologue-firstline-table"
                  data-toggle="collapse"
                  data-target={"#collapse-" <> Integer.to_string(row.monologues)}
                >
                  <%= row.firstline %>
                </div>
                <div
                  class="collapse multi-collapse monologue-show"
                  id={"collapse-" <> to_string(row.monologues)}
                >
                  <br />
                  <%= raw(row.body) %>&nbsp;
                  <%= link to: raw(row.pdf), method: :get, target: "_blank", rel: "noopener" do %>
                    <img
                      src={Routes.static_path(@conn, "/images/pdf_file_icon_16x16.png")}
                      alt="Click for a double-spaced PDF of this monologue"
                      title="Click for a double-spaced PDF of this monologue"
                    />
                  <% end %>
                </div>
              </td>
            </tr>
          <% end %>
        </tbody>
      </table>
    </div>
    """
  end
end
