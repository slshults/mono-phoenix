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
    # Get the request body - use pre-read raw body if available
    {body, conn} = get_request_body(conn, params)

    # Build the target path
    path_info = build_path_info(params)
    target_path = "/" <> Enum.join(path_info, "/")
    
    # Get HTTP method early since we need it for headers
    method = String.downcase(conn.method) |> String.to_atom()
    
    Logger.info("Proxying #{method} #{target_path} body size: #{byte_size(body || "")}")
    
    # Prepare headers - remove connection-specific headers, preserve original content-type
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

  # Get request body - handle both pre-read raw body and Phoenix-parsed cases
  # For proxy requests, we want to avoid any UTF-8 validation
  defp get_request_body(conn, params) do
    # First check if we have a pre-read raw body from PosthogBodyReader plug
    case conn.assigns[:raw_body] do
      body when is_binary(body) ->
        Logger.info("Using pre-read raw body of size: #{byte_size(body)}")
        {body, conn}
      nil ->
        # Fallback to reading body directly (shouldn't happen with our plug)
        Logger.info("No pre-read body found, attempting direct read")
        read_body_directly(conn, params)
    end
  end

  # Direct body reading fallback
  defp read_body_directly(conn, params) do
    case Plug.Conn.read_body(conn, 
         length: 64 * 1024 * 1024, 
         read_length: 1024 * 1024, 
         read_timeout: 60_000) do
      {:ok, "", conn} ->
        # Body was already read/parsed, try to reconstruct from params
        reconstruct_body_from_params(conn, params)
      {:ok, body, conn} when byte_size(body) > 0 ->
        # Got raw body - return as-is for proxy forwarding
        Logger.info("Using directly read body of size: #{byte_size(body)}")
        {body, conn}
      {:more, partial, conn} ->
        # Body too large, collect all chunks
        collect_remaining_body(conn, partial)
      {:error, :timeout} ->
        Logger.error("Timeout reading request body")
        {"", conn}
      {:error, reason} ->
        Logger.error("Failed to read request body: #{inspect(reason)}")
        {"", conn}
    end
  end

  # Collect remaining chunks for large bodies
  defp collect_remaining_body(conn, acc) do
    case Plug.Conn.read_body(conn, 
         length: 64 * 1024 * 1024, 
         read_length: 1024 * 1024,
         read_timeout: 60_000) do
      {:ok, body, conn} -> {acc <> body, conn}
      {:more, partial, conn} -> collect_remaining_body(conn, acc <> partial)
      {:error, reason} ->
        Logger.error("Failed to read remaining body: #{inspect(reason)}")
        {acc, conn}
    end
  end

  # Try to reconstruct body from parsed params (fallback for Phoenix-parsed requests)
  # This handles both JSON and form-encoded data
  defp reconstruct_body_from_params(conn, params) do
    # Remove "path" from params
    cleaned_params = Map.drop(params, ["path"])
    
    cond do
      # If we have typical PostHog JSON params, encode as JSON
      Map.has_key?(cleaned_params, "api_key") or Map.has_key?(cleaned_params, "distinct_id") ->
        try do
          body = Jason.encode!(cleaned_params)
          Logger.info("Reconstructed JSON body from params")
          {body, conn}
        rescue
          e in Jason.EncodeError ->
            Logger.error("Failed to encode params as JSON: #{inspect(e)}")
            {"", conn}
        end
      
      # If there's a single key that looks like JSON, use that
      map_size(cleaned_params) == 1 ->
        case Enum.to_list(cleaned_params) do
          [{potential_json, ""}] when is_binary(potential_json) ->
            # This might be JSON that got parsed as a form key
            if String.starts_with?(potential_json, "{") and String.ends_with?(potential_json, "}") do
              Logger.info("Using potential JSON from form key")
              {potential_json, conn}
            else
              # Might be form data, encode as form
              encode_as_form_data(cleaned_params, conn)
            end
          _ -> encode_as_form_data(cleaned_params, conn)
        end
      
      # If we have multiple params, might be form data
      map_size(cleaned_params) > 0 ->
        encode_as_form_data(cleaned_params, conn)
      
      # No body or unrecognizable format
      true -> {"", conn}
    end
  end

  # Encode params as form data
  defp encode_as_form_data(params, conn) do
    try do
      # Use URI.encode_query which properly handles UTF-8
      body = URI.encode_query(params)
      Logger.info("Reconstructed form body from params")
      {body, conn}
    rescue
      e ->
        Logger.error("Failed to encode params as form data: #{inspect(e)}")
        {"", conn}
    end
  end

  defp get_posthog_host("https://us.i.posthog.com"), do: "us.i.posthog.com"
  defp get_posthog_host("https://us-assets.i.posthog.com"), do: "us-assets.i.posthog.com"
end