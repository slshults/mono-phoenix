defmodule MonoPhoenixV01.SitemapTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01.Sitemap

  # play 10: has Men (3) and Women (2) monologues
  # play 20: has only a "Both" (1) monologue — Both appears on BOTH men & women pages
  # play 30: has only a Men (3) monologue — no women page
  @monos [
    %{id: 1, play_id: 10, gender_id: 3, updated_at: ~N[2015-01-01 00:00:00]},
    %{id: 2, play_id: 10, gender_id: 2, updated_at: ~N[2016-06-01 00:00:00]},
    %{id: 3, play_id: 20, gender_id: 1, updated_at: ~N[2014-01-01 00:00:00]},
    %{id: 4, play_id: 30, gender_id: 3, updated_at: ~N[2013-01-01 00:00:00]}
  ]

  defp locs, do: @monos |> Sitemap.build_entries() |> Enum.map(& &1.loc)

  test "includes every monologue permalink" do
    for id <- [1, 2, 3, 4] do
      assert "https://www.shakespeare-monologues.org/monologues/#{id}" in locs()
    end
  end

  test "includes hub pages" do
    for path <- ["/home", "/plays", "/mens", "/womens"] do
      assert "https://www.shakespeare-monologues.org#{path}" in locs()
    end
  end

  test "emits /play/N for every play, and gender pages only where that gender exists" do
    l = locs()
    # play 10 has both genders
    assert "https://www.shakespeare-monologues.org/play/10" in l
    assert "https://www.shakespeare-monologues.org/men/10" in l
    assert "https://www.shakespeare-monologues.org/women/10" in l

    # play 20's only monologue is "Both" → appears on men AND women
    assert "https://www.shakespeare-monologues.org/men/20" in l
    assert "https://www.shakespeare-monologues.org/women/20" in l

    # play 30 is men-only → no women page
    assert "https://www.shakespeare-monologues.org/men/30" in l
    refute "https://www.shakespeare-monologues.org/women/30" in l
  end

  test "floors each lastmod at the site-rebuild date (never the stale 2023)" do
    entries = Sitemap.build_entries(@monos)
    entry = Enum.find(entries, &(&1.loc == "https://www.shakespeare-monologues.org/monologues/2"))
    # data date is 2016, but the page was rebuilt more recently, so lastmod is newer
    assert Date.compare(entry.lastmod, ~D[2016-06-01]) == :gt
    # the old bug stamped everything 2023-03-30
    refute entry.lastmod == ~D[2023-03-30]
    # every entry (hubs, plays, monologues) reads recent — none stale
    assert Enum.all?(entries, &(Date.compare(&1.lastmod, ~D[2020-01-01]) == :gt))
  end

  test "render/1 produces a well-formed urlset with loc and lastmod, no stale date" do
    xml = @monos |> Sitemap.build_entries() |> Sitemap.render()
    assert xml =~ ~s(<?xml version="1.0" encoding="UTF-8"?>)
    assert xml =~ "<urlset"
    assert xml =~ "<loc>https://www.shakespeare-monologues.org/monologues/1</loc>"
    assert xml =~ "<lastmod>"
    refute xml =~ "2023-03-30"
  end
end
