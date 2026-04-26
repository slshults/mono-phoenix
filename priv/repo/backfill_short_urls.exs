# Backfill monologue short URLs from the legacy MOTD CSV archive.
#
# Usage:
#   mix run priv/repo/backfill_short_urls.exs path/to/monologue-of-the-day.csv
#
# The CSV is a one-quoted-string-per-row archive of prior "Monologue of the Day"
# posts. Each row contains a line like "Read it here: https://MonosBy.WS/<code>"
# where <code> is of the form "<character_slug><monologue_id>", e.g. "rich568".
# The trailing integer is the monologue primary key.

alias MonoPhoenixV01.Repo

[csv_path | _] = System.argv() |> Enum.filter(&(!String.starts_with?(&1, "-")))

unless File.exists?(csv_path) do
  IO.puts(:stderr, "CSV not found: #{csv_path}")
  System.halt(1)
end

short_url_regex = ~r/MonosBy\.WS\/([A-Za-z0-9]+)/i
trailing_id_regex = ~r/(\d+)$/

extractions =
  csv_path
  |> File.stream!()
  |> Stream.flat_map(fn line ->
    case Regex.run(short_url_regex, line, capture: :all_but_first) do
      [code] ->
        case Regex.run(trailing_id_regex, code, capture: :all_but_first) do
          [id_str] ->
            case Integer.parse(id_str) do
              {id, ""} -> [{id, "https://monosby.ws/" <> code}]
              _ -> []
            end

          _ ->
            []
        end

      _ ->
        []
    end
  end)
  |> Enum.to_list()
  |> Enum.uniq_by(fn {id, _url} -> id end)

IO.puts("Parsed #{length(extractions)} unique (monologue_id, short_url) pairs from CSV.")

{updated, missing, skipped} =
  Enum.reduce(extractions, {0, [], 0}, fn {id, url}, {u, m, s} ->
    query = "UPDATE monologues SET short_url = $1 WHERE id = $2 AND short_url IS NULL"

    case Ecto.Adapters.SQL.query!(Repo, query, [url, id]) do
      %{num_rows: 1} ->
        {u + 1, m, s}

      %{num_rows: 0} ->
        # Either the row doesn't exist, or it already has a short_url.
        case Ecto.Adapters.SQL.query!(
               Repo,
               "SELECT short_url FROM monologues WHERE id = $1",
               [id]
             ) do
          %{rows: []} -> {u, [id | m], s}
          %{rows: [[_existing]]} -> {u, m, s + 1}
        end
    end
  end)

IO.puts("")
IO.puts("=== Backfill summary ===")
IO.puts("Updated:  #{updated}")
IO.puts("Skipped (already had short_url): #{skipped}")
IO.puts("Missing monologue rows: #{length(missing)}")

if missing != [] do
  IO.puts("Missing ids: #{Enum.sort(missing) |> Enum.join(", ")}")
end
