defmodule MonoPhoenixV01.MonologueExtras do
  @moduledoc """
  Supplemental data for a monologue permalink page:

    * the other monologues in the same play — for a crawlable "related" mesh
      that turns the 745 island pages into a connected graph, and
    * any cached AI paraphrase / play summary / scene summary, rendered to HTML
      server-side so crawlers and LLMs can actually see this differentiating
      content (it was previously only ever generated on-demand via JS).

  The cache keys mirror what `SummaryModalComponent` writes to the `summaries`
  table: paraphrases are keyed `mono_{id}`, play summaries by the play title,
  and scene summaries by `"{play title}-{location}"`.
  """
  import Ecto.Query, only: [from: 2]
  alias MonoPhoenixV01.Repo

  @doc "Other monologues in the same play (ascending id), for related links + prev/next."
  def related_in_play(play_id, exclude_id) do
    Repo.all(
      from(m in "monologues",
        where: m.play_id == ^play_id and m.id != ^exclude_id,
        order_by: [asc: m.id],
        select: %{
          id: m.id,
          character: m.character,
          firstline: m.first_line,
          location: m.location
        }
      )
    )
  end

  @doc "Cached modern-English paraphrase HTML for a monologue, or nil."
  def paraphrase_html(monoid), do: cached("paraphrasing", "mono_#{monoid}") |> to_html()

  @doc "Cached play-summary HTML, or nil."
  def play_summary_html(play_title), do: cached("play_summary", play_title) |> to_html()

  @doc "Cached scene-summary HTML for a monologue's location, or nil."
  def scene_summary_html(play_title, location),
    do: cached("scene_summary", "#{play_title}-#{location}") |> to_html()

  @doc "Raw (markdown) cached paraphrase for a monologue id, or nil. For the JSON API."
  def paraphrase_raw(monoid), do: cached("paraphrasing", "mono_#{monoid}")

  @doc "Raw (markdown) cached play summary, or nil."
  def play_summary_raw(play_title), do: cached("play_summary", play_title)

  @doc "Raw (markdown) cached scene summary for a monologue's location, or nil."
  def scene_summary_raw(play_title, location),
    do: cached("scene_summary", "#{play_title}-#{location}")

  defp cached(content_type, identifier) do
    Repo.one(
      from(s in "summaries",
        where: s.content_type == ^content_type and s.identifier == ^identifier,
        select: s.content,
        limit: 1
      )
    )
  end

  # Renders stored markdown to HTML the same way SummaryModalComponent does, so
  # the server-rendered version matches the interactive modal.
  defp to_html(nil), do: nil

  defp to_html(content) do
    html =
      case Earmark.as_html(content) do
        {:ok, html, _} -> html
        {:error, html, _} -> html
        _ -> content
      end

    html
    |> String.replace(~r/Original:/i, "<strong>Original:</strong>")
    |> String.replace(~r/Modern:/i, "<br><strong>Modern:</strong>")
  end
end
