defmodule MonoPhoenixV01Web.SearchBarLiveTest do
  # NOT async: the LiveView runs in its own process, separate from the test
  # process, so the monologues-repo sandbox has to be shared with it (see the
  # extra setup below), which only works outside async mode.
  #
  # (The search itself runs inline in SearchBarLive.handle_event/3 — there is
  # no separate task. It is the LiveView process, not the query, that needs
  # the shared connection.)
  use MonoPhoenixV01Web.ConnCase

  import Phoenix.LiveViewTest
  import MonoPhoenixV01.MonologuesFixtures

  # ConnCase only opens a sandbox for the Accounts repo. SearchBarLive reads
  # the monologues DB via MonoPhoenixV01.Repo, so open a shared sandbox for it
  # too — shared so the separate LiveView process can see the fixtures below.
  setup tags do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(MonoPhoenixV01.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
    :ok
  end

  setup do
    play_fixture(%{id: 1, title: "Hamlet"})

    monologue =
      monologue_fixture(%{
        id: 1,
        play_id: 1,
        character: "Ghost",
        location: "Act I, Scene 5",
        first_line: "I am thy father's spirit",
        body: "I am thy father's spirit, doomed for a certain term to walk the night.",
        style: "tragedy",
        body_link: "/scene/hamlet-1-5",
        pdf_link: "/pdf/hamlet.pdf"
      })

    %{monologue: monologue}
  end

  # End-to-end regression for the Postgrex "invalid byte sequence for encoding
  # UTF8" crash. The query-module fix has unit coverage in search_bar_test.exs,
  # but every production crash terminated in SearchBarLive.handle_event/3 — the
  # LiveView submit path itself was never exercised by a test. These drive the
  # real "search" event so a future regression in that path is caught here.
  describe "curly-punctuation search submit" do
    defp submit_search(lv, query) do
      lv
      |> element("form[phx-submit='search']")
      |> render_submit(%{"search" => %{"query" => query}})
    end

    test "a curly apostrophe still finds matches without crashing", %{conn: conn} do
      {:ok, lv, _html} = live(conn, ~p"/search_bar")

      # U+2019 RIGHT SINGLE QUOTATION MARK. Byte-mode cleaning used to strip its
      # continuation bytes and leave a lone 0xE2 lead byte, crashing the query.
      html = submit_search(lv, "Hamlet’")

      assert html =~ "Ghost"
    end

    test "the exact incident input \"wing’d\" does not crash the LiveView", %{conn: conn} do
      {:ok, lv, _html} = live(conn, ~p"/search_bar")

      # Reproduces one of the July 2026 crash inputs verbatim.
      html = submit_search(lv, "wing’d")

      assert is_binary(html)
      assert render(lv) =~ "Search for monologues"
    end

    test "a lone curly quote returns no results without crashing", %{conn: conn} do
      {:ok, lv, _html} = live(conn, ~p"/search_bar")

      html = submit_search(lv, "’")

      # Still alive and rendering — no crash, just no matches.
      assert is_binary(html)
      refute html =~ "Ghost"
    end

    test "a supplementary-plane character does not crash the LiveView", %{conn: conn} do
      {:ok, lv, _html} = live(conn, ~p"/search_bar")

      html = submit_search(lv, "Hamlet 😀")

      assert html =~ "Ghost"
    end
  end
end
