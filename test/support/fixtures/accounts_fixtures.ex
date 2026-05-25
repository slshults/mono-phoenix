defmodule MonoPhoenixV01.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `MonoPhoenixV01.Accounts` context.
  """

  import Ecto.Query

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Accounts.Scope

  def unique_user_email, do: "user#{System.unique_integer()}@example.com"
  def valid_user_password, do: "hello world!"

  def valid_user_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      email: unique_user_email()
    })
  end

  def unconfirmed_user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> valid_user_attributes()
      |> Accounts.register_user()

    user
  end

  def user_fixture(attrs \\ %{}) do
    user = unconfirmed_user_fixture(attrs)

    token =
      extract_user_token(fn url ->
        Accounts.deliver_login_instructions(user, url)
      end)

    {:ok, {user, _expired_tokens}} =
      Accounts.login_user_by_magic_link(token)

    # In tests we treat fully-confirmed users as having an active
    # subscription, so the Phase-2 lapsed-gating in UserAuth doesn't
    # redirect them to /account/lapsed. Tests that specifically need
    # other subscription states should call `lapsed_user_fixture/0`
    # or update the row directly.
    make_active(user)
  end

  @doc """
  Flip a user to status="active" with a synthetic stripe_subscription_id
  so tests that go through `UserAuth.maybe_log_in_user` get a real
  session instead of the lapsed-modal redirect.
  """
  def make_active(user) do
    user
    |> Ecto.Changeset.change(%{
      subscription_status: "active",
      stripe_customer_id: "cus_test_#{user.id}",
      stripe_subscription_id: "sub_test_#{user.id}",
      current_period_end: DateTime.utc_now() |> DateTime.add(30, :day) |> DateTime.truncate(:second),
      billing_period: "yearly"
    })
    |> MonoPhoenixV01.Accounts.Repo.update!()
  end

  @doc """
  Fixture for a user whose subscription has lapsed (canceled). Tests
  exercising the lapsed-modal path use this.
  """
  def lapsed_user_fixture(attrs \\ %{}) do
    user = user_fixture(attrs)

    user
    |> Ecto.Changeset.change(%{subscription_status: "canceled"})
    |> MonoPhoenixV01.Accounts.Repo.update!()
  end

  @doc """
  Fixture for a user still in pending_payment (hasn't completed Stripe
  Checkout yet).
  """
  def pending_user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        "email" => unique_user_email(),
        "billing_period" => "yearly"
      })
      |> Accounts.create_pending_user()

    user
  end

  def user_scope_fixture do
    user = user_fixture()
    user_scope_fixture(user)
  end

  def user_scope_fixture(user) do
    Scope.for_user(user)
  end

  def set_password(user) do
    {:ok, {user, _expired_tokens}} =
      Accounts.update_user_password(user, %{password: valid_user_password()})

    user
  end

  def extract_user_token(fun) do
    {:ok, captured_email} = fun.(&"[TOKEN]#{&1}[TOKEN]")
    [_, token | _] = String.split(captured_email.text_body, "[TOKEN]")
    token
  end

  def override_token_authenticated_at(token, authenticated_at) when is_binary(token) do
    MonoPhoenixV01.Accounts.Repo.update_all(
      from(t in Accounts.UserToken,
        where: t.token == ^token
      ),
      set: [authenticated_at: authenticated_at]
    )
  end

  def generate_user_magic_link_token(user) do
    {encoded_token, user_token} = Accounts.UserToken.build_email_token(user, "login")
    MonoPhoenixV01.Accounts.Repo.insert!(user_token)
    {encoded_token, user_token.token}
  end

  def offset_user_token(token, amount_to_add, unit) do
    dt = NaiveDateTime.add(NaiveDateTime.utc_now(:second), amount_to_add, unit)

    MonoPhoenixV01.Accounts.Repo.update_all(
      from(ut in Accounts.UserToken, where: ut.token == ^token),
      set: [inserted_at: dt, authenticated_at: dt]
    )
  end
end
