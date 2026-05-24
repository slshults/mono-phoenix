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
  alias MonoPhoenixV01Web.UserAuth

  def success(conn, %{"session_id" => session_id}) when is_binary(session_id) do
    with {:ok, data} <- Billing.verify_checkout_session(session_id),
         %_{} = user <- Accounts.get_user!(data.user_id),
         {:ok, user} <- Accounts.mark_subscription_active(user, data) do
      conn
      |> put_session(:user_return_to, ~p"/welcome")
      |> UserAuth.log_in_user(user)
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
      {:ok, user} -> Accounts.delete_pending_user(user)
      _ -> :ok
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
end
