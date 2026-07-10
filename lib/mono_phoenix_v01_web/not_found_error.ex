defmodule MonoPhoenixV01Web.NotFoundError do
  @moduledoc """
  Raised when a request path is well-formed but its dynamic segment can't
  match any record (e.g. a non-integer `:playid`). The `plug_status` makes
  Phoenix render the custom 404 page instead of a 500, which also lets
  `MonoPhoenixV01Web.NotFoundTracker` count the request as a 404.
  """
  defexception message: "not found", plug_status: 404
end
