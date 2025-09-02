defmodule MonoPhoenixV01Web.PosthogProxyController do
  use MonoPhoenixV01Web, :controller

  @posthog_api_host "https://us.i.posthog.com"
  @posthog_static_host "https://us-assets.i.posthog.com"

  def proxy(conn, params) do
    proxy_to_posthog(conn, @posthog_api_host, params)
  end

  def static(conn, %{"path" => path}) do
    proxy_to_posthog(conn, @posthog_static_host, %{"path" => ["static" | path]})
  end

  defp proxy_to_posthog(conn, target_host, params) do
    # Get the request body
    {:ok, body, conn} = Plug.Conn.read_body(conn, length: 64 * 1024 * 1024) # 64MB limit for PostHog

    # Build the target path
    path_info = build_path_info(params)
    target_path = "/" <> Enum.join(path_info, "/")
    
    # Build target URL with query string
    query_string = if conn.query_string == "", do: "", else: "?" <> conn.query_string
    target_url = target_host <> target_path <> query_string

    # Prepare headers with proper Host header
    headers = 
      conn.req_headers
      |> Enum.reject(fn {key, _} -> 
        String.downcase(key) in ["host", "content-length", "connection"] 
      end)
      |> Enum.concat([{"host", get_posthog_host(target_host)}])

    # Make the HTTP request
    case HTTPoison.request(
           conn.method |> String.downcase() |> String.to_atom(),
           target_url,
           body,
           headers,
           recv_timeout: 30_000,
           timeout: 30_000
         ) do
      {:ok, %HTTPoison.Response{status_code: status, body: response_body, headers: response_headers}} ->
        # Filter response headers
        filtered_headers = 
          response_headers
          |> Enum.reject(fn {key, _} -> 
            String.downcase(key) in ["transfer-encoding", "connection", "content-encoding"]
          end)
        
        conn
        |> merge_resp_headers(filtered_headers)
        |> send_resp(status, response_body)
        
      {:error, %HTTPoison.Error{reason: reason}} ->
        conn
        |> put_status(502)
        |> json(%{error: "Proxy error: #{inspect(reason)}"})
    end
  end

  defp build_path_info(%{"path" => path}) when is_list(path), do: path
  defp build_path_info(_), do: []

  defp get_posthog_host("https://us.i.posthog.com"), do: "us.i.posthog.com"
  defp get_posthog_host("https://us-assets.i.posthog.com"), do: "us-assets.i.posthog.com"
end