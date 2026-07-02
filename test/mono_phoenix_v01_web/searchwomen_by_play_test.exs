defmodule MonoPhoenixV01Web.SearchwomenByPlayTest do
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01Web.SearchwomenByPlay

  setup do
    gender_fixtures()
    play_fixture(%{id: 1, title: "Hamlet"})
    play_fixture(%{id: 2, title: "Macbeth"})

    women_p1 = monologue_fixture(%{id: 1, play_id: 1, gender_id: 2, character: "Aaa", body: "the ghost walks"})
    _men_p1 = monologue_fixture(%{id: 2, play_id: 1, gender_id: 3, character: "Bbb", body: "the ghost walks"})
    women_p2 = monologue_fixture(%{id: 3, play_id: 2, gender_id: 2, character: "Ccc", body: "the ghost walks"})

    %{women_p1: women_p1, women_p2: women_p2}
  end

  test "returns only Women/Both monologues in the given play", %{women_p1: women_p1} do
    assert [%{monologues: id}] = SearchwomenByPlay.get_all("ghost", 1)
    assert id == women_p1.id
  end

  test "excludes monologues from other plays", %{women_p2: women_p2} do
    assert [%{monologues: id}] = SearchwomenByPlay.get_all("ghost", 2)
    assert id == women_p2.id
  end

  test "returns [] for a blank query" do
    assert SearchwomenByPlay.get_all("   ", 1) == []
  end
end
