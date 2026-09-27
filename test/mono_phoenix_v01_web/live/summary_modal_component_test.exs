defmodule MonoPhoenixV01Web.SummaryModalComponentTest do
  # Calls the component's callbacks directly with a bare socket. The failure
  # path can't be driven through a LiveView here without making real Anthropic
  # calls, and these callbacks are where the error UI and Retry live.
  use ExUnit.Case, async: true

  alias MonoPhoenixV01Web.SummaryModalComponent

  defp socket(assigns) do
    %Phoenix.LiveView.Socket{assigns: Map.put(assigns, :__changed__, %{})}
  end

  describe "update/2 with action \"error_occurred\"" do
    test "stops the spinner and shows the standard message instead of any raw error" do
      {:ok, socket} =
        SummaryModalComponent.update(
          %{action: "error_occurred", error: "API error 401: %{\"type\" => \"authentication_error\"}"},
          socket(%{loading: true, error: nil, canceled: false})
        )

      refute socket.assigns.loading
      assert socket.assigns.error =~ "Please try again"
      refute socket.assigns.error =~ "401"
    end

    test "is ignored once the reader has cancelled" do
      {:ok, socket} =
        SummaryModalComponent.update(
          %{action: "error_occurred"},
          socket(%{loading: false, error: nil, canceled: true})
        )

      assert socket.assigns.error == nil
    end
  end

  describe "update/2 with action \"show_paraphrasing\"" do
    test "keeps character and location for Retry, so its analytics aren't null" do
      {:ok, socket} =
        SummaryModalComponent.update(
          %{action: "show_paraphrasing", monologue_id: "89", monologue_text: "Think not I love him", character: "Phebe", location: "III v 111"},
          socket(%{})
        )

      assert socket.assigns.generation_params ==
               %{monologue_id: "89", monologue_text: "Think not I love him", character: "Phebe", location: "III v 111"}
    end
  end

  describe "handle_event(\"retry_generation\", ...)" do
    test "asks the host LiveView (self()) to regenerate with the 5-tuple its handlers match" do
      params = %{monologue_id: "93", monologue_text: "Charles, I thank thee for thy love to me,"}

      {:noreply, socket} =
        SummaryModalComponent.handle_event(
          "retry_generation",
          %{},
          socket(%{
            id: "summary-modal",
            content_type: "Paraphrasing",
            generation_params: params,
            loading: false,
            error: "Sorry, this couldn't be generated right now. Please try again in a moment."
          })
        )

      assert socket.assigns.loading
      assert socket.assigns.error == nil
      assert_received {:generate_summary, "paraphrasing", ^params, "summary-modal", "retry:paraphrasing:" <> _}
    end

    test "ignores a second click while the first retry is still generating" do
      {:noreply, _socket} =
        SummaryModalComponent.handle_event(
          "retry_generation",
          %{},
          socket(%{
            id: "summary-modal",
            content_type: "Play Summary",
            generation_params: %{play_title: "Cymbeline"},
            loading: true,
            error: nil
          })
        )

      refute_received {:generate_summary, _, _, _, _}
    end
  end
end
