defmodule MonoPhoenixV01Web.SearchByPlayTest do
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01Web.SearchByPlay

  # Both plays contain a monologue matching "ghost", so a passing scope test
  # proves the play_id filter (not just that only one play has a match).
  setup do
    play_fixture(%{id: 1, title: "Hamlet"})
    play_fixture(%{id: 2, title: "Macbeth"})

    a = monologue_fixture(%{id: 1, play_id: 1, character: "Hamlet", body: "the ghost walks"})
    b = monologue_fixture(%{id: 2, play_id: 2, character: "Macbeth", body: "the ghost walks"})

    %{a: a, b: b}
  end

  test "scopes results to the given play", %{a: a, b: b} do
    assert [%{monologues: id1}] = SearchByPlay.get_all("ghost", 1)
    assert id1 == a.id

    assert [%{monologues: id2}] = SearchByPlay.get_all("ghost", 2)
    assert id2 == b.id
  end

  test "returns [] for a blank or whitespace query" do
    assert SearchByPlay.get_all("", 1) == []
    assert SearchByPlay.get_all("   ", 1) == []
  end

  test "result rows omit play_id (play-scoped shape)" do
    [row | _] = SearchByPlay.get_all("ghost", 1)

    assert Enum.sort(Map.keys(row)) ==
             ~w(body character firstline location monologues pdf play scene style)a
  end

  # Regression: non-ASCII input used to leave a lone UTF-8 lead byte behind
  # after the byte-mode regex cleaning, crashing the query with a Postgrex
  # "invalid byte sequence for encoding UTF8" error.
  test "curly punctuation does not crash and still matches", %{a: a} do
    assert [%{monologues: id}] = SearchByPlay.get_all("ghost’", 1)
    assert id == a.id
  end

  test "supplementary-plane characters do not crash and still match", %{a: a} do
    assert [%{monologues: id}] = SearchByPlay.get_all("ghost 😀", 1)
    assert id == a.id
  end

  test "returns [] for a query that is only non-ASCII" do
    assert SearchByPlay.get_all("’😀", 1) == []
  end
end
