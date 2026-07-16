defmodule MonoPhoenixV01.MonologueMetaTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01.MonologueMeta

  @row %{
    monologues: 360,
    id: 14,
    character: "Ariel",
    firstline: "You are three men of sin, whom Destiny",
    play: "The Tempest",
    style: "Verse",
    location: "III iii 69",
    body: "You are three men of sin,<br>\r\n  whom Destiny&nbsp;that hath to instrument"
  }

  describe "title/1" do
    test "puts character, first line, and play in a search-friendly order" do
      assert MonologueMeta.title(@row) ==
               ~s(Ariel — "You are three men of sin, whom Destiny" | The Tempest)
    end
  end

  describe "parse_location/1" do
    test "splits roman act/scene and numeric line into integers" do
      assert MonologueMeta.parse_location("III iii 69") == %{act: 3, scene: 3, line: 69}
      assert MonologueMeta.parse_location("II i") == %{act: 2, scene: 1, line: nil}
      assert MonologueMeta.parse_location("Prologue") == %{act: nil, scene: nil, line: nil}
      assert MonologueMeta.parse_location(nil) == %{act: nil, scene: nil, line: nil}
    end
  end

  describe "line_count/1" do
    test "counts <br> breaks plus one" do
      assert MonologueMeta.line_count("a<br>b<br>c") == 3
      assert MonologueMeta.line_count("one line") == 1
      assert MonologueMeta.line_count(nil) == 0
    end
  end

  describe "canonical_url/1" do
    test "is the numeric permalink on the production host" do
      assert MonologueMeta.canonical_url(360) ==
               "https://www.shakespeare-monologues.org/monologues/360"
    end
  end

  describe "description/1" do
    test "mentions character, style, play, and the formatted location" do
      desc = MonologueMeta.description(@row)

      assert desc =~ "Ariel's verse monologue"
      assert desc =~ ~s|"You are three men of sin, whom Destiny"|
      assert desc =~ "Shakespeare's The Tempest"
      assert desc =~ "Act 3, Scene 3, line 69"
    end
  end

  describe "json_ld/1" do
    test "produces a valid CreativeWork + BreadcrumbList graph" do
      {:ok, data} = MonologueMeta.json_ld(@row) |> Jason.decode()

      assert data["@context"] == "https://schema.org"
      [cw, bc] = data["@graph"]

      assert cw["@type"] == "CreativeWork"
      assert cw["isPartOf"]["name"] == "The Tempest"
      assert cw["character"]["name"] == "Ariel"
      assert cw["license"] =~ "creativecommons.org"
      assert cw["url"] == "https://www.shakespeare-monologues.org/monologues/360"

      # body HTML is stripped to plain text for the JSON-LD `text`
      assert cw["text"] =~ "You are three men of sin"
      refute cw["text"] =~ "<br>"
      refute cw["text"] =~ "&nbsp;"

      assert bc["@type"] == "BreadcrumbList"
      assert Enum.map(bc["itemListElement"], & &1["name"]) == ["Home", "The Tempest", "Ariel"]

      assert Enum.at(bc["itemListElement"], 1)["item"] ==
               "https://www.shakespeare-monologues.org/play/14"
    end
  end

  describe "format_location/1" do
    test "converts roman act/scene/line" do
      assert MonologueMeta.format_location("III iii 69") == "Act 3, Scene 3, line 69"
      assert MonologueMeta.format_location("II i 87") == "Act 2, Scene 1, line 87"
      assert MonologueMeta.format_location("IV ii") == "Act 4, Scene 2"
    end

    test "falls back to the raw string when it isn't roman act/scene" do
      assert MonologueMeta.format_location("Prologue") == "Prologue"
      assert MonologueMeta.format_location("Induction i 5") == "Induction i 5"
    end

    test "handles nil" do
      assert MonologueMeta.format_location(nil) == ""
    end
  end
end
