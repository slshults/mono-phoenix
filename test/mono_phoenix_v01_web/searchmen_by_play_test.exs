defmodule MonoPhoenixV01Web.SearchmenByPlayTest do
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01Web.SearchmenByPlay

  # play 1 has a Men and a Women monologue (both match "ghost"); play 2 has a
  # Men monologue. Exercises the gender filter and the play_id filter together.
  setup do
    gender_fixtures()
    play_fixture(%{id: 1, title: "Hamlet"})
    play_fixture(%{id: 2, title: "Macbeth"})

    men_p1 = monologue_fixture(%{id: 1, play_id: 1, gender_id: 3, character: "Aaa", body: "the ghost walks"})
    _women_p1 = monologue_fixture(%{id: 2, play_id: 1, gender_id: 2, character: "Bbb", body: "the ghost walks"})
    men_p2 = monologue_fixture(%{id: 3, play_id: 2, gender_id: 3, character: "Ccc", body: "the ghost walks"})

    %{men_p1: men_p1, men_p2: men_p2}
  end

  test "returns only Men/Both monologues in the given play", %{men_p1: men_p1} do
    results = SearchmenByPlay.get_all("ghost", 1)
    assert [%{monologues: id}] = results
    assert id == men_p1.id
  end

  test "excludes monologues from other plays", %{men_p2: men_p2} do
    assert [%{monologues: id}] = SearchmenByPlay.get_all("ghost", 2)
    assert id == men_p2.id
  end

  test "returns [] for a blank query" do
    assert SearchmenByPlay.get_all("", 1) == []
  end
end
