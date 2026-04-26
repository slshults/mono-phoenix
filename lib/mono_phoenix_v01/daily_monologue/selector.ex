defmodule MonoPhoenixV01.DailyMonologue.Selector do
  @moduledoc """
  Picks the next "Monologue of the Day".

  Strategy: random, never repeat until the pool is exhausted. Prefers monologues
  that already have a `short_url` (monosby.ws redirects). If all short-URL
  monologues have been posted, falls back to any remaining monologue (we'll use
  the full site URL for those). If every monologue has been posted, resets the
  tracking set and starts a new cycle.
  """

  alias MonoPhoenixV01.Repo

  @base_select """
  SELECT
    m.id,
    p.title AS play_title,
    m.location,
    m.character,
    m.first_line,
    m.style,
    m.short_url
  FROM monologues m
  JOIN plays p ON p.id = m.play_id
  WHERE m.id NOT IN (
    SELECT monologue_id FROM posted_monologues WHERE status = 'posted'
  )
  """

  @type result ::
          {:ok, map()}
          | {:ok, :reset_and_try_again}
          | {:error, :no_monologues_available}

  @spec pick() :: result()
  def pick do
    case fetch_row(@base_select <> " AND m.short_url IS NOT NULL ORDER BY RANDOM() LIMIT 1") do
      nil ->
        case fetch_row(@base_select <> " ORDER BY RANDOM() LIMIT 1") do
          nil -> handle_exhaustion()
          row -> {:ok, row}
        end

      row ->
        {:ok, row}
    end
  end

  defp handle_exhaustion do
    # Archive the current cycle by marking its rows with a cycle-end marker,
    # then start a new cycle. We keep the history (audit trail) but stop it
    # from blocking the next pick.
    Ecto.Adapters.SQL.query!(
      Repo,
      "UPDATE posted_monologues SET status = 'cycle_archived' WHERE status = 'posted'",
      []
    )

    case fetch_row(@base_select <> " ORDER BY RANDOM() LIMIT 1") do
      nil -> {:error, :no_monologues_available}
      row -> {:ok, row}
    end
  end

  defp fetch_row(sql) do
    %{rows: rows, columns: cols} = Ecto.Adapters.SQL.query!(Repo, sql, [])

    case rows do
      [] -> nil
      [row | _] -> row_to_map(cols, row)
    end
  end

  defp row_to_map(columns, row) do
    columns
    |> Enum.map(&String.to_atom/1)
    |> Enum.zip(row)
    |> Enum.into(%{})
  end
end
