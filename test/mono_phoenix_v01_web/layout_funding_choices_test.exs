defmodule MonoPhoenixV01Web.LayoutFundingChoicesTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import MonoPhoenixV01.AccountsFixtures

  # The FundingChoices block (CMP + ad-block-recovery) only renders on the
  # production host, so tests exercise it by overriding the conn host.
  @prod_host "www.shakespeare-monologues.org"
  @fc_marker "fundingchoicesmessages.google.com"

  # The PostHog init is TCF-gated (polls for __tcfapi) only when the FC CMP
  # renders; visitors without the CMP must get the direct-init branch or
  # PostHog never starts for them.
  @tcf_marker "__tcfapi('addEventListener'"

  test "anonymous visitor on the production host gets the FundingChoices scripts and TCF-gated PostHog init", %{conn: conn} do
    html =
      %{conn | host: @prod_host}
      |> get("/aboutus")
      |> html_response(200)

    assert html =~ @fc_marker
    assert html =~ @tcf_marker
  end

  test "patron on the production host gets no FundingChoices scripts and a direct PostHog init", %{conn: conn} do
    user = user_fixture()

    html =
      %{log_in_user(conn, user) | host: @prod_host}
      |> get("/aboutus")
      |> html_response(200)

    refute html =~ @fc_marker
    refute html =~ @tcf_marker
  end

  test "non-production host gets no FundingChoices scripts and a direct PostHog init", %{conn: conn} do
    html =
      conn
      |> get("/aboutus")
      |> html_response(200)

    refute html =~ @fc_marker
    refute html =~ @tcf_marker
  end
end
