defmodule MonoPhoenixV01Web.LayoutView do
  use MonoPhoenixV01Web, :view

  # Phoenix LiveDashboard is available only in development by default,
  # so we instruct Elixir to not warn if the dashboard route is missing.
  @compile {:no_warn_undefined, {Routes, :live_dashboard_path, 2}}

  @doc """
  Returns `{men_href, women_href}` for the section toggle in the site nav.

  On a men's or women's play page the two sections share the play id, so the
  toggle carries it (`/men/:id` ↔ `/women/:id`) — a reader on `/women/21` who
  clicks "Men" lands on `/men/21` (the same play) instead of the bare `/mens`
  index and having to find their play again. Every other page falls back to
  the section landing pages.
  """
  def section_nav_targets(assigns) do
    case {assigns[:live_action], assigns[:play_id]} do
      {action, play_id} when action in [:menplay, :womenplay] and is_integer(play_id) ->
        {"/men/#{play_id}", "/women/#{play_id}"}

      _ ->
        {"/mens", "/womens"}
    end
  end

  # Fetch the dark mode class based on the cookie value
  def fetch_dark_mode_class(conn) do
    # Access the "dark_mode" cookie value from the conn's :cookies field
    dark_mode_cookie = conn.cookies["darkModePreference"]

    # Check if the "dark_mode" cookie value is "true" and set the class accordingly
    if dark_mode_cookie == "true" do
      "dark-mode"
    else
      ""
    end
  end
end
