defmodule MonoPhoenixV01Web.PlayPage404Test do
  use MonoPhoenixV01Web.ConnCase, async: true

  test "non-integer playid renders a 404 instead of a 500", %{conn: conn} do
    for path <- ["/play/foobar", "/men/foobar", "/women/foobar"] do
      assert_error_sent 404, fn -> get(conn, path) end
    end
  end

  test "playid with trailing garbage renders a 404", %{conn: conn} do
    assert_error_sent 404, fn -> get(conn, "/play/13abc") end
  end

  test "non-positive playid renders a 404", %{conn: conn} do
    assert_error_sent 404, fn -> get(conn, "/play/0") end
  end
end
