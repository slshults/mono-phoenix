defmodule MonoPhoenixV01.Social.Facebook do
  @moduledoc """
  Posts to a Facebook Page via the Graph API.

  Uses a long-lived Page Access Token (60-day lifespan). When the token nears
  expiry, exchange the user token in Graph Explorer for a new Page token and
  update `FACEBOOK_PAGE_ACCESS_TOKEN` in Gigalixir.

  Config (`config/runtime.exs`):
      config :mono_phoenix_v01, :facebook,
        page_id:           System.get_env("FACEBOOK_PAGE_ID"),
        page_access_token: System.get_env("FACEBOOK_PAGE_ACCESS_TOKEN")
  """

  @graph_api "https://graph.facebook.com/v21.0"

  @type post_result ::
          {:ok, %{id: String.t()}}
          | {:error, term()}

  @spec post(%{text: String.t(), url: String.t()}) :: post_result()
  def post(%{text: message, url: link}) do
    with {:ok, cfg} <- load_config() do
      body = %{message: message, link: link, access_token: cfg.page_access_token}
      path = "/#{cfg.page_id}/feed"

      case client() |> Tesla.post(path, body) do
        {:ok, %Tesla.Env{status: 200, body: %{"id" => id}}} ->
          {:ok, %{id: id}}

        {:ok, %Tesla.Env{status: status, body: body}} ->
          {:error, {:facebook_post_failed, status, body}}

        {:error, reason} ->
          {:error, {:facebook_post_transport, reason}}
      end
    end
  end

  defp load_config do
    cfg = Application.get_env(:mono_phoenix_v01, :facebook, [])
    page_id = cfg[:page_id]
    token = cfg[:page_access_token]

    if is_binary(page_id) and page_id != "" and is_binary(token) and token != "" do
      {:ok, %{page_id: page_id, page_access_token: token}}
    else
      {:error, :facebook_credentials_missing}
    end
  end

  defp client do
    Tesla.client([
      {Tesla.Middleware.BaseUrl, @graph_api},
      Tesla.Middleware.JSON
    ])
  end
end
