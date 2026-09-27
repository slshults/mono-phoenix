defmodule MonoPhoenixV01Web.SearchSummaryAnalyticsTest do
  # The six search LiveViews each host a summary modal and send PostHog events
  # for it. Every request here is a cache hit on the summaries rows seeded
  # below, and Tesla.Mock (test_helper.exs) rules out a real Anthropic call.
  #
  # NOT async: the LiveView process needs the shared monologues-repo sandbox.
  use MonoPhoenixV01Web.ConnCase

  import Ecto.Query, only: [from: 2]
  import Phoenix.LiveViewTest
  import MonoPhoenixV01.MonologuesFixtures

  alias Ecto.Adapters.SQL.Sandbox
  alias MonoPhoenixV01.Repo

  alias MonoPhoenixV01Web.{
    SearchBarLive,
    SearchByPlayLive,
    SearchmenBarLive,
    SearchmenByPlayLive,
    SearchwomenBarLive,
    SearchwomenByPlayLive
  }

  @bars [SearchBarLive, SearchmenBarLive, SearchwomenBarLive]
  @by_play [SearchByPlayLive, SearchmenByPlayLive, SearchwomenByPlayLive]

  setup tags do
    pid = Sandbox.start_owner!(Repo, shared: not tags[:async])
    on_exit(fn -> Sandbox.stop_owner(pid) end)
    :ok
  end

  setup do
    gender_fixtures()
    play_fixture(%{id: 1, title: "Hamlet"})

    # Gender "Both", so the men's and women's searches find it too.
    monologue_fixture(%{
      id: 1,
      play_id: 1,
      gender_id: 1,
      character: "Ghost",
      location: "I v 9",
      first_line: "I am thy father's spirit",
      body: "Doomed for a certain term to walk the night",
      body_link: "/scene/hamlet-1-5",
      pdf_link: "/pdf/hamlet.pdf"
    })

    {3, rows} =
      Repo.insert_all(
        "summaries",
        [
          %{content_type: "paraphrasing", identifier: "mono_1", content: "Original: x\nModern: y"},
          %{content_type: "play_summary", identifier: "Hamlet", content: "A play summary"},
          %{content_type: "scene_summary", identifier: "Hamlet-I v 9", content: "A scene summary"}
        ],
        returning: [:id, :content_type]
      )

    %{summary_ids: Map.new(rows, &{&1.content_type, &1.id})}
  end

  defp mount_with_results(conn, module) do
    session = if module in @by_play, do: %{"play_id" => 1}, else: %{}
    {:ok, lv, _html} = live_isolated(conn, module, session: session)
    lv |> element("form[phx-submit='search']") |> render_submit(%{"search" => %{"query" => "Ghost"}})
    lv
  end

  for module <- @bars ++ @by_play do
    describe inspect(module) do
      @module module

      test "paraphrase events carry the play, character, location and cache source", %{conn: conn, summary_ids: ids} do
        lv = mount_with_results(conn, @module)

        lv |> element("span[phx-click='show_paraphrasing']") |> render_click()

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated", properties: generated})

        assert %{
                 monologue_id: "1",
                 play_title: "Hamlet",
                 character_name: "Ghost",
                 location: "I v 9",
                 first_line: "Doomed for a certain term to walk the night"
               } = generated

        render_async(lv)

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_displayed", properties: displayed})

        assert %{play_title: "Hamlet", character_name: "Ghost", location: "I v 9", source: "db"} = displayed
        assert displayed.record_id == ids["paraphrasing"]

        # The first refute waits out the window; the second needn't wait again.
        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_displayed"}, 0)
      end

      test "scene summary events carry the play, location and cache source", %{conn: conn, summary_ids: ids} do
        lv = mount_with_results(conn, @module)

        lv |> element("span[phx-click='show_scene_summary']") |> render_click()

        assert_push_event(lv, "posthog_capture", %{
          event: "scene_summary_generated",
          properties: %{play_title: "Hamlet", location: "I v 9"}
        })

        render_async(lv)

        assert_push_event(lv, "posthog_capture", %{event: "scene_summary_displayed", properties: displayed})
        assert %{play_title: "Hamlet", location: "I v 9", source: "db"} = displayed
        assert displayed.record_id == ids["scene_summary"]

        refute_push_event(lv, "posthog_capture", %{event: "scene_summary_generated"})
        refute_push_event(lv, "posthog_capture", %{event: "scene_summary_displayed"}, 0)
      end

      test "play summary events carry the play and cache source", %{conn: conn, summary_ids: ids} do
        lv = mount_with_results(conn, @module)

        lv |> element("span[phx-click='show_play_summary']") |> render_click()

        assert_push_event(lv, "posthog_capture", %{event: "play_summary_generated", properties: %{play_title: "Hamlet"}})

        render_async(lv)

        assert_push_event(lv, "posthog_capture", %{event: "play_summary_displayed", properties: displayed})
        assert %{play_title: "Hamlet", source: "db"} = displayed
        assert displayed.record_id == ids["play_summary"]

        refute_push_event(lv, "posthog_capture", %{event: "play_summary_generated"})
        refute_push_event(lv, "posthog_capture", %{event: "play_summary_displayed"}, 0)
      end

      # Retry re-sends the params the modal stored from the click, so this checks
      # that the host handed the modal everything its analytics read.
      test "a Retry from the modal keeps the play, character and location", %{conn: conn} do
        lv = mount_with_results(conn, @module)

        # With no cached row and no monologue, the generation fails fast
        # ("Unknown monologue") and the modal offers Retry.
        assert {1, _} = Repo.delete_all(from s in "summaries", where: s.identifier == "mono_1")
        assert {1, _} = Repo.delete_all(from m in "monologues", where: m.id == 1)

        lv |> element("span[phx-click='show_paraphrasing']") |> render_click()
        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
        render_async(lv)

        lv |> element("#search-summary-modal .retry-button") |> render_click()

        assert_push_event(lv, "posthog_capture", %{
          event: "paraphrasing_generated",
          properties: %{play_title: "Hamlet", character_name: "Ghost", location: "I v 9"}
        })

        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
      end
    end
  end
end
