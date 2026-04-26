defmodule MonoPhoenixV01.Social.BlueSky do
  @moduledoc """
  AT Protocol client for posting to BlueSky.

  Two calls per post:
    1. `com.atproto.server.createSession` with handle + app password → accessJwt + did
    2. `com.atproto.repo.createRecord` to create an `app.bsky.feed.post` record

  The URL in the post text and each hashtag are exposed as rich-text facets so
  they render as links on bsky.app.

  Config (`config/runtime.exs`):
      config :mono_phoenix_v01, :bluesky,
        handle:       System.get_env("BLUESKY_HANDLE"),
        app_password: System.get_env("BLUESKY_APP_PASSWORD")
  """

  @host "https://bsky.social"

  @type post_result ::
          {:ok, %{uri: String.t(), cid: String.t()}}
          | {:error, term()}

  @spec post(%{text: String.t(), url: String.t(), hashtags: [String.t()]}) :: post_result()
  def post(%{text: text, url: url, hashtags: hashtags}) do
    with {:ok, creds} <- load_config(),
         {:ok, session} <- create_session(creds),
         {:ok, record} <- create_record(session, text, url, hashtags) do
      {:ok, %{uri: record["uri"], cid: record["cid"]}}
    end
  end

  defp load_config do
    cfg = Application.get_env(:mono_phoenix_v01, :bluesky, [])
    handle = cfg[:handle]
    password = cfg[:app_password]

    if is_binary(handle) and handle != "" and is_binary(password) and password != "" do
      {:ok, %{handle: handle, password: password}}
    else
      {:error, :bluesky_credentials_missing}
    end
  end

  defp create_session(%{handle: handle, password: password}) do
    body = %{identifier: handle, password: password}

    case client() |> Tesla.post("/xrpc/com.atproto.server.createSession", body) do
      {:ok, %Tesla.Env{status: 200, body: %{"accessJwt" => jwt, "did" => did}}} ->
        {:ok, %{jwt: jwt, did: did}}

      {:ok, %Tesla.Env{status: status, body: body}} ->
        {:error, {:bluesky_session_failed, status, body}}

      {:error, reason} ->
        {:error, {:bluesky_session_transport, reason}}
    end
  end

  defp create_record(%{jwt: jwt, did: did}, text, url, hashtags) do
    record = %{
      "$type" => "app.bsky.feed.post",
      text: text,
      createdAt: DateTime.utc_now() |> DateTime.to_iso8601(),
      langs: ["en"],
      facets: build_facets(text, url, hashtags)
    }

    body = %{repo: did, collection: "app.bsky.feed.post", record: record}

    headers = [{"authorization", "Bearer " <> jwt}]

    case client() |> Tesla.post("/xrpc/com.atproto.repo.createRecord", body, headers: headers) do
      {:ok, %Tesla.Env{status: 200, body: body}} -> {:ok, body}
      {:ok, %Tesla.Env{status: status, body: body}} -> {:error, {:bluesky_post_failed, status, body}}
      {:error, reason} -> {:error, {:bluesky_post_transport, reason}}
    end
  end

  # Facets require byte-indexed ranges (not grapheme indexed).
  defp build_facets(text, url, hashtags) do
    url_facet =
      case byte_range(text, url) do
        {start_byte, end_byte} ->
          [
            %{
              index: %{byteStart: start_byte, byteEnd: end_byte},
              features: [%{"$type" => "app.bsky.richtext.facet#link", uri: url}]
            }
          ]

        nil ->
          []
      end

    hashtag_facets =
      hashtags
      |> Enum.map(fn "#" <> tag = full ->
        case byte_range(text, full) do
          {s, e} ->
            %{
              index: %{byteStart: s, byteEnd: e},
              features: [%{"$type" => "app.bsky.richtext.facet#tag", tag: tag}]
            }

          nil ->
            nil
        end
      end)
      |> Enum.reject(&is_nil/1)

    url_facet ++ hashtag_facets
  end

  defp byte_range(text, substring) do
    case :binary.match(text, substring) do
      {start, length} -> {start, start + length}
      :nomatch -> nil
    end
  end

  defp client do
    Tesla.client([
      {Tesla.Middleware.BaseUrl, @host},
      Tesla.Middleware.JSON
    ])
  end
end
