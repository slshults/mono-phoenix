@monologue
defmodule Monologue do
  use Ecto.Schema

  # This module defines the Monologue database table
  schema "monologues" do
    belongs_to :gender, Gender
    belongs_to :author, Author
    belongs_to :play, Play

    # Validate presence of play_id
    validates_presence_of :play_id
    # Validate presence of first_line
    validates_presence_of :first_line
    # Validate uniqueness of first_line within the scope of play_id
    validates_uniqueness_of :first_line, scope: :play_id

    # Validate length of location
    validates_length_of :location, maximum: 20, allow_nil: true
    # Validate length of first_line
    validates_length_of :first_line, maximum: 255
    # Validate length of character
    validates_length_of :character, maximum: 80, allow_nil: true
    # Validate length of style
    validates_length_of :style, maximum: 20, allow_nil: true
    # Validate length of body_link
    validates_length_of :body_link, maximum: 255, allow_nil: true
    # Validate length of pdf_link
    validates_length_of :pdf_link, maximum: 255, allow_nil: true

    # Returns all monologues if gender_param is nil, '', 'a', 1, '1'
    # Returns monologues with gender_id 2 or 1 if gender_param is 'w', 2, '2'
    # Returns monologues with gender_id 3 or 1 if gender_param is 'm', 3, '3'
    def self.gender(gender_param \\ nil) do
      case gender_param do
        nil, "", "a", 1, "1" -> all
        "w", 2, "2" -> where("gender_id = ? OR gender_id = ?", 2, 1)
        "m", 3, "3" -> where("gender_id = ? OR gender_id = ?", 3, 1)
        _ -> all
      end
    end

    # Returns all monologues that match the given term
    def self.matching(term) do
      t = "%#{term.to_s.strip.downcase}%"
      where(
        "first_line ILIKE ? OR
        character ILIKE ? OR
        body ILIKE ? OR
        location ILIKE ?",
        t, t, t, t
      )
    end

    # Returns a label if monologue is intercut
    def intercut_label do
      intercut == 1 ? "- intercut" : ""
    end
  end
end
