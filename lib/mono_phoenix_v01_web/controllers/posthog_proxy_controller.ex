defmodule MonoPhoenixV01Web.PosthogProxyController do
  use MonoPhoenixV01Web, :controller
  use Phoenix.Controller, formats: []
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
    # Get the request body - handle both raw and parsed cases
    {body, conn} = get_request_body(conn, params)

    # Build the target path
    path_info = build_path_info(params)
    target_path = "/" <> Enum.join(path_info, "/")
    
    # Get HTTP method early since we need it for headers
    method = String.downcase(conn.method) |> String.to_atom()
    
    Logger.info("Proxying #{method} #{target_path} body size: #{byte_size(body || "")}")
    
    # Prepare headers - remove connection-specific headers
    headers = 
      conn.req_headers
      |> Enum.reject(fn {key, _} -> 
        String.downcase(key) in ["host", "content-length", "connection"] 
      end)
      |> add_proper_content_type_for_method(method, body)
      |> Enum.concat([{"host", get_posthog_host(target_host)}])

    # Create Tesla client for the target host
    client = tesla_client(target_host)
    
    # Parse query string into keyword list
    query_params = if conn.query_string == "", do: [], else: URI.decode_query(conn.query_string) |> Enum.to_list()
    
    # Don't send body for GET requests
    request_body = if method == :get, do: nil, else: body
    
    Logger.info("Final request headers being sent: #{inspect(headers)}")
    Logger.info("Query params: #{inspect(query_params)}")
    
    case Tesla.request(client, 
           method: method, 
           url: target_path,
           body: request_body,
           headers: headers,
           query: query_params) do
      {:ok, %Tesla.Env{status: status, body: response_body, headers: response_headers}} ->
        Logger.info("Tesla response status: #{status}")
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

  # Get request body - handle both raw and Phoenix-parsed cases
  defp get_request_body(conn, params) do
    # First try to read raw body
    case Plug.Conn.read_body(conn, length: 64 * 1024 * 1024) do
      {:ok, "", conn} ->
        # Body was already read/parsed, try to reconstruct from params
        reconstruct_json_from_params(conn, params)
      {:ok, body, conn} when byte_size(body) > 0 ->
        # Got raw body
        {body, conn}
      {:more, _partial, conn} ->
        # Body too large, try to get all of it
        case Plug.Conn.read_body(conn, length: 64 * 1024 * 1024, read_length: 64 * 1024 * 1024) do
          {:ok, body, conn} -> {body, conn}
          {:more, partial, conn} -> {partial, conn}
          {:error, reason} ->
            Logger.error("Failed to read request body: #{inspect(reason)}")
            {"", conn}
        end
      {:error, reason} ->
        Logger.error("Failed to read request body: #{inspect(reason)}")
        {"", conn}
    end
  end

  # Try to reconstruct JSON body from parsed params (fallback for Phoenix-parsed requests)
  defp reconstruct_json_from_params(conn, params) do
    # Remove "path" from params and try to reconstruct JSON
    json_params = Map.drop(params, ["path"])
    
    cond do
      # If we have typical PostHog params, encode as JSON
      Map.has_key?(json_params, "api_key") or Map.has_key?(json_params, "distinct_id") ->
        body = Jason.encode!(json_params)
        {body, conn}
      
      # If there's a single key that looks like JSON, use that
      map_size(json_params) == 1 ->
        case Enum.to_list(json_params) do
          [{potential_json, ""}] when is_binary(potential_json) ->
            # This might be JSON that got parsed as a form key
            if String.starts_with?(potential_json, "{") and String.ends_with?(potential_json, "}") do
              {potential_json, conn}
            else
              {"", conn}
            end
          _ -> {"", conn}
        end
      
      # No body or unrecognizable format
      true -> {"", conn}
    end
  end

  defp get_posthog_host("https://us.i.posthog.com"), do: "us.i.posthog.com"
  defp get_posthog_host("https://us-assets.i.posthog.com"), do: "us-assets.i.posthog.com"
  
  # Preserve original content-type from client request for PostHog compatibility
  defp add_proper_content_type_for_method(headers, method, body) do
    # Check if we already have a content-type header
    has_content_type = Enum.any?(headers, fn {key, _} -> 
      String.downcase(key) == "content-type" 
    end)
    
    case method do
      :get ->
        # GET requests should NOT have content-type header
        Enum.reject(headers, fn {key, _} -> 
          String.downcase(key) == "content-type" 
        end)
      method when method in [:post, :put, :patch, :delete] ->
        if body && byte_size(body) > 0 do
          if has_content_type do
            # Preserve existing content-type from original request
            headers
          else
            # Only add JSON content-type if no content-type was provided
            [{"content-type", "application/json"} | headers]
          end
        else
          # Remove content-type for empty body requests
          Enum.reject(headers, fn {key, _} -> 
            String.downcase(key) == "content-type" 
          end)
        end
      _ ->
        headers
    end
  end
end