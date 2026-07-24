defmodule MonoPhoenixV01Web.SearchBarTest do
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01Web.SearchBar

  describe "get_all/1" do
    setup do
      play_fixture(%{id: 1, title: "Hamlet"})
      play_fixture(%{id: 2, title: "Macbeth"})

      hamlet =
        monologue_fixture(%{
          id: 1,
          play_id: 1,
          character: "Hamlet",
          location: "Act III, Scene 1",
          first_line: "To be or not to be",
          body: "To be, or not to be, that is the question.",
          style: "tragedy",
          body_link: "/scene/hamlet-3-1",
          pdf_link: "/pdf/hamlet.pdf"
        })

      macbeth =
        monologue_fixture(%{
          id: 2,
          play_id: 2,
          character: "Macbeth",
          location: "Act V, Scene 5",
          first_line: "Tomorrow and tomorrow and tomorrow",
          body: "Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace.",
          style: "tragedy",
          body_link: "/scene/macbeth-5-5",
          pdf_link: "/pdf/macbeth.pdf"
        })

      %{hamlet: hamlet, macbeth: macbeth}
    end

    test "single-word query matches on character / play title (ranked tier)" do
      results = SearchBar.get_all("Macbeth")
      assert [%{character: "Macbeth", monologues: 2, play: "Macbeth"}] = results
    end

    test "matches on play title" do
      results = SearchBar.get_all("Hamlet")
      assert Enum.any?(results, &(&1.play == "Hamlet" and &1.monologues == 1))
    end

    test "multi-word query matches an exact phrase in the body (phrase tier)" do
      assert [%{monologues: 2}] = SearchBar.get_all("petty pace")
    end

    test "is case-insensitive" do
      refute SearchBar.get_all("macbeth") == []
      refute SearchBar.get_all("MACBETH") == []
    end

    test "ignores punctuation in the query" do
      refute SearchBar.get_all("Macbeth!?!") == []
    end

    test "returns [] when nothing matches" do
      assert SearchBar.get_all("zzzznomatchhere") == []
    end

    test "result rows carry the expected fields" do
      [row | _] = SearchBar.get_all("Macbeth")

      assert Enum.sort(Map.keys(row)) ==
               ~w(body character firstline location monologues pdf play play_id scene style)a
    end

    # Regression: non-ASCII input used to leave a lone UTF-8 lead byte behind
    # after the byte-mode regex cleaning, crashing the query with a Postgrex
    # "invalid byte sequence for encoding UTF8" error.
    test "curly punctuation does not crash and still matches" do
      assert [%{monologues: 2}] = SearchBar.get_all("Macbeth’")
    end

    test "supplementary-plane characters do not crash and still match" do
      assert [%{monologues: 2}] = SearchBar.get_all("Macbeth 😀")
    end

    test "returns [] for a query that is only non-ASCII" do
      assert SearchBar.get_all("’😀") == []
    end
  end
end
