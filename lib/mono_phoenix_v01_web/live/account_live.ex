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
    <Layouts.app flash={@flash} current_scope={@current_scope}>
      <div class="mx-auto max-w-md space-y-4 account-container">
        <.header>Your account</.header>

        <dl class="account-fields space-y-2">
          <div>
            <dt class="font-semibold">Email</dt>
            <dd>{@user.email}</dd>
          </div>

          <div>
            <dt class="font-semibold">Subscription status</dt>
            <dd>{status_label(@user.subscription_status)}</dd>
          </div>

          <div :if={@user.current_period_end}>
            <dt class="font-semibold">Next renewal</dt>
            <dd>{Calendar.strftime(@user.current_period_end, "%B %-d, %Y")}</dd>
          </div>

          <div>
            <dt class="font-semibold">Plan</dt>
            <dd>{@user.billing_period || "—"}</dd>
          </div>
        </dl>

        <div class="account-actions flex flex-col gap-2 mt-4">
          <button phx-click="open_portal" class="btn btn-primary">
            Manage subscription
          </button>
          <.link href={~p"/users/settings"} class="btn btn-soft">
            Change email or password
          </.link>
          <.link href={~p"/users/log-out"} method="delete" class="btn btn-soft">
            Log out
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
