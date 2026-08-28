defmodule MonoPhoenixV01Web.Components.SearchNoResults do
  @moduledoc """
  Empty state for a search that ran and matched nothing.

  Before this, an empty match assigned `nil` (per-play surfaces) or `[]` (the
  bar surfaces) to `search_results`, and the template guard suppressed the
  whole results block - so the page simply did not change and a reader could
  not tell a search with no matches from a page that had stopped responding.

  The scope note is hidden on `/plays`, where it would tell the reader to go
  somewhere they already are. Every other surface searches a subset (a gender,
  a play, or both), so there the note is the useful part.
  """
  use Phoenix.Component

  @doc """
  True when a search was actually submitted and matched nothing.

  Keyed on the query as well as the results, because the two families of
  search LiveView represent "no matches" differently - the per-play ones
  assign `nil`, the bar ones assign `[]` - and neither is distinguishable
  from a freshly mounted page by the results alone.
  """
  def no_results?(search_query, search_results) do
    String.trim(search_query || "") != "" and
      (is_nil(search_results) or search_results == [])
  end

  attr :show_scope_note, :boolean, default: true

  def search_no_results(assigns) do
    ~H"""
    <div class="search-no-results">
      <p>No results match your search.</p>
      <p>(Partial words are not matched, type full words.)</p>
      <p :if={@show_scope_note}>
        <strong>Note:</strong> Search only looks at the page you&#39;re on, so return to
        <a href="https://www.shakespeare-monologues.org/plays">All</a> to search the
        entire database.
      </p>
    </div>
    """
  end
end
