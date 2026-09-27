defmodule MonoPhoenixV01Web.SummaryAnalyticsTest do
  # All twelve summary-modal hosts send their PostHog events through
  # SummaryAnalytics. Every request here is a cache hit on the summaries rows
  # seeded below (or a deliberate error), and Tesla.Mock (test_helper.exs)
  # rules out a real Anthropic call.
  #
  # NOT async: the LiveView process needs the shared monologues-repo sandbox.
  use MonoPhoenixV01Web.ConnCase

  import Ecto.Query, only: [from: 2]
  import Phoenix.LiveViewTest
  import MonoPhoenixV01.MonologuesFixtures

  alias Ecto.Adapters.SQL.Sandbox
  alias MonoPhoenixV01.Repo

  alias MonoPhoenixV01Web.{
    MenplayPageLive,
    MenplaysPageLive,
    PlayPageLive,
    PlaysPageLive,
    SearchBarLive,
    SearchByPlayLive,
    SearchmenBarLive,
    SearchmenByPlayLive,
    SearchwomenBarLive,
    SearchwomenByPlayLive,
    WomenplayPageLive,
    WomenplaysPageLive
  }

  # Hosts a reader can click in: {module, how to mount it}.
  @clickable [
    {SearchBarLive, :search},
    {SearchmenBarLive, :search},
    {SearchwomenBarLive, :search},
    {SearchByPlayLive, :search_by_play},
    {SearchmenByPlayLive, :search_by_play},
    {SearchwomenByPlayLive, :search_by_play},
    {PlayPageLive, "/play/1"},
    {MenplayPageLive, "/men/1"},
    {WomenplayPageLive, "/women/1"}
  ]

  # The listing pages host a modal but render no summary icons of their own
  # (theirs belong to the embedded search bar), so only a Retry-style message
  # can reach them.
  @listing [
    {PlaysPageLive, "/plays"},
    {MenplaysPageLive, "/mens"},
    {WomenplaysPageLive, "/womens"}
  ]

  # What every paraphrase event should say about monologue 1, all read from its
  # row. first_line is the clean column, not the start of the HTML body.
  @monologue_1 %{
    monologue_id: "1",
    play_title: "Hamlet",
    character_name: "Ghost",
    location: "I v 9",
    first_line: "I am thy father's spirit"
  }

  setup tags do
    pid = Sandbox.start_owner!(Repo, shared: not tags[:async])
    on_exit(fn -> Sandbox.stop_owner(pid) end)
    :ok
  end

  setup do
    gender_fixtures()
    play_fixture(%{id: 1, title: "Hamlet"})

    # Gender "Both", so the men's and women's pages find it too.
    monologue_fixture(%{
      id: 1,
      play_id: 1,
      gender_id: 1,
      character: "Ghost",
      location: "I v 9",
      first_line: "I am thy father's spirit",
      body: "<b>Ghost.</b> Doomed for a certain term to walk the night,<br>\nAnd for the day confined to fast in fires",
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

  # Returns the view and the CSS id of the modal it hosts.
  defp mount_host(conn, {module, :search}), do: mount_search(conn, module, %{})
  defp mount_host(conn, {module, :search_by_play}), do: mount_search(conn, module, %{"play_id" => 1})

  defp mount_host(conn, {_module, path}) do
    {:ok, lv, _html} = live(conn, path)
    {lv, "#summary-modal"}
  end

  defp mount_search(conn, module, session) do
    {:ok, lv, _html} = live_isolated(conn, module, session: session)
    lv |> element("form[phx-submit='search']") |> render_submit(%{"search" => %{"query" => "Ghost"}})
    {lv, "#search-summary-modal"}
  end

  for {module, _mount} = host <- @clickable do
    describe inspect(module) do
      @host host

      test "paraphrase events read the play, character, location and clean first line from the monologue",
           %{conn: conn, summary_ids: ids} do
        {lv, _modal} = mount_host(conn, @host)

        lv |> element("span[phx-click='show_paraphrasing']") |> render_click()

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated", properties: generated})
        assert Map.take(generated, Map.keys(@monologue_1)) == @monologue_1

        render_async(lv)

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_displayed", properties: displayed})
        assert Map.take(displayed, Map.keys(@monologue_1)) == @monologue_1
        assert %{source: "db", record_id: record_id} = displayed
        assert record_id == ids["paraphrasing"]

        # The first refute waits out the window; the second needn't wait again.
        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_displayed"}, 0)
      end

      test "scene summary events carry the play, location and cache source", %{conn: conn, summary_ids: ids} do
        {lv, _modal} = mount_host(conn, @host)

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
        {lv, _modal} = mount_host(conn, @host)

        lv |> element("span[phx-click='show_play_summary']") |> render_click()

        assert_push_event(lv, "posthog_capture", %{event: "play_summary_generated", properties: %{play_title: "Hamlet"}})

        render_async(lv)

        assert_push_event(lv, "posthog_capture", %{event: "play_summary_displayed", properties: displayed})
        assert %{play_title: "Hamlet", source: "db"} = displayed
        assert displayed.record_id == ids["play_summary"]

        refute_push_event(lv, "posthog_capture", %{event: "play_summary_generated"})
        refute_push_event(lv, "posthog_capture", %{event: "play_summary_displayed"}, 0)
      end

      test "a Retry from the modal still describes the monologue", %{conn: conn} do
        {lv, modal} = mount_host(conn, @host)

        # No cached row and no body: the generation fails fast and the modal
        # offers Retry. The monologue row stays, so the lookup still works.
        assert {1, _} = Repo.delete_all(from s in "summaries", where: s.identifier == "mono_1")
        assert {1, _} = Repo.update_all(from(m in "monologues", where: m.id == 1), set: [body: nil])

        lv |> element("span[phx-click='show_paraphrasing']") |> render_click()
        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
        render_async(lv)

        lv |> element("#{modal} .retry-button") |> render_click()

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated", properties: retried})
        assert Map.take(retried, Map.keys(@monologue_1)) == @monologue_1

        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
      end
    end
  end

  for {module, _path} = host <- @listing do
    describe inspect(module) do
      @host host

      test "a paraphrase request sends both events, described from the monologue", %{conn: conn, summary_ids: ids} do
        {lv, _modal} = mount_host(conn, @host)

        # The shape the modal's Retry sends.
        params = %{monologue_id: "1", monologue_text: "", character: "Ghost", location: nil, play_title: nil}
        send(lv.pid, {:generate_summary, "paraphrasing", params, "summary-modal", "retry:paraphrasing:1"})

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated", properties: generated})
        assert Map.take(generated, Map.keys(@monologue_1)) == @monologue_1

        render_async(lv)

        assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_displayed", properties: displayed})
        assert Map.take(displayed, Map.keys(@monologue_1)) == @monologue_1
        assert %{source: "db", record_id: record_id} = displayed
        assert record_id == ids["paraphrasing"]

        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated"})
        refute_push_event(lv, "posthog_capture", %{event: "paraphrasing_displayed"}, 0)
      end
    end
  end

  # Sends a Retry-shaped paraphrase request for `id` and returns the
  # paraphrasing_generated properties, without the timestamp.
  defp generated_for(conn, id) do
    {lv, _modal} = mount_host(conn, {SearchBarLive, :search})

    params = %{monologue_id: id, monologue_text: "", character: "x", location: nil, play_title: nil}
    send(lv.pid, {:generate_summary, "paraphrasing", params, "search-summary-modal", "retry:paraphrasing:1"})

    assert_push_event(lv, "posthog_capture", %{event: "paraphrasing_generated", properties: generated})
    render_async(lv)
    assert render(lv) =~ "Search for monologues"

    Map.delete(generated, :timestamp)
  end

  describe "a monologue id that can't be looked up" do
    for id <- ["424242", "99999999999", "abc", "-1", "1 OR 1=1"] do
      @id id

      test "#{inspect(id)} still sends the event, with only the id, and doesn't crash the page", %{conn: conn} do
        assert generated_for(conn, @id) == %{monologue_id: @id}
      end
    end
  end

  describe "a monologue id in another form AnthropicService accepts" do
    for id <- ["01", "+1"] do
      @id id

      test "#{inspect(id)} is looked up and reported as the canonical \"1\"", %{conn: conn} do
        assert generated_for(conn, @id) == @monologue_1
      end
    end
  end
end
