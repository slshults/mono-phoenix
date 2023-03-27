defmodule MonoPhoenixV01Web.SearchmenBarLive do
  use MonoPhoenixV01Web, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, search_results: [])}
  end

  ## socket assigns

  @impl true
  def handle_event("search", %{"search" => %{"query" => search_query}}, socket) do
    search_results =
      if search_query == "" do
        []
      else
        MonoPhoenixV01Web.SearchmenBar.get_all(search_query)
      end

    {:noreply, assign(socket, search_results: search_results)}
  end

  @impl true
  def handle_info({:search, search_value}, socket) do
    # Call get_all/1 to get search results
    search_results = MonoPhoenixV01Web.SearchmenBar.get_all(search_value)

    # Update the searchmen_bar assign with the search results
    socket = assign(socket, searchmen_bar: search_results)

    push_event(socket, "search", %{search_value: search_value})
    {:noreply, socket}
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~L"""

      <%= render_search_form(assigns) %> <%# added %>
      <%= render_searchmen_bar(assigns) %>
    """
  end

  ## render the search form
  defp render_search_form(assigns) do
    ~L"""
    <div class="accent-font monologue-list" style="background-color: #F9F9DF;">
      <%= form_for :search, "#", [phx_submit: "search", phx_change: "search", phx_page_loading: :prevent], fn f -> %>
        <%= label f, :query, "" %>

        <%= text_input f, :query,
          value: Map.get(assigns, :query, ""),
          placeholder: "Search for monologues...",
          class: "input-group accent-font form-control monologue-list",
          phx_input: "search_input",
          phx_debounce: "240"
          %>
      <% end %>
    </div>
    """
  end

  ## render the search results
  def render_searchmen_bar(assigns) do
    ~L"""
    <div class="center-this monologue-list">
    <!-- hidden until I figure out how to make it display only with search results <h3>Search results</h3>
    <span font-size: 10px;>
    Click on the 1st line, under the character's name, to see the full monologue. &nbsp;<a
      href="#"
      data-toggle="collapse"
      data-target=".multi-collapse"
      id="toggle-button"
    >
    <img
        src="/images/ExpandAll.png"
        id="toggle-image"
        alt="Click to toggle text of all monologues on the page.
    Reload the page to reset the toggle"
        title="Click to toggle the text of all monologues on the page.
    Reload the page to reset the toggle."
      />
    </a>
    </span> -->
      <table class="monologue-list">
        <tbody>

        <%= for {row, index} <- Enum.with_index(@search_results) do %>

            <tr class="monologue_list">
              <td class="<%= if rem(index, 2) == 0, do: 'even', else: 'odd' %>">
                <span class="monologue-playname"><%= row.play %></span>&nbsp; &middot; <span class="monologue-actscene"><%= link to: raw(row.scene), method: :get, target: "_blank" do %><%= row.location %><% end %></span>&nbsp; &middot;
                <span class="monologue-actscene"><%= row.style %></span>
                <br />
                <span class="monologue-character"><%= row.character %></span>
                <br />
                <div
                class="monologue-firstline-table"
                data-toggle="collapse"
                data-target="#collapse-<%= Integer.to_string(index) %>"
                >
                  <%= row.firstline %>
                </div>

                <div
                class="collapse multi-collapse monologue-show"
                id="collapse-<%= Integer.to_string(index) %>"
                >
                  <br />
                  <%= raw(row.body) %>&nbsp;
                  <%= link to: raw(row.pdf), method: :get, target: "_blank", rel: "noopener" do %>
                  <img
                  src="<%= Routes.static_path(@socket, "/images/pdf_file_icon_16x16.png") %>"
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
