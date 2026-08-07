defmodule MonoPhoenixV01Web.HtmlSanitizer do
  @moduledoc """
  Server-side sanitization for stored HTML that gets rendered through `raw/1`.

  Monologue bodies (and the scene/pdf link URLs beside them) are authored HTML
  stored in the DB and injected verbatim via `raw/1`. When a body contains a
  malformed or unterminated tag, the browser keeps tokenizing into the static
  markup that follows it and parses trailing prose as attribute names. That
  produced an invalid attribute name (e.g. `know<`) which morphdom then tried to
  copy with `setAttribute`, throwing `InvalidCharacterError` on iOS Safari and
  aborting the rest of the LiveView patch — leaving nested search results stale
  for the session.

  Neutralising any `<` that does not open one of a small allow-list of simple
  formatting tags keeps one bad row from breaking the DOM patch, while leaving
  the legitimate `<b>`/`<i>`/`<em>`/`<strong>`/`<br>`/`<p>` markup used in the
  monologues intact. Done in one helper so every `raw/1` call site is covered.
  """

  # Tags that legitimately appear in monologue bodies. A `<` is only left alone
  # when it opens/closes one of these; every other `<` is escaped to `&lt;` so
  # it renders as literal text instead of starting a (possibly broken) tag.
  @stray_lt ~r{<(?!/?(?:b|i|em|strong|br|p)\b[^<>]*>)}i

  @doc """
  Escapes stray `<` characters that do not open a valid allow-listed tag.

  Well-formed formatting markup is preserved; `nil` becomes an empty string.
  """
  @spec sanitize_body(binary() | nil) :: binary()
  def sanitize_body(nil), do: ""

  def sanitize_body(body) when is_binary(body) do
    Regex.replace(@stray_lt, body, "&lt;")
  end

  def sanitize_body(other), do: other |> to_string() |> sanitize_body()
end
