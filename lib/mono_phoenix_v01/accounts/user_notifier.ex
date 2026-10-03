defmodule MonoPhoenixV01.Accounts.UserNotifier do
  import Swoosh.Email

  require Logger

  alias MonoPhoenixV01.Mailer
  alias MonoPhoenixV01.Accounts.User

  # Delivers the email using the application mailer.
  # TODO before launch: confirm the from-address is one your Gmail SMTP relay
  # actually accepts (or update the mailer config). Display name is final.
  #
  # Every LiveView caller (magic link, confirmation, email change) discards
  # this result, so a failed send is invisible unless it's logged here. The
  # subject identifies the path; the recipient is deliberately omitted (the
  # server reply in `reason` may still echo an address on recipient rejection).
  defp deliver(recipient, subject, body) do
    email =
      new()
      |> to(recipient)
      |> from({"Shakespeare's Monologues", "tipjar@shakespeare-monologues.org"})
      |> subject(subject)
      |> text_body(body)

    case Mailer.deliver(email) do
      {:ok, _metadata} ->
        {:ok, email}

      {:error, reason} = error ->
        Logger.error("Failed to send \"#{subject}\" email: #{inspect(reason)}")
        error
    end
  end

  @doc """
  Deliver instructions to update a user email.
  """
  def deliver_update_email_instructions(user, url) do
    deliver(user.email, "Update your Shakespeare's Monologues email", """

    ==============================

    Hi #{user.email},

    You can change your email by visiting the URL below:

    #{url}

    If you didn't request this change, please ignore this.

    ==============================
    """)
  end

  @doc """
  Deliver instructions to log in with a magic link.
  """
  def deliver_login_instructions(user, url) do
    case user do
      %User{confirmed_at: nil} -> deliver_confirmation_instructions(user, url)
      _ -> deliver_magic_link_instructions(user, url)
    end
  end

  defp deliver_magic_link_instructions(user, url) do
    deliver(user.email, "Login link for Shakespeare's Monologues", """

    ==============================

    Hi #{user.email},

    You can log into your account by visiting the URL below:

    #{url}

    If you didn't request this email, please ignore this.

    ==============================
    """)
  end

  defp deliver_confirmation_instructions(user, url) do
    deliver(user.email, "Confirm your Shakespeare's Monologues account", """

    ==============================

    Hi #{user.email},

    You can confirm your account by visiting the URL below:

    #{url}

    If you didn't create an account with us, please ignore this.

    ==============================
    """)
  end
end
