defmodule MonoPhoenixV01Web.LayoutFundingChoicesTest do
  use MonoPhoenixV01Web.ConnCase, async: true

  import MonoPhoenixV01.AccountsFixtures

  # The FundingChoices block (CMP + ad-block-recovery) only renders on the
  # production host, so tests exercise it by overriding the conn host.
  @prod_host "www.shakespeare-monologues.org"
  @fc_marker "fundingchoicesmessages.google.com"

  test "anonymous visitor on the production host gets the FundingChoices scripts", %{conn: conn} do
    html =
      %{conn | host: @prod_host}
      |> get("/aboutus")
      |> html_response(200)

    assert html =~ @fc_marker
  end

  test "patron on the production host gets no FundingChoices scripts", %{conn: conn} do
    user = user_fixture()

    html =
      %{log_in_user(conn, user) | host: @prod_host}
      |> get("/aboutus")
      |> html_response(200)

    refute html =~ @fc_marker
  end

  test "non-production host gets no FundingChoices scripts", %{conn: conn} do
    html =
      conn
      |> get("/aboutus")
      |> html_response(200)

    refute html =~ @fc_marker
  end
end
