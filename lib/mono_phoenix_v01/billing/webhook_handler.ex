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
        current_period_end: unix_to_datetime(sub.current_period_end),
        billing_period: get_metadata_billing_period(session)
      })
    end

    :ok
  end

  defp dispatch("customer.subscription.updated", subscription) do
    with cus_id when is_binary(cus_id) <- get(subscription, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      attrs =
        %{
          subscription_status: normalize_status(get(subscription, "status"))
        }
        |> maybe_put_period_end(get(subscription, "current_period_end"))

      Accounts.update_subscription_status(user, attrs)
    end

    :ok
  end

  defp dispatch("customer.subscription.deleted", subscription) do
    with cus_id when is_binary(cus_id) <- get(subscription, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      Accounts.update_subscription_status(user, %{subscription_status: "canceled"})
    end

    :ok
  end

  defp dispatch("invoice.payment_failed", invoice) do
    with cus_id when is_binary(cus_id) <- get(invoice, "customer"),
         %_{} = user <- Accounts.get_user_by_stripe_customer_id(cus_id) do
      Accounts.update_subscription_status(user, %{subscription_status: "past_due"})
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
  defp get(map, key) when is_map(map) do
    Map.get(map, key) || Map.get(map, String.to_atom(key))
  end

  defp get(_, _), do: nil

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

  defp unix_to_datetime(unix) when is_integer(unix),
    do: DateTime.from_unix!(unix)

  defp unix_to_datetime(other), do: other

  # Stripe statuses → our internal vocabulary.
  defp normalize_status("active"), do: "active"
  defp normalize_status("past_due"), do: "past_due"
  defp normalize_status("canceled"), do: "canceled"
  defp normalize_status("unpaid"), do: "lapsed"
  defp normalize_status("incomplete_expired"), do: "lapsed"
  defp normalize_status(nil), do: nil
  defp normalize_status(other) when is_binary(other), do: other
end
