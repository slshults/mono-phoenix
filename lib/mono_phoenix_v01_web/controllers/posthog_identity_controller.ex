defmodule MonoPhoenixV01Web.PostHogIdentityController do
  @moduledoc """
  Signs the current patron's PostHog distinct_id so the Conversations widget can
  verify who they are.

  The value that gets signed comes from the SESSION and never from the request
  body. That distinction is the whole point of this module: an earlier version
  signed whatever `distinct_id` the caller passed in, on a route with no
  authentication at all. Because patrons are identified to PostHog by their
  email address, anyone who knew (or guessed) a patron's email could ask this
  endpoint for a valid hash and hand it to `posthog.setIdentity()` — presenting
  themselves to the widget as that patron, with their support conversations.

  Nothing legitimate ever needed the client to choose the value. The browser
  only ever sent back the distinct_id PostHog had already been given by
  `LiveFavoritesHelpers.push_posthog_identify/3`, which takes it from the
  logged-in scope on the server in the first place.
  """
  use MonoPhoenixV01Web, :controller
  require Logger

  def sign(%{assigns: %{current_scope: %{user: %{email: email}}}} = conn, _params) do
    case System.get_env("POSTHOG_SECRET_API_KEY") do
      blank when blank in [nil, ""] ->
        Logger.error("POSTHOG_SECRET_API_KEY missing; cannot sign widget identity")

        conn
        |> put_status(:service_unavailable)
        |> json(%{error: "not_configured"})

      secret ->
        hash =
          :crypto.mac(:hmac, :sha256, secret, email)
          |> Base.encode16(case: :lower)

        # Return the id we actually signed. The client must use this rather than
        # its own, so the two can never drift apart.
        json(conn, %{distinct_id: email, hash: hash})
    end
  end

  def sign(conn, _params) do
    conn
    |> put_status(:unauthorized)
    |> json(%{error: "unauthenticated"})
  end
end
