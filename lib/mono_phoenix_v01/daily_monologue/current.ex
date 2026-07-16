defmodule MonoPhoenixV01.DailyMonologue.Current do
  @moduledoc """
  Fetches the most recently posted "Monologue of the Day" for display on the
  homepage — the newest `posted_monologues` row that actually made it onto
  social, joined to its monologue and play.

  This reads the SAME table (`posted_monologues`) the scheduler writes after
  posting to BlueSky/Facebook, so the homepage card always matches what was
  posted. We accept both `"posted"` (both networks) and `"partial"` (one
  network succeeded, the other errored) — on a partial day the monologue IS
  live on social, so it must be the one shown. `"failed"` and `"cycle_archived"`
  rows are skipped, so a failed day correctly falls back to the last real post.

  Returns a plain map (`:id`, `:character`, `:play_title`, `:location`,
  `:first_line`, `:style`) or `nil` when nothing has been posted yet, so the
  homepage can render the block conditionally.
  """

  alias MonoPhoenixV01.Repo

  @sql """
  SELECT m.id, p.title AS play_title, m.location, m.character, m.first_line, m.style
  FROM posted_monologues pm
  JOIN monologues m ON m.id = pm.monologue_id
  JOIN plays p ON p.id = m.play_id
  WHERE pm.status IN ('posted', 'partial')
  ORDER BY pm.posted_at DESC
  LIMIT 1
  """

  @spec get() :: map() | nil
  def get do
    case Ecto.Adapters.SQL.query!(Repo, @sql, []) do
      %{rows: [row | _], columns: cols} ->
        cols
        |> Enum.map(&String.to_atom/1)
        |> Enum.zip(row)
        |> Map.new()

      _ ->
        nil
    end
  end
end
