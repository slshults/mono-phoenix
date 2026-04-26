defmodule MonoPhoenixV01.DailyMonologue.Formatter do
  @moduledoc """
  Builds the "Monologue of the Day" post text.

  Output matches the long-standing format:

      Monologue of the Day:
      <Play> | Act <A>, Sc <s>, Ln <N> | <Style>

      <Character>:  <First line>

      Read it here: <url>

      #shakespeare #monologue #acting

  Line-break pattern: one newline after line 1, two after lines 2 and 3,
  one after line 4, then hashtags on the final line.
  """

  @bluesky_limit 300
  @hashtags ["#shakespeare", "#monologue", "#acting"]
  @fallback_base_url "https://shakespeare-monologues.org/monologues/"

  @type monologue :: %{
          required(:id) => integer(),
          required(:play_title) => String.t(),
          required(:location) => String.t(),
          required(:character) => String.t(),
          required(:first_line) => String.t(),
          required(:style) => String.t(),
          optional(:short_url) => String.t() | nil
        }

  @type post :: %{
          text: String.t(),
          url: String.t(),
          hashtags: [String.t()]
        }

  @spec format(monologue()) :: post()
  def format(%{} = mono) do
    url = pick_url(mono)
    location = format_location(mono.location)
    style = format_style(mono.style)
    text = build_text(mono, location, style, url, mono.first_line)

    text =
      if String.length(text) > @bluesky_limit do
        truncate_first_line(mono, location, style, url)
      else
        text
      end

    %{text: text, url: url, hashtags: @hashtags}
  end

  defp pick_url(%{short_url: short}) when is_binary(short) and short != "", do: short
  defp pick_url(%{id: id}), do: @fallback_base_url <> Integer.to_string(id)

  # Input: "I iii 33"  ->  "Act I, Sc iii, Ln 33"
  defp format_location(location) when is_binary(location) do
    case String.split(location, ~r/\s+/, trim: true) do
      [act, scene, line] -> "Act #{act}, Sc #{scene}, Ln #{line}"
      # If the stored location doesn't follow the expected pattern, pass it through.
      _ -> location
    end
  end

  defp format_style(style) when is_binary(style) do
    style
    |> String.trim()
    |> String.downcase()
    |> :string.titlecase()
    |> to_string()
  end

  defp format_style(_), do: ""

  defp build_text(mono, location, style, url, first_line) do
    [
      "Monologue of the Day:",
      "\n",
      "#{mono.play_title} | #{location} | #{style}",
      "\n\n",
      "#{mono.character}:  #{String.trim(first_line)}",
      "\n\n",
      "Read it here: #{url}",
      "\n",
      Enum.join(@hashtags, " ")
    ]
    |> IO.iodata_to_binary()
  end

  # If the full post exceeds BlueSky's 300-grapheme limit, shave the first line
  # until it fits, ending with an ellipsis.
  defp truncate_first_line(mono, location, style, url) do
    overhead = String.length(build_text(mono, location, style, url, ""))
    budget = max(@bluesky_limit - overhead, 10)
    truncated = truncate_with_ellipsis(mono.first_line, budget)
    build_text(mono, location, style, url, truncated)
  end

  defp truncate_with_ellipsis(str, budget) do
    ellipsis = "…"

    if String.length(str) <= budget do
      str
    else
      String.slice(str, 0, max(budget - String.length(ellipsis), 1)) <> ellipsis
    end
  end
end
