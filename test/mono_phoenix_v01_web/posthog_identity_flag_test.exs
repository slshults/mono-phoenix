defmodule MonoPhoenixV01Web.PostHogIdentityFlagTest do
  @moduledoc """
  The root layout renders `window.__phHasUser`, which the `loaded` callback in
  `posthog.init` uses to decide whether a PostHog identity is stale.

  The dangerous direction is a false `false`: that would reset a genuinely
  logged-in patron on every page load, detaching their events from their person
  profile. So the logged-in case is the one that really needs a guard, and it is
  cheap to assert both.
  """
  use MonoPhoenixV01Web.ConnCase, async: true

  import MonoPhoenixV01.AccountsFixtures

  @flag ~r/window\.__phHasUser = (true|false);/

  defp flag_in(html) do
    case Regex.run(@flag, html) do
      [_, value] -> value
      nil -> flunk("window.__phHasUser was not rendered at all")
    end
  end

  describe "window.__phHasUser" do
    test "is false for an anonymous visitor", %{conn: conn} do
      assert "false" == conn |> get(~p"/faq") |> html_response(200) |> flag_in()
    end

    test "is true for a logged-in user", %{conn: conn} do
      user = user_fixture()

      assert "true" ==
               conn |> log_in_user(user) |> get(~p"/faq") |> html_response(200) |> flag_in()
    end

    # LiveView pages reach the root layout by a different route than controllers:
    # Phoenix.LiveView.Controller.live_render merges socket assigns over
    # conn.assigns before rendering it. That is the one place current_scope could
    # plausibly diverge, so it is worth covering — and these two accounts-side
    # LiveViews do it without touching the monologues repo, so the file stays
    # async. (/plays and /monologues/:id would need a shared sandbox; they render
    # the same layout and were checked by hand against a running server.)

    test "is true for a logged-in user on a LiveView page", %{conn: conn} do
      user = user_fixture()

      assert "true" ==
               conn |> log_in_user(user) |> get(~p"/welcome") |> html_response(200) |> flag_in()
    end

    test "is false for an anonymous visitor on a LiveView page", %{conn: conn} do
      assert "false" == conn |> get(~p"/users/log-in") |> html_response(200) |> flag_in()
    end
  end
end
