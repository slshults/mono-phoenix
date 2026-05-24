defmodule MonoPhoenixV01.FavoritesTest do
  use MonoPhoenixV01.DataCase, async: true

  import MonoPhoenixV01.AccountsFixtures

  alias MonoPhoenixV01.Favorites
  alias MonoPhoenixV01.Favorites.Favorite

  describe "add/2" do
    test "inserts a favorite" do
      user = user_fixture()

      assert {:ok, %Favorite{user_id: uid, monologue_id: 42}} = Favorites.add(user.id, 42)
      assert uid == user.id
    end

    test "is idempotent — second call with same args returns the existing row" do
      user = user_fixture()
      {:ok, first} = Favorites.add(user.id, 42)
      {:ok, second} = Favorites.add(user.id, 42)

      assert first.id == second.id
    end

    test "different users can favorite the same monologue" do
      u1 = user_fixture()
      u2 = user_fixture()

      assert {:ok, _} = Favorites.add(u1.id, 42)
      assert {:ok, _} = Favorites.add(u2.id, 42)
    end
  end

  describe "remove/2" do
    test "deletes the favorite" do
      user = user_fixture()
      {:ok, _} = Favorites.add(user.id, 42)

      assert :ok = Favorites.remove(user.id, 42)
      refute Favorites.favorited?(user.id, 42)
    end

    test "is idempotent — no-op on a non-existent favorite" do
      user = user_fixture()
      assert :ok = Favorites.remove(user.id, 99_999)
    end

    test "only removes the matching user's favorite" do
      u1 = user_fixture()
      u2 = user_fixture()
      {:ok, _} = Favorites.add(u1.id, 42)
      {:ok, _} = Favorites.add(u2.id, 42)

      :ok = Favorites.remove(u1.id, 42)

      refute Favorites.favorited?(u1.id, 42)
      assert Favorites.favorited?(u2.id, 42)
    end
  end

  describe "list_for_user/1" do
    test "returns the user's favorites ordered by inserted_at DESC" do
      user = user_fixture()
      {:ok, a} = Favorites.add(user.id, 10)
      # Force a measurable timestamp gap so the order is deterministic.
      :timer.sleep(1100)
      {:ok, b} = Favorites.add(user.id, 20)

      ids = Favorites.list_for_user(user.id) |> Enum.map(& &1.monologue_id)
      assert ids == [b.monologue_id, a.monologue_id]
    end

    test "scopes to the given user" do
      u1 = user_fixture()
      u2 = user_fixture()
      {:ok, _} = Favorites.add(u1.id, 10)
      {:ok, _} = Favorites.add(u2.id, 20)

      assert [%{monologue_id: 10}] = Favorites.list_for_user(u1.id)
      assert [%{monologue_id: 20}] = Favorites.list_for_user(u2.id)
    end

    test "returns [] for a user with no favorites" do
      user = user_fixture()
      assert [] = Favorites.list_for_user(user.id)
    end
  end

  describe "favorited?/2" do
    test "returns true when the favorite exists" do
      user = user_fixture()
      {:ok, _} = Favorites.add(user.id, 42)
      assert Favorites.favorited?(user.id, 42)
    end

    test "returns false otherwise" do
      user = user_fixture()
      refute Favorites.favorited?(user.id, 42)
    end
  end

  describe "favorited_ids_for/1" do
    test "returns a MapSet of monologue ids" do
      user = user_fixture()
      {:ok, _} = Favorites.add(user.id, 1)
      {:ok, _} = Favorites.add(user.id, 2)
      {:ok, _} = Favorites.add(user.id, 3)

      ids = Favorites.favorited_ids_for(user.id)
      assert %MapSet{} = ids
      assert MapSet.equal?(ids, MapSet.new([1, 2, 3]))
    end

    test "returns an empty MapSet for a user with no favorites" do
      user = user_fixture()
      assert Favorites.favorited_ids_for(user.id) == MapSet.new()
    end
  end
end
