defmodule MonoPhoenixV01Web.PostHogIdentityController do
  use MonoPhoenixV01Web, :controller
  require Logger

  def sign(conn, %{"distinct_id" => distinct_id})
      when is_binary(distinct_id) and byte_size(distinct_id) in 1..256 do
    case System.get_env("POSTHOG_SECRET_API_KEY") do
      blank when blank in [nil, ""] ->
        Logger.error("POSTHOG_SECRET_API_KEY missing; cannot sign widget identity")

        conn
        |> put_status(:service_unavailable)
        |> json(%{error: "not_configured"})

      secret ->
        hash =
          :crypto.mac(:hmac, :sha256, secret, distinct_id)
          |> Base.encode16(case: :lower)

        json(conn, %{hash: hash})
    end
  end

  def sign(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "invalid_distinct_id"})
  end
end
