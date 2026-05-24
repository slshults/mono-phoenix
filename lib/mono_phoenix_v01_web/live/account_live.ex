defmodule MonoPhoenixV01Web.AccountLive do
  @moduledoc """
  /account page — minimal subscription dashboard. Shows email,
  subscription status, current period end, and billing period. The
  "Manage subscription" button opens a Stripe Customer Portal session
  in a new browser context (cancel, update card, switch monthly/yearly
  all happen in the portal).
  """

  use MonoPhoenixV01Web, :live_view

  alias MonoPhoenixV01.Billing

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :page_title, "Your account")}
  end

  @impl true
  def handle_event("open_portal", _, socket) do
    case Billing.create_portal_session(socket.assigns.current_scope.user) do
      {:ok, %{url: url}} ->
        {:noreply, redirect(socket, external: url)}

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
          <p><strong>Subscription status:</strong> {status_label(@user.subscription_status)}</p>
          <p :if={@user.current_period_end}>
            <strong>Next renewal:</strong>
            {Calendar.strftime(@user.current_period_end, "%B %-d, %Y")}
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

  defp status_label("active"), do: "Active 🙏"
  defp status_label("past_due"), do: "Payment past due"
  defp status_label("canceled"), do: "Canceled"
  defp status_label("lapsed"), do: "Lapsed"
  defp status_label("pending_payment"), do: "Awaiting payment"
  defp status_label(nil), do: "—"
  defp status_label(other), do: other
end
