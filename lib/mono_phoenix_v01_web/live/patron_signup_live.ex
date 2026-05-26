defmodule MonoPhoenixV01Web.PatronSignupLive do
  use MonoPhoenixV01Web, :live_view

  require Logger

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Accounts.User
  alias MonoPhoenixV01.Billing
  alias MonoPhoenixV01Web.LiveFavoritesHelpers

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash} current_scope={@current_scope}>
      <div class="mx-auto max-w-md space-y-4 signup-container">
        <div class="text-center">
          <.header>
            Support the site
            <:subtitle>
              to remove all ads and use favorites
            </:subtitle>
          </.header>
        </div>

        <%= if @already_active_email do %>
          <div class="alert alert-info" id="already-active-modal">
            <h2 class="font-semibold">You already have an account.</h2>
            <p>
              An account with <strong>{@already_active_email}</strong> already exists.
            </p>
            <div class="mt-3 flex gap-2">
              <.link href={~p"/users/log-in"} class="btn btn-primary">Log in</.link>
              <.link href={~p"/users/log-in"} class="btn btn-soft">Reset password</.link>
            </div>
          </div>
        <% else %>
          <.form for={@form} id="patron_signup_form" phx-change="validate" phx-submit="submit">
            <fieldset class="mt-4">
              <legend class="font-medium mb-2">Choose your support level</legend>
              <label class="block">
                <input
                  type="radio"
                  name="user[billing_period]"
                  value="monthly"
                  checked={@billing_period == "monthly"}
                /> $1.25 per month
              </label>
              <label class="block">
                <input
                  type="radio"
                  name="user[billing_period]"
                  value="yearly"
                  checked={@billing_period == "yearly"}
                /> $10 per year (best value)
              </label>
              <p :for={error <- billing_period_errors(@form)} class="mt-1 text-sm text-red-600">
                {error}
              </p>
            </fieldset>

            <div class="privacy-block text-sm text-gray-700 mt-4 mb-4">
              <p>
                We'll use your email only for login and billing-related stuff.
                We will not sell, share, or spam your email address.
              </p>
              <p class="mt-2">
                Cancel anytime (no refunds, full or partial.) By signing up you are
                agreeing to auto-renewal payments (either $1.25/month, or $10/year,
                whichever you choose on the next screen) until you cancel.
              </p>
            </div>

            <.input
              field={@form[:email]}
              type="email"
              label="Email"
              autocomplete="username"
              required
              phx-mounted={JS.focus()}
            />

            <div class="instructional text-sm text-gray-700 mt-4 mb-4">
              <p>
                We're not going to make you verify your email address, but it is <strong>very important</strong> you enter a
                real email address, and enter it correctly, in case you forget your password. You also need to use a real email address so you can
                cancel payments in the future.
              </p>
            </div>

            <.button
              phx-disable-with="Redirecting to payment…"
              class="btn btn-primary mt-3"
            >
              Support the site →
            </.button>
          </.form>
        <% end %>
      </div>
    </Layouts.app>
    """
  end

  @impl true
  def mount(_params, _session, socket) do
    changeset = User.signup_changeset(%User{}, %{"billing_period" => "monthly"})

    {:ok,
     socket
     |> assign(:page_title, "Support the site")
     |> assign(:already_active_email, nil)
     |> assign(:billing_period, "monthly")
     |> assign(:show_ph_widget, true)
     |> assign(:hide_launch_promo, true)
     |> assign_form(changeset)
     |> LiveFavoritesHelpers.push_posthog("signup_page_viewed", %{
       default_billing_period: "monthly"
     })}
  end

  @impl true
  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset =
      %User{}
      |> User.signup_changeset(user_params)
      |> Map.put(:action, :validate)

    {:noreply,
     socket
     |> assign(:billing_period, user_params["billing_period"] || socket.assigns.billing_period)
     |> assign_form(changeset)}
  end

  def handle_event("submit", %{"user" => user_params}, socket) do
    case Accounts.create_pending_user(user_params) do
      {:ok, user} ->
        case start_checkout(user, user_params["billing_period"]) do
          {:ok, %{url: url}} ->
            socket =
              LiveFavoritesHelpers.push_posthog(socket, "signup_checkout_started", %{
                user_id: user.id,
                billing_period: user_params["billing_period"]
              })

            {:noreply, redirect(socket, external: url)}

          {:error, reason} ->
            Logger.error(
              "PatronSignupLive checkout failed for user_id=#{user.id} (#{user.email}): #{inspect(reason)}"
            )

            {:noreply,
             socket
             |> put_flash(
               :error,
               "Something went wrong setting up your payment. Please try again."
             )
             |> assign_form(User.signup_changeset(%User{}, user_params))}
        end

      {:error, :already_active} ->
        {:noreply, assign(socket, :already_active_email, user_params["email"])}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, Map.put(changeset, :action, :validate))}
    end
  end

  defp start_checkout(user, billing_period) do
    with {:ok, user} <- Billing.ensure_stripe_customer(user),
         {:ok, session} <- Billing.create_checkout_session(user, billing_period) do
      {:ok, session}
    end
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    form = to_form(changeset, as: "user")
    assign(socket, :form, form)
  end

  defp billing_period_errors(form) do
    case form[:billing_period].errors do
      [] ->
        []

      errors ->
        Enum.map(errors, fn {msg, opts} ->
          Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
            opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
          end)
        end)
    end
  end
end
