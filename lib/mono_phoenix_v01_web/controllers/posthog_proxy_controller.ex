defmodule MonoPhoenixV01Web.PosthogProxyController do
  use MonoPhoenixV01Web, :controller
  require Logger

  @posthog_api_host "https://us.i.posthog.com"
  @posthog_static_host "https://us-assets.i.posthog.com"

  # Tesla client with compression middleware
  defp tesla_client(base_url) do
    Tesla.client([
      {Tesla.Middleware.BaseUrl, base_url},
      {Tesla.Middleware.Headers, [{"user-agent", "PostHog-Proxy/1.0"}]},
      Tesla.Middleware.FollowRedirects,
      Tesla.Middleware.Compression
    ], Tesla.Adapter.Hackney)
  end

  def proxy(conn, params) do
    # Handle CORS preflight requests
    if conn.method == "OPTIONS" do
      conn
      |> put_resp_header("access-control-allow-origin", "*")
      |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
      |> put_resp_header("access-control-allow-headers", "authorization, content-type, x-requested-with")
      |> send_resp(200, "")
    else
      proxy_to_posthog(conn, @posthog_api_host, params)
    end
  end

  def static(conn, %{"path" => path}) do
    # Handle CORS preflight requests for static assets too
    if conn.method == "OPTIONS" do
      conn
      |> put_resp_header("access-control-allow-origin", "*")
      |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
      |> put_resp_header("access-control-allow-headers", "authorization, content-type, x-requested-with")
      |> send_resp(200, "")
    else
      proxy_to_posthog(conn, @posthog_static_host, %{"path" => ["static" | path]})
    end
  end

  defp proxy_to_posthog(conn, target_host, params) do
    # Get the request body
    {:ok, body, conn} = Plug.Conn.read_body(conn, length: 64 * 1024 * 1024) # 64MB limit for PostHog

    # Build the target path
    path_info = build_path_info(params)
    target_path = "/" <> Enum.join(path_info, "/")
    
    # Prepare headers (remove connection-specific headers)
    headers = 
      conn.req_headers
      |> Enum.reject(fn {key, _} -> 
        String.downcase(key) in ["host", "content-length", "connection"] 
      end)
      |> Enum.concat([{"host", get_posthog_host(target_host)}])

    # Create Tesla client for the target host
    client = tesla_client(target_host)
    
    # Parse query string into keyword list
    query_params = if conn.query_string == "", do: [], else: URI.decode_query(conn.query_string) |> Enum.to_list()

    # Make the HTTP request using Tesla
    method = String.downcase(conn.method) |> String.to_atom()
    
    case Tesla.request(client, 
           method: method, 
           url: target_path,
           body: body,
           headers: headers,
           query: query_params) do
      {:ok, %Tesla.Env{status: status, body: response_body, headers: response_headers}} ->
        Logger.info("Tesla response headers: #{inspect(response_headers)}")
        
        # Tesla handles compression automatically, so we should get clean headers
        filtered_headers = 
          response_headers
          |> Enum.reject(fn {key, _} -> 
            String.downcase(key) in ["transfer-encoding", "connection"]
          end)
        
        Logger.info("Filtered headers being sent: #{inspect(filtered_headers)}")
        
        conn
        |> put_resp_header("access-control-allow-origin", "*")
        |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        |> put_resp_header("access-control-allow-headers", "authorization, content-type, x-requested-with")
        |> merge_resp_headers(filtered_headers)
        |> send_resp(status, response_body)
        
      {:error, reason} ->
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