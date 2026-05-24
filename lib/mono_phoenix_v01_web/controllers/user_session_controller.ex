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
  defp create(conn, %{"user" => %{"token" => token} = user_params}, info) do
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
  defp create(conn, %{"user" => user_params}, info) do
    %{"email" => email, "password" => password} = user_params

    if user = Accounts.get_user_by_email_and_password(email, password) do
      conn
      |> put_flash(:info, info)
      |> UserAuth.maybe_log_in_user(user, user_params)
    else
      # Generic wording so we don't disclose whether the email is registered
      # (basic user-enumeration hygiene), but also hint at the email-link
      # option for users who never set a password.
      conn
      |> put_flash(
        :error,
        "Couldn't sign you in with that email and password. If you haven't set a password yet, use the email-link option above."
      )
      |> put_flash(:email, String.slice(email, 0, 160))
      |> redirect(to: ~p"/users/log-in")
    end
  end

  def update_password(conn, %{"user" => user_params} = params) do
    user = conn.assigns.current_scope.user
    true = Accounts.sudo_mode?(user)
    {:ok, {_user, expired_tokens}} = Accounts.update_user_password(user, user_params)

    # disconnect all existing LiveViews with old sessions
    UserAuth.disconnect_sessions(expired_tokens)

    # Send the user to /account after a successful password change.
    # The gen.auth default returns them to /users/settings (where they just
    # were), which makes the success flash feel pointless. /account is a
    # useful landing page that confirms they're logged in.
    conn
    |> put_session(:user_return_to, ~p"/account")
    |> create(params, "Password updated successfully!")
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "Logged out successfully.")
    |> UserAuth.log_out_user()
  end
end
