defmodule MonoPhoenixV01.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias MonoPhoenixV01.Accounts.Repo

  alias MonoPhoenixV01.Accounts.{User, UserToken, UserNotifier}

  ## Database getters

  @doc """
  Gets a user by email.

  ## Examples

      iex> get_user_by_email("foo@example.com")
      %User{}

      iex> get_user_by_email("unknown@example.com")
      nil

  """
  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: email)
  end

  @doc """
  Gets a user by email and password.

  ## Examples

      iex> get_user_by_email_and_password("foo@example.com", "correct_password")
      %User{}

      iex> get_user_by_email_and_password("foo@example.com", "invalid_password")
      nil

  """
  def get_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    user = Repo.get_by(User, email: email)
    if User.valid_password?(user, password), do: user
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  ## User registration

  @doc """
  Registers a user.

  ## Examples

      iex> register_user(%{field: value})
      {:ok, %User{}}

      iex> register_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def register_user(attrs) do
    %User{}
    |> User.email_changeset(attrs)
    |> Repo.insert()
  end

  ## Settings

  @doc """
  Checks whether the user is in sudo mode.

  The user is in sudo mode when the last authentication was done no further
  than 20 minutes ago. The limit can be given as second argument in minutes.
  """
  def sudo_mode?(user, minutes \\ -20)

  def sudo_mode?(%User{authenticated_at: ts}, minutes) when is_struct(ts, NaiveDateTime) do
    NaiveDateTime.after?(ts, NaiveDateTime.utc_now() |> NaiveDateTime.add(minutes, :minute))
  end

  def sudo_mode?(_user, _minutes), do: false

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the user email.

  See `MonoPhoenixV01.Accounts.User.email_changeset/3` for a list of supported options.

  ## Examples

      iex> change_user_email(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user_email(user, attrs \\ %{}, opts \\ []) do
    User.email_changeset(user, attrs, opts)
  end

  @doc """
  Updates the user email using the given token.

  If the token matches, the user email is updated and the token is deleted.
  """
  def update_user_email(user, token) do
    context = "change:#{user.email}"

    Repo.transact(fn ->
      with {:ok, query} <- UserToken.verify_change_email_token_query(token, context),
           %UserToken{sent_to: email} <- Repo.one(query),
           {:ok, user} <- Repo.update(User.email_changeset(user, %{email: email})),
           {_count, _result} <-
             Repo.delete_all(from(UserToken, where: [user_id: ^user.id, context: ^context])) do
        {:ok, user}
      else
        _ -> {:error, :transaction_aborted}
      end
    end)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the user password.

  See `MonoPhoenixV01.Accounts.User.password_changeset/3` for a list of supported options.

  ## Examples

      iex> change_user_password(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user_password(user, attrs \\ %{}, opts \\ []) do
    User.password_changeset(user, attrs, opts)
  end

  @doc """
  Updates the user password.

  Returns a tuple with the updated user, as well as a list of expired tokens.

  ## Examples

      iex> update_user_password(user, %{password: ...})
      {:ok, {%User{}, [...]}}

      iex> update_user_password(user, %{password: "too short"})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_password(user, attrs) do
    user
    |> User.password_changeset(attrs)
    |> update_user_and_delete_all_tokens()
  end

  ## Session

  @doc """
  Generates a session token.
  """
  def generate_user_session_token(user) do
    {token, user_token} = UserToken.build_session_token(user)
    Repo.insert!(user_token)
    token
  end

  @doc """
  Gets the user with the given signed token.

  If the token is valid `{user, token_inserted_at}` is returned, otherwise `nil` is returned.
  """
  def get_user_by_session_token(token) do
    {:ok, query} = UserToken.verify_session_token_query(token)
    Repo.one(query)
  end

  @doc """
  Gets the user with the given magic link token.
  """
  def get_user_by_magic_link_token(token) do
    with {:ok, query} <- UserToken.verify_magic_link_token_query(token),
         {user, _token} <- Repo.one(query) do
      user
    else
      _ -> nil
    end
  end

  @doc """
  Logs the user in by magic link.

  There are three cases to consider:

  1. The user has already confirmed their email. They are logged in
     and the magic link is expired.

  2. The user has not confirmed their email and no password is set.
     In this case, the user gets confirmed, logged in, and all tokens -
     including session ones - are expired. In theory, no other tokens
     exist but we delete all of them for best security practices.

  3. The user has not confirmed their email but a password is set.
     This cannot happen in the default implementation but may be the
     source of security pitfalls. See the "Mixing magic link and password registration" section of
     `mix help phx.gen.auth`.
  """
  def login_user_by_magic_link(token) do
    {:ok, query} = UserToken.verify_magic_link_token_query(token)

    case Repo.one(query) do
      # Prevent session fixation attacks by disallowing magic links for unconfirmed users with password
      {%User{confirmed_at: nil, hashed_password: hash}, _token} when not is_nil(hash) ->
        raise """
        magic link log in is not allowed for unconfirmed users with a password set!

        This cannot happen with the default implementation, which indicates that you
        might have adapted the code to a different use case. Please make sure to read the
        "Mixing magic link and password registration" section of `mix help phx.gen.auth`.
        """

      {%User{confirmed_at: nil} = user, _token} ->
        user
        |> User.confirm_changeset()
        |> update_user_and_delete_all_tokens()

      {user, token} ->
        Repo.delete!(token)
        {:ok, {user, []}}

      nil ->
        {:error, :not_found}
    end
  end

  @doc ~S"""
  Delivers the update email instructions to the given user.

  ## Examples

      iex> deliver_user_update_email_instructions(user, current_email, &url(~p"/users/settings/confirm-email/#{&1}"))
      {:ok, %{to: ..., body: ...}}

  """
  def deliver_user_update_email_instructions(%User{} = user, current_email, update_email_url_fun)
      when is_function(update_email_url_fun, 1) do
    {encoded_token, user_token} = UserToken.build_email_token(user, "change:#{current_email}")

    Repo.insert!(user_token)
    UserNotifier.deliver_update_email_instructions(user, update_email_url_fun.(encoded_token))
  end

  @doc """
  Delivers the magic link login instructions to the given user.
  """
  def deliver_login_instructions(%User{} = user, magic_link_url_fun)
      when is_function(magic_link_url_fun, 1) do
    {encoded_token, user_token} = UserToken.build_email_token(user, "login")
    Repo.insert!(user_token)
    UserNotifier.deliver_login_instructions(user, magic_link_url_fun.(encoded_token))
  end

  @doc """
  Deletes the signed token with the given context.
  """
  def delete_user_session_token(token) do
    Repo.delete_all(from(UserToken, where: [token: ^token, context: "session"]))
    :ok
  end

  ## Patron subscription helpers (Phase 2)

  @doc """
  Create a `pending_payment` user from the patron-signup form.

  Branches:
  - No existing user with this email → insert new pending row.
  - Existing user, status="active" → `{:error, :already_active}` (caller
    renders the "you already have an account" modal).
  - Existing user, status="pending_payment" → delete the old row, insert
    fresh (per spec: dump-and-restart on bail).
  - Existing user, any other status (canceled/lapsed/past_due) → reuse the
    row, flip back to pending_payment with the new billing_period.
  """
  def create_pending_user(attrs) do
    email = Map.get(attrs, "email") || Map.get(attrs, :email)

    case get_user_by_email(email) do
      nil ->
        insert_pending(attrs)

      %User{subscription_status: "active"} ->
        {:error, :already_active}

      %User{subscription_status: "pending_payment"} = existing ->
        Repo.delete!(existing)
        insert_pending(attrs)

      %User{} = existing ->
        existing
        |> User.signup_changeset(attrs)
        |> Repo.update()
    end
  end

  defp insert_pending(attrs) do
    %User{}
    |> User.signup_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Attach a Stripe customer ID to the user after creating the customer.
  """
  def attach_stripe_customer(user, stripe_customer_id) do
    user
    |> User.stripe_customer_changeset(%{stripe_customer_id: stripe_customer_id})
    |> Repo.update()
  end

  @doc """
  Flip the user to active status with subscription metadata. Called from
  the /signup/success handler and from `checkout.session.completed`
  webhook (belt-and-suspenders; idempotent).

  Also sets `confirmed_at` since we treat verified Stripe payment as
  proof of email control (matches gen.auth's confirmation step).
  """
  def mark_subscription_active(user, stripe_data) do
    attrs =
      %{
        stripe_subscription_id: stripe_data[:stripe_subscription_id],
        subscription_status: "active",
        current_period_end: stripe_data[:current_period_end],
        billing_period: stripe_data[:billing_period],
        confirmed_at:
          NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)
      }

    user
    |> User.subscription_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Generic subscription state update. Webhook handlers use this for
  customer.subscription.updated, customer.subscription.deleted,
  invoice.payment_failed.
  """
  def update_subscription_status(user, attrs) do
    user
    |> User.subscription_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Delete a pending_payment user. Refuses to delete anything else
  (belt-and-suspenders against webhook race deleting a paying user).
  """
  def delete_pending_user(%User{subscription_status: "pending_payment"} = user) do
    Repo.delete(user)
  end

  def delete_pending_user(_user), do: {:error, :not_pending}

  @doc """
  Look up a user by Stripe customer ID. Used by webhook handlers.
  """
  def get_user_by_stripe_customer_id(stripe_customer_id)
      when is_binary(stripe_customer_id) do
    Repo.get_by(User, stripe_customer_id: stripe_customer_id)
  end

  def get_user_by_stripe_customer_id(_), do: nil

  @doc "Mark the welcome-prompt as dismissed (either by 'Set a password' or 'Skip')."
  def mark_welcomed(user) do
    user
    |> User.welcomed_changeset()
    |> Repo.update()
  end

  ## Token helper

  defp update_user_and_delete_all_tokens(changeset) do
    Repo.transact(fn ->
      with {:ok, user} <- Repo.update(changeset) do
        tokens_to_expire = Repo.all_by(UserToken, user_id: user.id)

        Repo.delete_all(from(t in UserToken, where: t.id in ^Enum.map(tokens_to_expire, & &1.id)))

        {:ok, {user, tokens_to_expire}}
      end
    end)
  end
end
