defmodule MonoPhoenixV01.Favorites do
  @moduledoc """
  Patron favorites (Phase 4). Favorites live on the Accounts DB
  (`MonoPhoenixV01.Accounts.Repo`); `monologue_id` is a bare integer
  pointing at the monologues table on the main DB — Ecto can't enforce
  a cross-DB FK, so stale rows are accepted as a low-frequency edge case
  and filtered at read time on the /favorites page.
  """

  import Ecto.Query

  alias MonoPhoenixV01.Accounts.Repo
  alias MonoPhoenixV01.Favorites.Favorite

  @doc """
  Lists a user's favorites ordered by inserted_at DESC. Returns a list of
  `Favorite` structs.
  """
  def list_for_user(user_id) do
    from(f in Favorite,
      where: f.user_id == ^user_id,
      order_by: [desc: f.inserted_at]
    )
    |> Repo.all()
  end

  @doc """
  Idempotent insert: if the user already has this monologue favorited,
  returns the existing row. Otherwise inserts and returns the new row.
  """
  def add(user_id, monologue_id) do
    case Repo.get_by(Favorite, user_id: user_id, monologue_id: monologue_id) do
      nil ->
        %Favorite{}
        |> Favorite.changeset(%{user_id: user_id, monologue_id: monologue_id})
        |> Repo.insert()

      existing ->
        {:ok, existing}
    end
  end

  @doc """
  Idempotent delete: no-op if the favorite doesn't exist. Always returns `:ok`.
  """
  def remove(user_id, monologue_id) do
    from(f in Favorite,
      where: f.user_id == ^user_id and f.monologue_id == ^monologue_id
    )
    |> Repo.delete_all()

    :ok
  end

  @doc """
  Boolean check for a single (user, monologue) pair.
  """
  def favorited?(user_id, monologue_id) do
    Repo.exists?(
      from f in Favorite,
        where: f.user_id == ^user_id and f.monologue_id == ^monologue_id
    )
  end

  @doc """
  Returns a MapSet of monologue_ids the user has favorited. Pages that
  render many monologues call this once at mount so each card can decide
  outline-vs-filled without a per-card DB query.
  """
  def favorited_ids_for(user_id) do
    from(f in Favorite, where: f.user_id == ^user_id, select: f.monologue_id)
    |> Repo.all()
    |> MapSet.new()
  end
end
