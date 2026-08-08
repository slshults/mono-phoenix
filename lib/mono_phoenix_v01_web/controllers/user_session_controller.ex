defmodule MonoPhoenixV01Web.UserSessionController do
  use MonoPhoenixV01Web, :controller

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01Web.UserAuth

  def create(conn, %{"_action" => "confirmed"} = params) do
    create(conn, params, "User confirmed successfully.")
  end

  def create(conn, params) do
    create(conn, params, "Welcome back!")
  end

  # magic link login
  defp create(conn, %{"user" => %{"token" => token} = user_params}, info)
       when is_binary(token) do
    case Accounts.login_user_by_magic_link(token) do
      {:ok, {user, tokens_to_disconnect}} ->
        UserAuth.disconnect_sessions(tokens_to_disconnect)

        conn
        |> put_flash(:info, info)
        |> UserAuth.maybe_log_in_user(user, user_params)

      _ ->
        conn
        |> put_flash(:error, "The link is invalid or it has expired.")
        |> redirect(to: ~p"/users/log-in")
    end
  end

  # email + password login
  defp create(conn, %{"user" => %{"email" => email, "password" => password} = user_params}, info)
       when is_binary(email) and is_binary(password) do
    if user = Accounts.get_user_by_email_and_password(email, password) do
      conn
      |> put_flash(:info, info)
      |> UserAuth.maybe_log_in_user(user, user_params)
    else
      invalid_login(conn, email)
    end
  end

  # Malformed login params: no "user" key, a missing email/password, a
  # non-binary token, or non-binary email/password values (e.g. a client
  # that posts only an email field). Treat it as a validation failure and
  # return the normal invalid-credentials response instead of crashing --
  # either on the destructure here, or further in on the guards of
  # Accounts.get_user_by_email_and_password/2 and the Base.url_decode64/2
  # call behind login_user_by_magic_link/1.
  defp create(conn, params, _info) do
    email =
      case params do
        %{"user" => %{"email" => email}} when is_binary(email) -> email
        _ -> nil
      end

    invalid_login(conn, email)
  end

  defp invalid_login(conn, email) do
    # Generic wording so we don't disclose whether the email is registered
    # (basic user-enumeration hygiene), but also hint at the email-link
    # option for users who never set a password.
    conn
    |> put_flash(
      :error,
      "Couldn't sign you in with that email and password. If you haven't set a password yet, use the email-link option above."
    )
    |> maybe_put_email_flash(email)
    |> redirect(to: ~p"/users/log-in")
  end

  defp maybe_put_email_flash(conn, email) when is_binary(email) do
    put_flash(conn, :email, String.slice(email, 0, 160))
  end

  defp maybe_put_email_flash(conn, _email), do: conn

  def update_password(conn, %{"user" => user_params}) do
    user = conn.assigns.current_scope.user

    cond do
      not Accounts.sudo_mode?(user) ->
        # Sudo expired (≥20 min since last auth). Replay protection:
        # send them back to re-authenticate instead of crashing on a
        # MatchError.
        conn
        |> put_flash(:error, "You must re-authenticate to change your password.")
        |> redirect(to: ~p"/users/log-in")

      true ->
        {:ok, {_user, expired_tokens}} =
          Accounts.update_user_password(user, user_params)

        # disconnect all existing LiveViews with old sessions
        UserAuth.disconnect_sessions(expired_tokens)

        # Use `log_in_user/3` directly instead of routing back through
        # `maybe_log_in_user`. The user was already authenticated (in sudo
        # mode) when they posted this form — running through the
        # lapsed-gating would bounce a past_due / canceled patron to
        # /account/lapsed and silently drop their just-renewed session.
        conn
        |> put_flash(:info, "Password updated successfully!")
        |> put_session(:user_return_to, ~p"/account")
        |> UserAuth.log_in_user(user, %{})
    end
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "Logged out successfully.")
    |> UserAuth.log_out_user()
  end

  @doc """
  Endpoint LapsedLive uses to dismiss the lapsed modal and continue
  with ads. The LiveView can't modify session cookies directly, so it
  redirects the browser here; this controller clears `:lapsed_user_id`
  (so a stale session can't reopen the modal with the previous user's
  email visible) and bounces the user home.
  """
  def dismiss_lapsed(conn, _params) do
    conn
    |> delete_session(:lapsed_user_id)
    |> clear_flash()
    |> redirect(to: ~p"/")
  end
end
