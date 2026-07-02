defmodule MonoPhoenixV01Web.SearchmenBarTest do
  use MonoPhoenixV01.MonologuesDataCase, async: true

  alias MonoPhoenixV01Web.SearchmenBar

  # All three monologues share one play whose title doesn't collide with the
  # character names we search for, so each query isolates a single gender.
  setup do
    gender_fixtures()
    play_fixture(%{id: 1, title: "Verona"})

    men = monologue_fixture(%{id: 1, play_id: 1, gender_id: 3, character: "Romeo", body: "a speech"})
    women = monologue_fixture(%{id: 2, play_id: 1, gender_id: 2, character: "Juliet", body: "a speech"})
    both = monologue_fixture(%{id: 3, play_id: 1, gender_id: 1, character: "Chorus", body: "a speech"})

    %{men: men, women: women, both: both}
  end

  test "includes Men monologues", %{men: men} do
    assert [%{monologues: id}] = SearchmenBar.get_all("Romeo")
    assert id == men.id
  end

  test "includes Both monologues", %{both: both} do
    assert [%{monologues: id}] = SearchmenBar.get_all("Chorus")
    assert id == both.id
  end

  test "excludes Women monologues" do
    assert SearchmenBar.get_all("Juliet") == []
  end
end
