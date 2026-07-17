defmodule MonoPhoenixV01.Sitemap do
  @moduledoc """
  Builds `sitemap.xml` dynamically from the monologues database.

  Replaces the old hand-generated static file (which listed ~195 hub/play
  URLs, all stamped with a single stale 2023-03-30 lastmod and none of the
  745 per-monologue permalink pages). This version emits:

    * the hub pages (`/home`, `/plays`, `/mens`, `/womens`) and the static
      info pages,
    * every play page (`/play/N`, plus `/men/N` / `/women/N` where that play
      actually has monologues of that gender), and
    * all 745 `/monologues/{id}` permalink pages,

  each with a real `lastmod` derived from the monologue's `updated_at`.

  `build_entries/1` is split out from the DB query so it can be unit-tested
  with plain sample rows.
  """
  import Ecto.Query, only: [from: 2]
  alias MonoPhoenixV01.Repo

  @host "https://www.shakespeare-monologues.org"
  # Used when a row is missing updated_at, and as the site-wide floor. Matches
  # the date the previous static sitemap used, so nothing regresses to "older".
  @fallback_date ~D[2023-03-30]

  @doc "Full sitemap XML as a string."
  def to_xml, do: entries() |> render()

  @doc "Loads monologue rows and builds the ordered list of URL entries."
  def entries do
    monos =
      Repo.all(
        from(m in "monologues",
          select: %{
            id: m.id,
            play_id: m.play_id,
            gender_id: m.gender_id,
            updated_at: m.updated_at
          }
        )
      )

    build_entries(monos)
  end

  @doc """
  Builds the ordered list of `%{loc, lastmod, priority}` entries from a list of
  monologue maps (`%{id, play_id, gender_id, updated_at}`). Pure — no DB — so
  tests can pass in fixed rows.
  """
  def build_entries(monos) do
    site_max = monos |> Enum.map(&to_date(&1.updated_at)) |> max_date()

    hub =
      for {path, priority} <- [
            {"/home", "1.0"},
            {"/plays", "0.8"},
            {"/mens", "0.8"},
            {"/womens", "0.8"}
          ] do
        %{loc: @host <> path, lastmod: site_max, priority: priority}
      end

    info =
      for path <- ["/faq", "/aboutus", "/links", "/privacy", "/tos"] do
        %{loc: @host <> path, lastmod: site_max, priority: "0.3"}
      end

    play_entries =
      monos
      |> Enum.reject(&is_nil(&1.play_id))
      |> Enum.group_by(& &1.play_id)
      |> Enum.sort_by(fn {play_id, _} -> play_id end)
      |> Enum.flat_map(fn {play_id, ms} ->
        pmax = ms |> Enum.map(&to_date(&1.updated_at)) |> max_date()
        has_men = Enum.any?(ms, &(&1.gender_id in [1, 3]))
        has_women = Enum.any?(ms, &(&1.gender_id in [1, 2]))

        [{"/play/#{play_id}", true}, {"/men/#{play_id}", has_men}, {"/women/#{play_id}", has_women}]
        |> Enum.filter(fn {_path, include?} -> include? end)
        |> Enum.map(fn {path, _} -> %{loc: @host <> path, lastmod: pmax, priority: "0.7"} end)
      end)

    mono_entries =
      monos
      |> Enum.sort_by(& &1.id)
      |> Enum.map(fn m ->
        %{loc: "#{@host}/monologues/#{m.id}", lastmod: to_date(m.updated_at), priority: "0.6"}
      end)

    hub ++ info ++ play_entries ++ mono_entries
  end

  @doc "Renders a list of entries to sitemap XML."
  def render(entries) do
    body =
      Enum.map_join(entries, "\n", fn e ->
        """
          <url>
            <loc>#{e.loc}</loc>
            <lastmod>#{Date.to_iso8601(e.lastmod)}</lastmod>
            <priority>#{e.priority}</priority>
          </url>\
        """
      end)

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    #{body}
    </urlset>
    """
  end

  defp to_date(nil), do: @fallback_date
  defp to_date(%NaiveDateTime{} = dt), do: NaiveDateTime.to_date(dt)
  defp to_date(%DateTime{} = dt), do: DateTime.to_date(dt)
  defp to_date(%Date{} = d), do: d

  defp max_date([]), do: @fallback_date
  defp max_date(dates), do: Enum.max([@fallback_date | dates], Date)
end
