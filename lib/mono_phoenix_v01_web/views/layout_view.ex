defmodule MonoPhoenixV01Web.LayoutView do
  use MonoPhoenixV01Web, :view

  # Phoenix LiveDashboard is available only in development by default,
  # so we instruct Elixir to not warn if the dashboard route is missing.
  @compile {:no_warn_undefined, {Routes, :live_dashboard_path, 2}}

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
