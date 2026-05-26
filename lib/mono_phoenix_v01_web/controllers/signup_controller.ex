defmodule MonoPhoenixV01Web.SignupController do
  @moduledoc """
  Handles the Stripe Checkout redirect targets. Controllers (not LiveViews)
  because they manipulate the session (auto-login) and handle external
  redirects.

  Routes:
    GET /signup/success?session_id=cs_...
    GET /signup/cancel?session_id=cs_...
  """

  use MonoPhoenixV01Web, :controller

  require Logger

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Billing
  alias MonoPhoenixV01.PostHog
  alias MonoPhoenixV01Web.UserAuth

  def success(conn, %{"session_id" => session_id} = params) when is_binary(session_id) do
    token = params["t"]

    with {:ok, data} <- Billing.verify_checkout_session(session_id),
         %_{} = user <- Accounts.get_user(data.user_id) || {:error, {:user_not_found, data.user_id}},
         {:ok, user} <- Accounts.mark_subscription_active(user, data) do
      track_signup_completed(user)

      # Auto-login is gated by the signup token. The token is bound to
      # the user_id at Checkout-creation time and lives 30 min — anyone
      # who later acquires the cs_… session id alone (web-server logs,
      # referrer leaks, etc.) can't claim the account.
      case Billing.verify_signup_token(token) do
        {:ok, token_user_id} when token_user_id == user.id ->
          conn
          |> put_session(:user_return_to, ~p"/welcome")
          |> UserAuth.log_in_user(user)

        _ ->
          # Payment is real (we already flipped the row to active) but
          # we don't auto-login. Send them through the front door.
          Logger.info(
            "Signup success without matching token for user_id=#{user.id}; " <>
              "asking them to log in"
          )

          conn
          |> put_flash(
            :info,
            "Your payment was received. Please log in to access your account."
          )
          |> redirect(to: ~p"/users/log-in")
      end
    else
      error ->
        Logger.warning(
          "Stripe success handler could not verify session " <>
            "session_id=#{session_id} reason=#{inspect(error)}"
        )

        conn
        |> put_flash(
          :error,
          "We couldn't verify your payment. If you were charged, please contact us."
        )
        |> redirect(to: ~p"/")
    end
  end

  def success(conn, _params) do
    conn
    |> put_flash(:error, "Missing checkout session.")
    |> redirect(to: ~p"/")
  end

  def cancel(conn, %{"session_id" => session_id}) when is_binary(session_id) do
    case fetch_pending_user_from_session(session_id) do
      {:ok, user} ->
        track_signup_canceled(user)
        Accounts.delete_pending_user(user)

      _ ->
        PostHog.capture("signup_canceled", %{has_user: false})
    end

    conn
    |> put_flash(:info, "Signup canceled. You're welcome to try again anytime.")
    |> redirect(to: ~p"/")
  end

  def cancel(conn, _params) do
    conn
    |> put_flash(:info, "Signup canceled.")
    |> redirect(to: ~p"/")
  end

  defp fetch_pending_user_from_session(session_id) do
    with {:ok, %{customer: cus_id}} when is_binary(cus_id) <-
           Billing.retrieve_checkout_session(session_id),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      {:ok, user}
    else
      _ -> :error
    end
  end

  defp track_signup_completed(user) do
    now_iso = DateTime.utc_now() |> DateTime.to_iso8601()

    PostHog.identify(user.email,
      set: %{
        email: user.email,
        user_id: user.id,
        subscription_status: user.subscription_status,
        billing_period: user.billing_period,
        current_period_end: iso8601(user.current_period_end),
        has_password: not is_nil(user.hashed_password),
        has_been_welcomed: not is_nil(user.welcomed_at),
        auth_state: "patron"
      },
      set_once: %{signup_completed_at: now_iso}
    )

    PostHog.capture(
      "signup_completed",
      %{billing_period: user.billing_period, user_id: user.id},
      distinct_id: user.email
    )
  end

  defp track_signup_canceled(user) do
    PostHog.capture(
      "signup_canceled",
      %{has_user: true, user_id: user.id},
      distinct_id: user.email
    )
  end

  defp iso8601(nil), do: nil
  defp iso8601(%DateTime{} = dt), do: DateTime.to_iso8601(dt)
  defp iso8601(_), do: nil
end
