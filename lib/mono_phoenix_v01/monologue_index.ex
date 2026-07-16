defmodule MonoPhoenixV01.MonologueIndex do
  @moduledoc """
  The full monologue index as plain data — the backing for the read-only JSON
  API (`/api/monologues.json`). Metadata + first line + the permalink URL for
  each of the 745 monologues; NOT the full body text (that lives on each
  monologue's page, reachable via its `url`), so this stays a discovery index
  rather than a bulk-text export.
  """
  import Ecto.Query, only: [from: 2]
  alias MonoPhoenixV01.Repo

  @host "https://www.shakespeare-monologues.org"

  @doc "All monologues as a list of API-shaped maps, ordered by play then id."
  def all do
    from(m in "monologues",
      join: p in "plays",
      on: m.play_id == p.id,
      join: g in "genders",
      on: g.id == m.gender_id,
      order_by: [asc: p.title, asc: m.id],
      select: %{
        id: m.id,
        character: m.character,
        play: p.title,
        play_type: p.classification,
        gender: g.name,
        location: m.location,
        style: m.style,
        first_line: m.first_line,
        body: m.body
      }
    )
    |> Repo.all()
    |> Enum.map(fn r ->
      loc = MonoPhoenixV01.MonologueMeta.parse_location(r.location)

      %{
        id: r.id,
        character: r.character,
        play: r.play,
        play_type: r.play_type,
        gender: r.gender,
        act: loc.act,
        scene: loc.scene,
        line: loc.line,
        location: r.location,
        style: r.style,
        first_line: r.first_line,
        line_count: MonoPhoenixV01.MonologueMeta.line_count(r.body),
        url: "#{@host}/monologues/#{r.id}"
      }
    end)
  end

  @doc """
  Full data for a single monologue by id — metadata + the full text (with line
  breaks) + the cached AI paraphrase / scene summary / play summary (each nil if
  not yet generated). `nil` if no such monologue. Backs `/api/monologues/:id.json`.
  """
  def get(id) do
    row =
      Repo.one(
        from(m in "monologues",
          join: p in "plays",
          on: m.play_id == p.id,
          join: g in "genders",
          on: g.id == m.gender_id,
          where: m.id == ^id,
          select: %{
            id: m.id,
            character: m.character,
            play: p.title,
            play_type: p.classification,
            gender: g.name,
            location: m.location,
            style: m.style,
            first_line: m.first_line,
            body: m.body,
            full_scene_url: m.body_link
          }
        )
      )

    if row, do: shape(row), else: nil
  end

  defp shape(row) do
    loc = MonoPhoenixV01.MonologueMeta.parse_location(row.location)

    %{
      id: row.id,
      character: row.character,
      play: row.play,
      play_type: row.play_type,
      gender: row.gender,
      act: loc.act,
      scene: loc.scene,
      line: loc.line,
      location: row.location,
      style: row.style,
      first_line: row.first_line,
      line_count: MonoPhoenixV01.MonologueMeta.line_count(row.body),
      text: text_with_breaks(row.body),
      url: "#{@host}/monologues/#{row.id}",
      full_scene_url: row.full_scene_url,
      paraphrase: MonoPhoenixV01.MonologueExtras.paraphrase_raw(row.id),
      scene_summary: MonoPhoenixV01.MonologueExtras.scene_summary_raw(row.play, row.location),
      play_summary: MonoPhoenixV01.MonologueExtras.play_summary_raw(row.play),
      content_note:
        "`paraphrase`, `scene_summary`, and `play_summary` are AI-generated (Claude) and may contain errors; null when not yet generated."
    }
  end

  defp text_with_breaks(nil), do: ""

  defp text_with_breaks(body) do
    body
    |> String.replace(~r/<br\s*\/?>/i, "\n")
    |> String.replace(~r/<[^>]+>/, "")
    |> String.replace("&#39;", "'")
    |> String.replace("&quot;", "\"")
    |> String.replace("&nbsp;", " ")
    |> String.replace("&amp;", "&")
    |> String.replace("\r", "")
    |> String.replace(~r/[ \t]+\n/, "\n")
    |> String.trim()
  end
end
