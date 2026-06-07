defmodule MonoPhoenixV01.Billing.WebhookHandler do
  @moduledoc """
  Dispatches verified Stripe webhook events to Accounts updates.

  Returns `:ok` for every event (recognized or not) so the controller
  can always respond 200 to Stripe. Unrecognized events are logged but
  not error'd — Stripe retries 4xx/5xx, so we want recognized events to
  succeed and unrecognized ones to be acknowledged.

  ## Data shape

  `stripity_stripe` 3.x leaves `Stripe.Event.data` as a bare map (a
  `term` type — not decoded into typed structs). So we access
  `event.data["object"]` (a map with string keys) and pluck fields like
  `obj["customer"]`, `obj["subscription"]`, `obj["status"]`, etc.
  """

  require Logger

  alias MonoPhoenixV01.Accounts
  alias MonoPhoenixV01.Billing
  alias MonoPhoenixV01.PostHog

  @doc """
  Handle a verified Stripe event. Always returns `:ok`.
  """
  def handle(%Stripe.Event{type: type, data: data}) do
    object = extract_object(data)
    dispatch(type, object)
  end

  def handle(other) do
    Logger.warning("WebhookHandler: ignoring malformed event #{inspect(other)}")
    :ok
  end

  defp extract_object(%{"object" => object}), do: object
  defp extract_object(%{object: object}), do: object
  defp extract_object(_), do: %{}

  defp dispatch("checkout.session.completed", session) do
    with cus_id when is_binary(cus_id) <- get(session, "customer"),
         sub_id when is_binary(sub_id) <- get(session, "subscription"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id),
         {:ok, sub} <- Billing.retrieve_subscription(sub_id) do
      Accounts.mark_subscription_active(user, %{
        stripe_subscription_id: sub.id,
        current_period_end: unix_to_datetime(Billing.current_period_end_unix(sub)),
        billing_period: get_metadata_billing_period(session)
      })
    end

    :ok
  end

  defp dispatch("customer.subscription.updated", subscription) do
    with cus_id when is_binary(cus_id) <- get(subscription, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      previous_status = user.subscription_status
      new_status = normalize_status(get(subscription, "status"))

      attrs =
        %{
          subscription_status: new_status,
          cancel_at_period_end: extract_cancel_at_period_end(subscription)
        }
        |> maybe_put_period_end(Billing.current_period_end_unix(subscription))

      case update_status(user, attrs) do
        {:ok, updated_user} ->
          track_subscription_updated(updated_user, previous_status)

        _ ->
          :ok
      end
    end

    :ok
  end

  defp dispatch("customer.subscription.deleted", subscription) do
    with cus_id when is_binary(cus_id) <- get(subscription, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      case update_status(user, %{
             subscription_status: "canceled",
             current_period_end: nil,
             cancel_at_period_end: false
           }) do
        {:ok, updated_user} -> track_subscription_canceled(updated_user)
        _ -> :ok
      end
    end

    :ok
  end

  defp dispatch("invoice.payment_failed", invoice) do
    with cus_id when is_binary(cus_id) <- get(invoice, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      case update_status(user, %{subscription_status: "past_due"}) do
        {:ok, updated_user} -> track_subscription_payment_failed(updated_user)
        _ -> :ok
      end
    end

    :ok
  end

  defp dispatch("checkout.session.expired", session) do
    with cus_id when is_binary(cus_id) <- get(session, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      Accounts.delete_pending_user(user)
    end

    :ok
  end

  defp dispatch(type, _object) do
    Logger.info("Stripe webhook: ignoring event type #{type}")
    :ok
  end

  # Helpers — Stripe payloads can come back with string-key maps or
  # struct-like atom-key maps depending on source (live vs test fixtures).
  # `String.to_existing_atom` (not `to_atom`) so untrusted webhook input
  # can never inflate the atom table.
  defp get(map, key) when is_map(map) do
    Map.get(map, key) || atom_lookup(map, key)
  end

  defp get(_, _), do: nil

  defp atom_lookup(map, key) do
    Map.get(map, String.to_existing_atom(key))
  rescue
    ArgumentError -> nil
  end

  defp get_metadata_billing_period(session) do
    case get(session, "metadata") do
      %{} = metadata -> get(metadata, "billing_period")
      _ -> nil
    end
  end

  defp maybe_put_period_end(attrs, nil), do: attrs

  defp maybe_put_period_end(attrs, unix) when is_integer(unix) do
    Map.put(attrs, :current_period_end, unix_to_datetime(unix))
  end

  defp maybe_put_period_end(attrs, _), do: attrs

  # Pulls `cancel_at_period_end` from a Stripe subscription payload. Falls
  # back to false so we explicitly overwrite the user row on every event —
  # this is what handles the "Don't cancel subscription" path (Stripe fires
  # subscription.updated with cancel_at_period_end: false; we need to clear
  # any stale true value the row was carrying).
  defp extract_cancel_at_period_end(subscription) do
    case get(subscription, "cancel_at_period_end") do
      true -> true
      _ -> false
    end
  end

  defp unix_to_datetime(unix) when is_integer(unix),
    do: DateTime.from_unix!(unix)

  defp unix_to_datetime(other), do: other

  # Stripe statuses → our internal vocabulary. Stripe's subscription
  # status enum is: trialing, active, past_due, canceled, unpaid,
  # incomplete, incomplete_expired, paused. We collapse them into our
  # five-value vocabulary (pending_payment / active / past_due /
  # canceled / lapsed).
  defp normalize_status("active"), do: "active"
  defp normalize_status("trialing"), do: "active"
  defp normalize_status("past_due"), do: "past_due"
  defp normalize_status("canceled"), do: "canceled"
  defp normalize_status("unpaid"), do: "lapsed"
  defp normalize_status("incomplete_expired"), do: "lapsed"
  defp normalize_status("paused"), do: "lapsed"
  defp normalize_status("incomplete"), do: "pending_payment"
  defp normalize_status(nil), do: nil
  defp normalize_status(other) when is_binary(other), do: other

  # Update the user's subscription state, logging any changeset failure
  # so a future drift between Stripe's enum and our normalize_status/1
  # mapping doesn't silently swallow state changes. The caller may use
  # the updated row to fire PostHog lifecycle events; on failure we
  # return `:error` so no event is sent against stale state.
  defp update_status(user, attrs) do
    case Accounts.update_subscription_status(user, attrs) do
      {:ok, updated_user} ->
        {:ok, updated_user}

      {:error, changeset} ->
        Logger.error(
          "webhook update_subscription_status failed for user_id=#{user.id} " <>
            "attrs=#{inspect(attrs)} errors=#{inspect(changeset.errors)}"
        )

        :error
    end
  end

  # PostHog tracking for subscription lifecycle events. Server-side
  # capture with distinct_id = user.id, plus a refresh of person
  # properties via `$set` so the user's profile in PostHog mirrors the
  # row we just persisted.
  #
  # `customer.subscription.updated` fires for many reasons (status
  # changes, plan switches, billing-cycle rollovers, payment-method
  # edits). To keep the event stream meaningful we only emit a
  # lifecycle event when the status actually flipped — and only emit
  # `subscription_renewed` for the recovery case (lapsed/past_due/
  # canceled → active). The brand-new-patron transition
  # (pending_payment → active) is covered by `signup_completed` from
  # the /signup/success controller, so we ignore it here to avoid
  # double-counting conversions. We still refresh person props on
  # every status flip so the PostHog profile stays accurate.
  @recoverable_from ~w(past_due lapsed canceled)

  defp track_subscription_updated(user, previous_status) do
    cond do
      previous_status == user.subscription_status ->
        :ok

      previous_status in @recoverable_from and user.subscription_status == "active" ->
        identify_and_capture(user, "subscription_renewed", %{
          previous_status: previous_status,
          subscription_status: user.subscription_status
        })

      true ->
        # Status changed but it isn't a renewal — refresh person props
        # without firing an event so we don't drown out the signal.
        refresh_person_props(user)
    end
  end

  defp refresh_person_props(user) do
    PostHog.identify(user.email,
      set: %{
        email: user.email,
        user_id: user.id,
        subscription_status: user.subscription_status,
        billing_period: user.billing_period,
        current_period_end: iso8601(user.current_period_end)
      }
    )
  end

  defp track_subscription_canceled(user) do
    identify_and_capture(user, "subscription_canceled", %{
      subscription_status: user.subscription_status
    })
  end

  defp track_subscription_payment_failed(user) do
    identify_and_capture(user, "subscription_payment_failed", %{
      subscription_status: user.subscription_status
    })
  end

  defp identify_and_capture(user, event_name, properties) do
    PostHog.identify(user.email,
      set: %{
        email: user.email,
        user_id: user.id,
        subscription_status: user.subscription_status,
        billing_period: user.billing_period,
        current_period_end: iso8601(user.current_period_end)
      }
    )

    PostHog.capture(
      event_name,
      properties
      |> Map.put(:billing_period, user.billing_period)
      |> Map.put(:user_id, user.id),
      distinct_id: user.email
    )
  end

  defp iso8601(nil), do: nil
  defp iso8601(%DateTime{} = dt), do: DateTime.to_iso8601(dt)
  defp iso8601(_), do: nil
end
