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

    # Not covered here: the LiveView pages. They render the same root layout, so
    # the flag comes out identically, but asserting it would mean opening a
    # shared sandbox on the monologues repo (see search_bar_live_test.exs) and
    # dropping this file out of async mode for no extra safety. Verified by hand
    # against a running server on /plays and /monologues/:id instead.
  end
end
