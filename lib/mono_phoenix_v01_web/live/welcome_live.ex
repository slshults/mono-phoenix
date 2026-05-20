defmodule MonoPhoenixV01Web.WelcomeLive do
  @moduledoc """
  Landing page after Stripe Checkout success. Auto-login has already
  happened in `SignupController.success/2`. We show a thank-you message
  and a one-time, dismissable "set a password?" prompt.

  Once dismissed (either by clicking "Set a password" or "Skip"), the
  user's `welcomed_at` is set and the prompt never appears again.
  """

  use MonoPhoenixV01Web, :live_view

  alias MonoPhoenixV01.Accounts

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_scope.user

    {:ok,
     socket
     |> assign(:page_title, "Welcome")
     |> assign(:show_prompt, is_nil(user.welcomed_at))}
  end

  @impl true
  def handle_event("skip", _, socket) do
    {:ok, _user} = Accounts.mark_welcomed(socket.assigns.current_scope.user)
    {:noreply, push_navigate(socket, to: ~p"/")}
  end

  def handle_event("set_password", _, socket) do
    {:ok, _user} = Accounts.mark_welcomed(socket.assigns.current_scope.user)
    {:noreply, push_navigate(socket, to: ~p"/users/settings")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash} current_scope={@current_scope}>
      <div class="mx-auto max-w-md space-y-4 welcome-container">
        <div class="text-center">
          <.header>
            Welcome! Thanks for supporting the site 🙏
          </.header>
        </div>

        <%= if @show_prompt do %>
          <div class="welcome-prompt space-y-3">
            <p class="font-semibold">Want to set a password for next time?</p>
            <p class="text-sm text-gray-700">
              You can also just have us email you a one-time sign-in link whenever
              you come back — works fine, no password to remember.
            </p>
            <div class="welcome-actions flex flex-col gap-2">
              <button phx-click="set_password" class="btn btn-primary">
                Set a password
              </button>
              <button phx-click="skip" class="btn btn-soft">
                Skip — email me a link when I want to sign in
              </button>
            </div>
          </div>
        <% else %>
          <p class="text-center">
            You're all set. <.link href={~p"/"}>Back to the site →</.link>
          </p>
        <% end %>
      </div>
    </Layouts.app>
    """
  end
end
