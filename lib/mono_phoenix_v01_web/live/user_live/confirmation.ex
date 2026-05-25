defmodule MonoPhoenixV01Web.UserLive.Confirmation do
  use MonoPhoenixV01Web, :live_view

  alias MonoPhoenixV01.Accounts

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash} current_scope={@current_scope}>
      <div class="mx-auto max-w-md text-center">
        <.header>
          Log in to Shakespeare's Monologues
        </.header>

        <p class="mt-4">
          Click the button below to finish signing in as
          <strong>{@user.email}</strong>.
        </p>

        <.form
          :if={!@user.confirmed_at}
          for={@form}
          id="confirmation_form"
          phx-mounted={JS.focus_first()}
          phx-submit="submit"
          action={~p"/users/log-in?_action=confirmed"}
          phx-trigger-action={@trigger_submit}
          class="mt-4"
        >
          <input type="hidden" name={@form[:token].name} value={@form[:token].value} />
          <input name={@form[:remember_me].name} type="hidden" value="true" />
          <.button phx-disable-with="Logging in..." class="btn btn-primary w-full">
            Continue
          </.button>
        </.form>

        <.form
          :if={@user.confirmed_at}
          for={@form}
          id="login_form"
          phx-submit="submit"
          phx-mounted={JS.focus_first()}
          action={~p"/users/log-in"}
          phx-trigger-action={@trigger_submit}
          class="mt-4"
        >
          <input type="hidden" name={@form[:token].name} value={@form[:token].value} />
          <input name={@form[:remember_me].name} type="hidden" value="true" />
          <.button phx-disable-with="Logging in..." class="btn btn-primary w-full">
            Continue
          </.button>
        </.form>
      </div>
    </Layouts.app>
    """
  end

  @impl true
  def mount(%{"token" => token}, _session, socket) do
    if user = Accounts.get_user_by_magic_link_token(token) do
      form = to_form(%{"token" => token}, as: "user")

      {:ok, assign(socket, user: user, form: form, trigger_submit: false),
       temporary_assigns: [form: nil]}
    else
      {:ok,
       socket
       |> put_flash(:error, "Magic link is invalid or it has expired.")
       |> push_navigate(to: ~p"/users/log-in")}
    end
  end

  @impl true
  def handle_event("submit", %{"user" => params}, socket) do
    {:noreply, assign(socket, form: to_form(params, as: "user"), trigger_submit: true)}
  end
end
