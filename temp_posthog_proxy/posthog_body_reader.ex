defmodule MonoPhoenixV01Web.Plugs.PosthogBodyReader do
  @moduledoc """
  A plug that bypasses Phoenix's default body parsing for PostHog proxy requests.
  
  This plug reads the raw request body before Phoenix's Plug.Parsers can process it,
  preventing UTF-8 validation errors on non-UTF-8 content from PostHog events.
  """
  
  import Plug.Conn
  require Logger

  def init(opts), do: opts

  def call(conn, _opts) do
    # Only process if the body hasn't been read yet
    case conn.body_params do
      %Plug.Conn.Unfetched{} ->
        # Read the raw body and store it in conn.assigns for the controller
        case read_raw_body(conn) do
          {:ok, body, conn} ->
            conn
            |> assign(:raw_body, body)
            |> assign(:body_read_by_posthog_plug, true)
          {:error, reason, conn} ->
            Logger.error("PosthogBodyReader failed to read body: #{inspect(reason)}")
            conn
            |> assign(:raw_body, "")
            |> assign(:body_read_by_posthog_plug, true)
        end
      _ ->
        # Body was already parsed, mark it as such
        conn |> assign(:body_read_by_posthog_plug, false)
    end
  end

  defp read_raw_body(conn) do
    case Plug.Conn.read_body(conn,
         length: 64 * 1024 * 1024,
         read_length: 1024 * 1024,
         read_timeout: 60_000) do
      {:ok, body, conn} ->
        Logger.info("PosthogBodyReader read #{byte_size(body)} bytes")
        {:ok, body, conn}
      {:more, partial, conn} ->
        # For large bodies, collect all chunks
        case collect_remaining_body(conn, partial) do
          {complete_body, conn} -> {:ok, complete_body, conn}
          error -> error
        end
      {:error, reason} = error ->
        {error, reason, conn}
    end
  end

  defp collect_remaining_body(conn, acc) do
    case Plug.Conn.read_body(conn,
         length: 64 * 1024 * 1024,
         read_length: 1024 * 1024,
         read_timeout: 60_000) do
      {:ok, body, conn} -> {acc <> body, conn}
      {:more, partial, conn} -> collect_remaining_body(conn, acc <> partial)
      {:error, reason} ->
        Logger.error("Failed to read remaining body chunks: #{inspect(reason)}")
        {acc, conn}
    end
  end
end