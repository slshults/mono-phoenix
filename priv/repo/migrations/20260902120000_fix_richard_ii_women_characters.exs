defmodule MonoPhoenixV01.Repo.Migrations.FixRichardIiWomenCharacters do
  use Ecto.Migration

  # Both women's monologues on the Richard II page (play_id 27) carried the wrong
  # character name.
  #
  #   * Act 1 scene 2, "Finds brotherhood in thee no sharper spur?" is the Duchess
  #     of Gloucester, not Constance (a role that speaks only in King John).
  #   * Act 2 scene 2, "Yet one word more. Grief boundeth where it falls" is the
  #     Queen, not the Duchess.
  #
  # Each row is matched by its play and its wrong character, which is unique inside
  # Richard II, so the change reverses cleanly.
  def change do
    execute(
      "UPDATE monologues SET character = 'Duchess of Gloucester' " <>
        "WHERE play_id = (SELECT id FROM plays WHERE title = 'Richard II') " <>
        "AND character = 'Constance'",
      "UPDATE monologues SET character = 'Constance' " <>
        "WHERE play_id = (SELECT id FROM plays WHERE title = 'Richard II') " <>
        "AND character = 'Duchess of Gloucester'"
    )

    execute(
      "UPDATE monologues SET character = 'Queen' " <>
        "WHERE play_id = (SELECT id FROM plays WHERE title = 'Richard II') " <>
        "AND character = 'Duchess'",
      "UPDATE monologues SET character = 'Duchess' " <>
        "WHERE play_id = (SELECT id FROM plays WHERE title = 'Richard II') " <>
        "AND character = 'Queen'"
    )
  end
end
