defmodule MonoPhoenixV01.MonologueMeta do
  @moduledoc """
  Builds per-monologue SEO metadata — page `<title>`, meta description,
  canonical URL, and a human-readable location — from a monologue row.

  Kept as pure functions (no DB, no conn) so the title/description templates
  can be unit-tested directly. The row is the map produced by
  `MonologuesPageController`, i.e. keys `:character`, `:firstline`, `:play`,
  `:style`, `:location`, `:monologues` (the id).
  """

  @host "https://www.shakespeare-monologues.org"

  @doc "Canonical URL for a monologue id (numeric — matches the daily social links)."
  def canonical_url(id), do: "#{@host}/monologues/#{id}"

  @doc "Approximate line count of a monologue body (counts <br> breaks)."
  def line_count(body) when is_binary(body), do: length(:binary.matches(body, "<br")) + 1
  def line_count(_), do: 0

  @doc ~S(Page <title>, e.g. `Ariel — "You are three men of sin, whom Destiny" | The Tempest`.)
  def title(%{character: character, firstline: first_line, play: play}) do
    ~s(#{character} — "#{first_line}" | #{play})
  end

  @doc "Meta description sentence for a monologue."
  def description(%{
        character: character,
        firstline: first_line,
        play: play,
        style: style,
        location: location
      }) do
    where = format_location(location)
    where_clause = if where == "", do: "", else: ", #{where}"

    "#{character}'s #{String.downcase(to_string(style))} monologue \"#{first_line}\" " <>
      "from Shakespeare's #{play}#{where_clause}. " <>
      "Read the full text, get a modern-English paraphrase, and download a printable, double-spaced PDF."
  end

  @doc ~S(Formats a stored location like `"III iii 69"` into `"Act 3, Scene 3, line 69"`. Falls back to the raw string if it can't be parsed as act/scene roman numerals.)
  def format_location(nil), do: ""

  def format_location(location) when is_binary(location) do
    case String.split(location, ~r/\s+/, trim: true) do
      [act, scene, line] ->
        with a when is_integer(a) <- roman_to_int(act),
             s when is_integer(s) <- roman_to_int(scene) do
          "Act #{a}, Scene #{s}, line #{line}"
        else
          _ -> location
        end

      [act, scene] ->
        with a when is_integer(a) <- roman_to_int(act),
             s when is_integer(s) <- roman_to_int(scene) do
          "Act #{a}, Scene #{s}"
        else
          _ -> location
        end

      _ ->
        location
    end
  end

  @doc """
  Builds the JSON-LD (schema.org) `<script>` payload for a monologue page — a
  `@graph` of a `CreativeWork` (the monologue itself, with its play, character,
  license, and source edition) and a `BreadcrumbList`. Returned as a string,
  HTML-escaped so it's safe to drop straight into a `<script type="application/ld+json">`.
  Takes the controller row (needs `:monologues`, `:id`, `:character`,
  `:firstline`, `:play`, `:style`, `:location`, `:body`).
  """
  def json_ld(row) do
    canonical = canonical_url(row.monologues)

    creative_work = %{
      "@type" => "CreativeWork",
      "@id" => canonical <> "#monologue",
      "url" => canonical,
      "name" => ~s(#{row.character}'s monologue: "#{row.firstline}"),
      "text" => plain_text(row.body),
      "inLanguage" => "en",
      "genre" => to_string(row.style),
      "author" => shakespeare(),
      "character" => %{"@type" => "Person", "name" => row.character},
      "isPartOf" => %{"@type" => "CreativeWork", "name" => row.play, "author" => shakespeare()},
      "isBasedOn" => "https://www.opensourceshakespeare.org/",
      "license" => "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      "keywords" =>
        "Shakespeare monologue, #{row.play}, #{row.character}, " <>
          "#{String.downcase(to_string(row.style))}, audition monologue, #{format_location(row.location)}"
    }

    breadcrumbs =
      breadcrumb_map([
        {"Home", "/home"},
        {row.play, "/play/#{row.id}"},
        {row.character, nil}
      ])

    Jason.encode!(
      %{"@context" => "https://schema.org", "@graph" => [creative_work, breadcrumbs]},
      escape: :html_safe
    )
  end

  @doc """
  Standalone `BreadcrumbList` JSON-LD string from a list of `{name, path}` tuples
  (path is site-relative, or nil for the current/last crumb). Used by the play
  pages, which are LiveViews and embed their own `<script type="application/ld+json">`.
  """
  def breadcrumb_json_ld(items) do
    Jason.encode!(
      Map.put(breadcrumb_map(items), "@context", "https://schema.org"),
      escape: :html_safe
    )
  end

  defp breadcrumb_map(items) do
    list =
      items
      |> Enum.with_index(1)
      |> Enum.map(fn {{name, path}, pos} ->
        base = %{"@type" => "ListItem", "position" => pos, "name" => name}
        if path, do: Map.put(base, "item", @host <> path), else: base
      end)

    %{"@type" => "BreadcrumbList", "itemListElement" => list}
  end

  defp shakespeare, do: %{"@type" => "Person", "name" => "William Shakespeare"}

  # Strips HTML tags and decodes the handful of entities that show up in the
  # stored monologue bodies, for the JSON-LD `text` field.
  defp plain_text(nil), do: ""

  defp plain_text(html) do
    html
    |> String.replace(~r/<[^>]*>/, " ")
    |> String.replace("&#39;", "'")
    |> String.replace("&quot;", "\"")
    |> String.replace("&lt;", "<")
    |> String.replace("&gt;", ">")
    |> String.replace("&nbsp;", " ")
    |> String.replace("&amp;", "&")
    |> String.replace(~r/\s+/, " ")
    |> String.trim()
  end

  @doc """
  Parses a stored location like `"III iii 69"` into `%{act, scene, line}`
  integers (each nil if it can't be parsed). For the JSON API, so agents don't
  have to decode roman numerals.
  """
  def parse_location(location) when is_binary(location) do
    case String.split(location, ~r/\s+/, trim: true) do
      [act, scene, line] -> %{act: to_int(act), scene: to_int(scene), line: to_int(line)}
      [act, scene] -> %{act: to_int(act), scene: to_int(scene), line: nil}
      _ -> %{act: nil, scene: nil, line: nil}
    end
  end

  def parse_location(_), do: %{act: nil, scene: nil, line: nil}

  # A token may be a roman numeral (act/scene) or a plain number (line).
  defp to_int(token) do
    case roman_to_int(token) do
      n when is_integer(n) ->
        n

      :error ->
        case Integer.parse(token) do
          {n, ""} -> n
          _ -> nil
        end
    end
  end

  @roman %{"i" => 1, "v" => 5, "x" => 10, "l" => 50, "c" => 100}
  defp roman_to_int(str) do
    chars = str |> String.downcase() |> String.graphemes()

    if chars != [] and Enum.all?(chars, &Map.has_key?(@roman, &1)) do
      chars |> Enum.map(&@roman[&1]) |> sum_roman()
    else
      :error
    end
  end

  # Subtractive notation: a smaller value before a larger one is subtracted
  # (iv = 4, ix = 9), otherwise added.
  defp sum_roman(values) do
    values
    |> Enum.zip(tl(values) ++ [0])
    |> Enum.reduce(0, &add_roman_pair/2)
  end

  defp add_roman_pair({v, next}, acc) when v < next, do: acc - v
  defp add_roman_pair({v, _next}, acc), do: acc + v
end
