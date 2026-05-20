defmodule MonoPhoenixV01Web.LapsedLive do
  @moduledoc """
  /account/lapsed — renders the "Payment lapsed" modal for users whose
  subscription_status is canceled, lapsed, or past_due. They arrive
  here from UserAuth.maybe_log_in_user, which stashes their user id in
  the session but does NOT create a real auth session.

  Actions:
    - "Renew" → Stripe Checkout for the same billing_period (or yearly
      default if missing).
    - "Continue with ads" → home redirect; no session created.
  """

  use MonoPhoenixV01Web, :live_view

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Billing

  @impl true
  def mount(_params, %{"lapsed_user_id" => uid}, socket) do
    user = Accounts.get_user!(uid)
    {:ok, assign(socket, user: user, page_title: "Subscription lapsed")}
  end

  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> put_flash(:info, "Please log in to manage your subscription.")
     |> redirect(to: ~p"/")}
  end

  @impl true
  def handle_event("renew", _, socket) do
    user = socket.assigns.user
    period = user.billing_period || "yearly"

    with {:ok, user} <- Billing.ensure_stripe_customer(user),
         {:ok, %{url: url}} <- Billing.create_checkout_session(user, period) do
      {:noreply, redirect(socket, external: url)}
    else
      {:error, _reason} ->
        {:noreply,
         put_flash(
           socket,
           :error,
           "Couldn't start a checkout session. Please try again."
         )}
    end
  end

  def handle_event("continue_with_ads", _, socket) do
    {:noreply,
     socket
     |> clear_flash()
     |> redirect(to: ~p"/")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash} current_scope={@current_scope}>
      <div class="mx-auto max-w-md space-y-4 lapsed-modal">
        <.header>Your payment has lapsed.</.header>

        <div class="lapsed-actions flex flex-col gap-3 mt-4">
          <button phx-click="renew" class="btn btn-primary">
            Click here to renew and access your favorites
          </button>
          <p class="text-center text-sm text-gray-600">Or</p>
          <button phx-click="continue_with_ads" class="btn btn-soft">
            Continue with ads and without favorites
          </button>
        </div>
      </div>
    </Layouts.app>
    """
  end
end
