defmodule MonoPhoenixV01.AnthropicServiceTest do
  # The Anthropic API is replaced by Tesla.Mock for this module (see
  # test_helper.exs), so these tests can't make a real call.
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01.AnthropicService

  defp cache(content_type, identifier, content) do
    {1, _} = Repo.insert_all("summaries", [%{content_type: content_type, identifier: identifier, content: content}])
  end

  defp cached_rows, do: Repo.aggregate(from(s in "summaries"), :count)

  # An Opus 5.5 reply: thinking block(s) first, then the text.
  defp reply(stop_reason) do
    %{
      "stop_reason" => stop_reason,
      "content" => [
        %{"type" => "thinking", "thinking" => "", "signature" => "sig"},
        %{"type" => "text", "text" => "Original: Now is the winter of our discontent\nModern: Things are bad right now"}
      ],
      "usage" => %{"input_tokens" => 900, "output_tokens" => 400, "cache_creation_input_tokens" => 0, "cache_read_input_tokens" => 565}
    }
  end

  # Mocks one Anthropic call, reporting the prompt it was sent back to the test.
  defp mock_anthropic(stop_reason) do
    test = self()

    Tesla.Mock.mock(fn %{method: :post, body: body} ->
      %{"messages" => [%{"content" => prompt}]} = Jason.decode!(body)
      send(test, {:prompt, prompt})
      %Tesla.Env{status: 200, body: reply(stop_reason)}
    end)
  end

  describe "a cache miss for a real monologue" do
    setup do
      %{id: id} = monologue_fixture(%{body: "Now is the winter of our discontent"})
      %{id: id}
    end

    test "prompts with the database body, reads the text past the thinking block, and caches it", %{id: id} do
      mock_anthropic("end_turn")

      assert {:ok, %{content: "Original: Now is the winter of our discontent\nModern: Things are bad right now", source: "claude"}} =
               AnthropicService.get_monologue_paraphrasing("#{id}")

      assert_received {:prompt, prompt}
      assert prompt =~ "Now is the winter of our discontent"

      assert %{rows: [["Original: Now is" <> _]]} =
               Repo.query!("SELECT content FROM summaries WHERE content_type = 'paraphrasing' AND identifier = $1", ["mono_#{id}"])
    end

    test "doesn't cache a reply that was cut off or declined", %{id: id} do
      for stop_reason <- ["max_tokens", "refusal"] do
        mock_anthropic(stop_reason)

        assert {:error, "Incomplete response (stop_reason: " <> _} = AnthropicService.get_monologue_paraphrasing(id)
      end

      assert cached_rows() == 0
    end
  end

  describe "get_monologue_paraphrasing/1" do
    test "rejects ids that aren't positive integers" do
      for id <- ["abc", "0", "-3", "12abc", "", "3000000000", 3_000_000_000, nil, %{"id" => 1}] do
        assert {:error, "Invalid monologue id" <> _} = AnthropicService.get_monologue_paraphrasing(id)
      end

      assert cached_rows() == 0
    end

    test "rejects an id with no monologue, and caches nothing" do
      assert {:error, "Unknown monologue: " <> _} = AnthropicService.get_monologue_paraphrasing("999999999")
      assert cached_rows() == 0
    end

    test "serves the cached paraphrase under the canonical integer id" do
      %{id: id} = monologue_fixture(%{body: "They met me in the day of success"})
      cache("paraphrasing", "mono_#{id}", "Original: They met me\nModern: They found me")

      for requested <- [id, "#{id}", "0#{id}"] do
        assert {:ok, %{content: "Original: They met me\nModern: They found me", source: "db"}} =
                 AnthropicService.get_monologue_paraphrasing(requested)
      end
    end
  end

  describe "get_play_summary/1" do
    test "rejects a title that isn't a play, and caches nothing" do
      assert {:error, "Unknown play: " <> _} = AnthropicService.get_play_summary("Hamlet, Part 3")
      assert cached_rows() == 0
    end

    test "serves a cached summary for a real play" do
      %{title: title} = play_fixture(%{title: "Cymbeline"})
      cache("play_summary", title, "Imogen...")

      assert {:ok, %{content: "Imogen...", source: "db"}} = AnthropicService.get_play_summary(title)
    end
  end

  describe "get_scene_summary/2" do
    setup do
      play = play_fixture(%{title: "Hamlet"})
      monologue_fixture(%{play_id: play.id, location: "II i 234-250"})
      %{play: play}
    end

    test "rejects a crafted pair whose identifier collides with a real scene" do
      # "Hamlet-II i 234" + "250" joins to the same identifier as "Hamlet" + "II i 234-250".
      assert {:error, "Unknown scene: " <> _} = AnthropicService.get_scene_summary("Hamlet-II i 234", "250")
      assert cached_rows() == 0
    end

    test "requires the pair, not just a location that some play has" do
      %{title: other} = play_fixture(%{title: "Macbeth"})

      assert {:error, "Unknown scene: " <> _} = AnthropicService.get_scene_summary(other, "II i 234-250")
      assert cached_rows() == 0
    end

    test "rejects a location the play doesn't have" do
      assert {:error, "Unknown scene: " <> _} = AnthropicService.get_scene_summary("Hamlet", "V ii 1")
      assert cached_rows() == 0
    end

    test "serves a cached summary for a real (play, location) pair" do
      cache("scene_summary", "Hamlet-II i 234-250", "Polonius...")

      assert {:ok, %{content: "Polonius...", source: "db"}} =
               AnthropicService.get_scene_summary("Hamlet", "II i 234-250")
    end
  end
end
