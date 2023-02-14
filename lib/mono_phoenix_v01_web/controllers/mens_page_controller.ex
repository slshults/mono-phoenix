defmodule MonoPhoenixV01Web.MensPageController do
  use MonoPhoenixV01Web, :controller
  import Ecto.Query, only: [from: 2]

  # Show lists of the plays
  @spec mens(Plug.Conn.t(), any) :: Plug.Conn.t()
  def mens(conn, _params) do
    query =
      from(p in "plays",
        group_by: [p.title],
        select: %{
          title: p.title
        }
      )

    rows = MonoPhoenixV01.Repo.all(query)

    render(conn, "mens.html", rows: rows)
  end
end

# Code translated from Ruby controller below commented out for now

#       @moduledoc """
#       Controller for mens
#       """
#
#       # Gets the index page for mens
#       def play_index(conn, _params) do
#         session = conn.assigns[:session]
#         session[:gender] = gender_from_path(conn) || # gender_letter(conn.params["g"]) || "a"
#         title = "#{gender_word(session[:gender])} # Monologues in Shakespeare"
#         plays = Play.all
#         comedies = Play.where(classification: "Comedy")
#         histories = Play.where(classification: "History")
#         tragedies = Play.where(classification: "Tragedy")
#         scope = "#{gender_word(session[:gender])}"
#         session[:play] = nil
#         render(conn, "mens/index", title: title, plays: # plays, comedies: comedies, histories: histories, # tragedies: tragedies, scope: scope)
#       end
#
#       # Gets the index page for mens
#       get "/mens", play_index: true, cache: true
#       get "/monologues", play_index: true, cache: true
#       get "/men", play_index: true, cache: true
#       get "/women", play_index: true, cache: true
#
#       # Gets the index page for monologues
#       def monologues_index(conn, _params) do
#         session = conn.assigns[:session]
#         play = Play.find(String.to_integer(conn.params# ["id"]))
#         session[:play] = play.id
#         session[:gender] = gender_from_path(conn) || # gender_letter(conn.params["g"]) || "a"
#         title = "#{gender_word(session[:gender])} # Monologues in #{play.title}"
#         monologues = play.monologues |> gender(session# [:gender])
#         session[:toggle] = (conn.params["expand"] == # "1") ? "expand" : "collapse"
#
#         # Debug ouput, displayed in development env
#         debug_output = """
#         play: #{session[:play]}<br/>
#         gender: #{session[:gender]}<br/>
#         toggle: #{session[:toggle]}<br/>
#         title: #{title}<br/>
#         query: #{session[:query]}<br/>
#         found: #{length(monologues)}<br/>
#         displayed: #{length(monologues)}
#         """
#
#         render(conn, "monologues/index", title: title, # monologues: monologues, debug_output: # debug_output, toggle: session[:toggle])
#       end
#
#       # Gets the index page for monologues
#       get "/plays/:id", monologues_index: true, cache: true
#       get "/women/plays/:id", monologues_index: true, # cache: true
#       get "/men/plays/:id", monologues_index: true, cache: # true
#     end
#   end
#   ## Generate three case insensitive routes
# ## for each entry in play_routes map.
# ## For example:
# ##   /asyoulikeit
# ##   /men/asyoulikeit
# ##   /women/asyoulikeit
#
# # play_routes map
# # key: play route atom
# # value: play id
# # comment: title
# play_routes = %{
#   :asyoulikeit => 1,  # As You Like It
#   :coe => 2,  # The Comedy of Errors
#   :cymbeline => 3,  # Cymbeline
#   :lll => 4,  # Love's Labour's Lost
#   :merchant => 5,  # The Merchant of Venice
#   :muchado => 6,  # Much Ado About Nothing
#   :shrew => 7,  # The Taming of the Shrew
#   :"12thnight" => 8,  # Twelfth Night, Or What You Will
#   :allswell => 9,  # All's Well That Ends Well
#   :measure => 10,  # Measure for Measure
#   :merrywives => 11,  # Merry Wives of Windsor
#   :merchent => 12,  # Merchant of Venice
#   :midsummer => 13,  # A Midsummer Night's Dream
#   :tempest => 14,  # The Tempest
#   :troilus => 15,  # Troilus and Cressida
#   :twogents => 16,  # Two Gentlemen of Verona
#   :winterstale => 17,  # The Winter's Tale
#   :pericles => 18,  # Pericles Prince of Tyre
#   :"henryiv-i" => 19,  # Henry IV, Part 1
#   :"henryiv-ii" => 20,  # Henry IV, Part 2
#   :henryv => 21,  # Henry V
#   :"henryvi-i" => 22,  # Henry VI, Part 1
#   :"henryvi-ii" => 23,  # Henry VI, Part 2
#   :"henryvi-iii" => 24,  # Henry VI, Part 3
#   :henryviii => 25,  # Henry VIII
#   :kingjohn => 26,  # King John
#   :richardii => 27,  # Richard II
#   :richardiii => 28,  # Richard III
#   :aandc => 29,  # Antony and Cleopatra
#   :coriolanus => 30,  # Coriolanus
#   :hamlet => 31,  # Hamlet
#   :lear => 32,  # Lear
#   :macbeth => 33,  # Macbeth
#   :othello => 34,  # Othello
#   :randj => 35,  # Romeo and Juliet
#   :timon => 36,  # Timon of Athens
#   :titus => 37,  # Titus Andronicus
#   :caesar => 38  # Julius Caesar
# }
#
# # Generate routes
# play_routes
# |> Enum.each(fn {route, id} ->
#   # Generate three case insensitive routes
#   # for each entry in play_routes map.
#   get "/#{route}", Plug.Conn, do: send_resp(conn, 200, # "Play ##{id}")
#   get "/men/#{route}", Plug.Conn, do: send_resp(conn, 200, # "Play ##{id}")
#   get "/women/#{route}", Plug.Conn, do: send_resp(conn, # 200, "Play ##{id}")
# end)
#
# # Iterates through each play route and creates a new route # for each play
# play_routes |> Enum.each(fn {play_key, play_id} ->
#   play_path = "/#{play_key}/?"
#   get(Regex.new(play_path, true)) do do_play(play_id) end
#   # To do: gender_id parameter hardcoded
#   get(Regex.new("/men#{play_path}/?", true)) do do_play# (play_id, 3) end
#   get(Regex.new("/women#{play_path}/?", true)) do do_play# (play_id, 2) end
#   get(Regex.new("/plays#{play_path}/?", true)) do do_play# (play_id) end
# end)
#
