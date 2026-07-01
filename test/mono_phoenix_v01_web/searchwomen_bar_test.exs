defmodule MonoPhoenixV01Web.SearchwomenBarTest do
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01Web.SearchwomenBar

  setup do
    gender_fixtures()
    play_fixture(%{id: 1, title: "Verona"})

    men = monologue_fixture(%{id: 1, play_id: 1, gender_id: 3, character: "Romeo", body: "a speech"})
    women = monologue_fixture(%{id: 2, play_id: 1, gender_id: 2, character: "Juliet", body: "a speech"})
    both = monologue_fixture(%{id: 3, play_id: 1, gender_id: 1, character: "Chorus", body: "a speech"})

    %{men: men, women: women, both: both}
  end

  test "includes Women monologues", %{women: women} do
    assert [%{monologues: id}] = SearchwomenBar.get_all("Juliet")
    assert id == women.id
  end

  test "includes Both monologues", %{both: both} do
    assert [%{monologues: id}] = SearchwomenBar.get_all("Chorus")
    assert id == both.id
  end

  test "excludes Men monologues" do
    assert SearchwomenBar.get_all("Romeo") == []
  end
end
