defmodule MonoPhoenixV01Web.SearchbarLive do
  use MonoPhoenixV01Web, :live_view

  alias Phoenix.LiveView.JS
  alias MonoPhoenixV01.Monologues

  def mount(_params, _session, socket) do
    socket = assign(socket, monologues: [])
    {:ok, socket, layout: false}
  end

  def handle_event("change", %{"search" => %{"query" => ""}}, socket) do
    socket = assign(socket, :monologues, [])
    {:noreply, socket}
  end

  def handle_event("change", %{"search" => %{"query" => search_query}}, socket) do
    monologues = Monologues.search(search_query)
    socket = assign(socket, :monologues, monologues)

    {:noreply, socket}
  end

  def open_modal(js \\ %JS{}) do
    js
    |> JS.show(
      to: "#searchbox_container",
      transition:
        {"tw-transition tw-ease-out tw-duration-200", "tw-opacity-0 tw-scale-95",
         "tw-opacity-100 tw-scale-100"}
    )
    |> JS.show(
      to: "#searchbar-dialog",
      transition: {"tw-transition tw-ease-in tw-duration-100", "tw-opacity-0", "tw-opacity-100"}
    )
    |> JS.focus(to: "#search-input")
  end

  def hide_modal(js \\ %JS{}) do
    js
    |> JS.hide(
      to: "#searchbar-searchbox_container",
      transition:
        {"tw-transition tw-ease-in tw-duration-100", "tw-opacity-100 tw-scale-100",
         "tw-opacity-0 tw-scale-95"}
    )
    |> JS.hide(
      to: "#searchbar-dialog",
      transition: {"tw-transition tw-ease-in tw-duration-100", "tw-opacity-100", "tw-opacity-0"}
    )
  end
end