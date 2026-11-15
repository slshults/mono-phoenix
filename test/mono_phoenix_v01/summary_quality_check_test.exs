defmodule MonoPhoenixV01.SummaryQualityCheckTest do
  # Server-side PostHog capture is disabled under MIX_ENV=test (see
  # MonoPhoenixV01.PostHog), so perform/1 here never reaches the live project.
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01.SummaryQualityCheck

  @good "Original: Now is the winter of our discontent\nModern: Things are bad right now"

  defp cache(identifier, content, content_type \\ "paraphrasing") do
    {1, [%{id: id}]} =
      Repo.insert_all(
        "summaries",
        [%{content_type: content_type, identifier: identifier, content: content}],
        returning: [:id]
      )

    id
  end

  describe "check/0" do
    test "passes when the summaries table is empty" do
      assert %{status: "pass", bad_count: 0, bad_rows: []} = SummaryQualityCheck.check()
    end

    test "passes when every cached row is real content" do
      cache("mono_1", @good)
      cache("Hamlet", "Hamlet comes home to find his father dead.", "play_summary")

      assert %{status: "pass", bad_count: 0, bad_rows: []} = SummaryQualityCheck.check()
    end

    test "fails on a chatbot opening and reports only id, content_type and identifier" do
      cache("mono_1", @good)
      bad_id = cache("mono_2", "I'd be happy to help you paraphrase this monologue! Here...")

      assert %{status: "fail", bad_count: 1, bad_rows: [row]} = SummaryQualityCheck.check()
      assert row == %{id: bad_id, content_type: "paraphrasing", identifier: "mono_2"}
    end

    test "only matches chatbot openings in the first 100 characters" do
      cache("mono_1", String.duplicate("a", 120) <> " I apologize for the confusion")

      assert %{status: "pass"} = SummaryQualityCheck.check()
    end

    test "matches the always-bad patterns anywhere in the content" do
      bad_id = cache("mono_1", String.duplicate("a", 500) <> " As an AI language model...")

      assert %{status: "fail", bad_count: 1, bad_rows: [%{id: ^bad_id}]} =
               SummaryQualityCheck.check()
    end

    test "caps bad_rows at 20 but counts every bad row, in id order" do
      ids = for n <- 1..25, do: cache("mono_#{n}", "I apologize, but I cannot do that.")

      assert %{status: "fail", bad_count: 25, bad_rows: rows} = SummaryQualityCheck.check()
      assert Enum.map(rows, & &1.id) == Enum.take(ids, 20)
    end

    test "never includes the content text in the event properties" do
      cache("mono_1", "I'd be happy to help with that SECRET-MARKER text")

      refute inspect(SummaryQualityCheck.check()) =~ "SECRET-MARKER"
    end
  end

  describe "error_properties/1" do
    test "reports a query error with its SQLSTATE and message" do
      error = %Postgrex.Error{
        postgres: %{code: :undefined_table, message: "relation \"summaries\" does not exist"}
      }

      assert %{status: "error", bad_count: nil, bad_rows: [], error: message} =
               SummaryQualityCheck.error_properties(error)

      assert message == "postgres undefined_table: relation \"summaries\" does not exist"
    end

    test "reduces any other exception to its name" do
      error = %RuntimeError{message: "connection details that must not leave the app"}

      assert %{status: "error", error: "RuntimeError"} =
               SummaryQualityCheck.error_properties(error)
    end
  end

  describe "perform/1" do
    test "returns :ok when the check runs, whether it passes or fails" do
      assert :ok = SummaryQualityCheck.perform(%Oban.Job{})

      cache("mono_1", "I'm unable to access that text.")
      assert :ok = SummaryQualityCheck.perform(%Oban.Job{})
    end
  end
end
