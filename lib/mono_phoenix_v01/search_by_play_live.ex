defmodule MonoPhoenixV01Web.SearchByPlayLive do
  use MonoPhoenixV01Web, :live_view

  @impl true
  def mount(:not_mounted_at_router, %{"play_id" => play_id}, socket) do
    search_results = MonoPhoenixV01Web.SearchByPlay.get_all("", play_id)
    {:ok, assign(socket, play_id: play_id, search_results: search_results)}
  end

  @impl true
  def mount(%{"play_id" => play_id}, _session, socket) do
    # Assign a default play_id of 9 if it's nil
    play_id = if is_nil(play_id), do: 9, else: play_id
    search_results = MonoPhoenixV01Web.SearchByPlay.get_all("", play_id)

    {:ok, assign(socket, play_id: play_id, search_results: search_results)}
  end

  ## socket

  @impl true
  def handle_event("search", %{"search" => %{"query" => search_query}}, socket) do
    play_id = socket.assigns.play_id

    search_results =
      if search_query == "" do
        []
      else
        MonoPhoenixV01Web.SearchByPlay.get_all(search_query, play_id)
      end

    {:noreply,
     assign(socket, search_results: if(length(search_results) > 0, do: search_results, else: nil))}
  end

  ## render assigns

  @impl true
  def render(assigns) do
    ~L"""

      <%= render_search_form(assigns) %> <%# added %>
      <%= render_search_by_play(assigns) %>
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
  def render_search_by_play(assigns) do
    ~L"""
    <div class="center-this monologue-list">
      <table class="monologue-list">
        <tbody>
        <%= if !is_nil(@search_results) do %>
          <%= if length(@search_results) > 0 do %>
            <!-- begin results heading, text, and body toggle -->
            <h3>Search results</h3>
            <span style="font-size:11px">
            Click on the 1st line, under the character's name, to see the full monologue. <a
              href="#"
              data-toggle="collapse"
              data-target=".multi-collapse"
              id="toggle-button"
            ><img
                src="/images/ExpandAll.png"
                id="toggle-image"
                alt="Click to toggle text of all monologues on the page.
            Reload the page to reset the toggle"
                title="Click to toggle the text of all monologues on the page.
            Reload the page to reset the toggle."
              /></a>
            </span>
            <!-- end results heading, text, and body toggle -->
          <% end %>
          <%= for {row, index} <- Enum.with_index(@search_results) do %>

          <!-- Render each search result here -->
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
          <% end %>
        </tbody>
      </table>
    </div>
    <script>
    const toggleButton = document.getElementById('toggle-button');
    const toggleImage = document.getElementById('toggle-image');

    toggleButton.addEventListener('click', () => {
      toggleImage.classList.toggle('collapsed');
    });
    </script>

    <style>
    #toggle-image.collapsed {
      content: url('/images/CollapseAll.png');
    }

    #toggle-image {
      content: url('/images/ExpandAll.png');
    }
    </style>
    """
  end
end
