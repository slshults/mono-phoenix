defmodule MonoPhoenixV01Web.SearchBarLive.Index do
  use MonoPhoenixV01Web, :live_view
  alias MonoPhoenixV01Web.SearchBar

  ## socket assigns
  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    query = params |> Map.get("query")

    {:noreply, socket |> load_search_bar(query)}
  end

  def load_search_bar(socket, query) do
    socket
    |> assign(:query, query)
    |> assign(:search_bar, SearchBar.get_all(query))
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~L"""
      <h3>Search results</h3>
      <%= render_search_form(assigns) %> <%# added %>
      <%= render_search_bar(assigns) %>
    """
  end

  ## render the search form
  def render_search_form(assigns) do
    ~L"""
    <%= form_for :search, "#", [phx_submit: "search", phx_change: "search", id: "searchbar"], fn f -> %>
      <%= label f, :search %>
      <%= text_input f, :query, value: @query %>
      <%= submit "Search" %>
    <% end %>
    """
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    {:noreply, push_patch(socket, to: Routes.search_bar_path(socket, :index, query: query))}
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