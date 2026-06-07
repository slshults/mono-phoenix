defmodule MonoPhoenixV01Web.AccountLive do
  @moduledoc """
  /account page — minimal subscription dashboard. Shows email,
  subscription status, current period end, and billing period. The
  "Manage subscription" button opens a Stripe Customer Portal session
  in a new browser context (cancel, update card, switch monthly/yearly
  all happen in the portal).
  """

  use MonoPhoenixV01Web, :live_view

  require Logger

  alias MonoPhoenixV01.Billing
  alias MonoPhoenixV01Web.LiveFavoritesHelpers

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_scope.user

    {:ok,
     socket
     |> assign(:page_title, "Your account")
     |> assign(:cancel_scheduled, fetch_cancel_scheduled(user))}
  end

  # Stripe is the source of truth for "cancel scheduled" state — we don't
  # persist it locally. Only fetched while the subscription is still
  # active (after the period has ended, status flips to "canceled" and
  # we no longer need to ask). A failed Stripe call falls through to
  # false so the page still renders.
  #
  # Two signals from the Subscription object cover all the ways a
  # patron-initiated cancellation can land on a subscription:
  #
  #   * `cancel_at` — non-nil unix timestamp set whenever a cancel is
  #     scheduled (this is what the customer portal sets today). The
  #     legacy `cancel_at_period_end` boolean is NOT flipped by modern
  #     Stripe API versions for portal cancellations.
  #
  #   * `cancel_at_period_end: true` — kept as a belt-and-suspenders
  #     fallback for older API versions / future Stripe shape changes.
  defp fetch_cancel_scheduled(%{
         subscription_status: "active",
         stripe_subscription_id: sub_id
       })
       when is_binary(sub_id) and sub_id != "" do
    case Billing.retrieve_subscription(sub_id) do
      {:ok, sub} ->
        not is_nil(sub.cancel_at) or sub.cancel_at_period_end == true

      {:error, reason} ->
        Logger.warning(
          "/account: Stripe retrieve_subscription failed for sub_id=#{sub_id}: #{inspect(reason)}"
        )

        false
    end
  end

  defp fetch_cancel_scheduled(_), do: false

  @impl true
  def handle_event("open_portal", _, socket) do
    user = socket.assigns.current_scope.user

    case Billing.create_portal_session(user) do
      {:ok, %{url: url}} ->
        {:noreply,
         socket
         |> LiveFavoritesHelpers.push_posthog("portal_opened", %{
           subscription_status: user.subscription_status,
           billing_period: user.billing_period
         })
         |> redirect(external: url)}

      {:error, _reason} ->
        {:noreply,
         put_flash(
           socket,
           :error,
           "We couldn't open the billing portal. Please try again or contact us."
         )}
    end
  end

  @impl true
  def render(assigns) do
    user = assigns.current_scope.user
    assigns = assign(assigns, :user, user)

    ~H"""
    <Layouts.app flash={@flash} current_scope={@current_scope} page_class="account-page">
      <div class="account-container space-y-4">
        <.header>Your account</.header>

        <div class="account-fields space-y-2">
          <p><strong>Email:</strong> {@user.email}</p>
          <p>
            <strong>Subscription status:</strong>
            {status_label(@user.subscription_status, @cancel_scheduled)}
          </p>
          <p :if={@user.current_period_end}>
            <strong>Next renewal:</strong>
            {renewal_label(@user.current_period_end, @cancel_scheduled)}
          </p>
          <p><strong>Plan:</strong> {@user.billing_period || "—"}</p>
        </div>

        <div class="account-actions flex gap-2 mt-4">
          <button phx-click="open_portal" class="btn btn-primary">
            Manage subscription
          </button>
          <.link href={~p"/users/settings"} class="btn btn-soft">
            Change email or password
          </.link>
        </div>
      </div>
    </Layouts.app>
    """
  end

  defp status_label("active", true), do: "Cancelled at the end of the current period"
  defp status_label(status, _cancel_scheduled), do: status_label(status)

  defp status_label("active"), do: "Active 🙏"
  defp status_label("past_due"), do: "Payment past due"
  defp status_label("canceled"), do: "Canceled"
  defp status_label("lapsed"), do: "Lapsed"
  defp status_label("pending_payment"), do: "Awaiting payment"
  defp status_label(nil), do: "—"
  defp status_label(other), do: other

  defp renewal_label(_date, true), do: "Cancelled"
  defp renewal_label(%DateTime{} = date, _), do: Calendar.strftime(date, "%B %-d, %Y")
  defp renewal_label(_, _), do: "—"
end
