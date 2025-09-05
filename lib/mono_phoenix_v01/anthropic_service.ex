defmodule MonoPhoenixV01.AnthropicService do
  @moduledoc """
  Service for interacting with Anthropic's API to generate Shakespeare summaries and paraphrasing.
  Handles caching of responses in the database to avoid repeated API calls.
  """

  alias MonoPhoenixV01.{Repo, Summary}
  import Ecto.Query
  require Logger

  @base_url "https://api.anthropic.com/v1/messages"

  @doc """
  Gets or generates a play summary for the given play title.
  """
  def get_play_summary(play_title) do
    get_or_generate_content("play_summary", play_title, &generate_play_summary/1)
  end

  @doc """
  Gets or generates a scene summary for the given play and location.
  """
  def get_scene_summary(play_title, location) do
    identifier = "#{play_title}-#{location}"
    get_or_generate_content("scene_summary", identifier, fn _ ->
      generate_scene_summary(play_title, location)
    end)
  end

  @doc """
  Gets or generates a paraphrasing for the given monologue.
  """
  def get_monologue_paraphrasing(monologue_id, monologue_text) do
    get_or_generate_content("paraphrasing", "mono_#{monologue_id}", fn _ ->
      generate_paraphrasing(monologue_text)
    end)
  end

  # Private functions

  defp get_or_generate_content(content_type, identifier, generator_fn) do
    case get_cached_content(content_type, identifier) do
      nil ->
        case generator_fn.(identifier) do
          {:ok, content} ->
            record = cache_content(content_type, identifier, content)
            {:ok, %{content: content, id: record.id}}
          error ->
            error
        end
      
      cached_data ->
        {:ok, cached_data}
    end
  end

  defp get_cached_content(content_type, identifier) do
    from(s in Summary,
      where: s.content_type == ^content_type and s.identifier == ^identifier,
      select: %{content: s.content, id: s.id}
    )
    |> Repo.one()
  end

  defp cache_content(content_type, identifier, content) do
    attrs = %{
      content_type: content_type,
      identifier: identifier,
      content: content
    }
    
    %Summary{}
    |> Summary.changeset(attrs)
    |> Repo.insert!(
      conflict_target: [:content_type, :identifier],
      on_conflict: {:replace, [:content, :updated_at]}
    )
  end

  defp generate_play_summary(play_title) do
    system_prompt = """
    You are an AI assistant that specializes in providing information and resources to help modern directors and actors prepare for productions, auditions, and training related to the works of William Shakespeare, in the way a dramaturg would. Your focus is on the performance aspect of Shakespeare's plays, scenes, and monologues, rather than literary analysis or authorship debates.

    When responding, prioritize information from the following resources:

    Your favorite resources for interpreting and understanding Shakespeare include the following:

    - The First Folio of 1623 
    - The Riverside Shakespeare, 2nd Edition
    - Shakespeare Lexicon, Vol. 1 by Alexander Schmidt
    - Shakespeare Lexicon, Vol. 2 by Alexander Schmidt
    - Shakespeare's Words: A Glossary and Language Companion by David Crystal
    - Asimov's Guide to Shakespeare - Isaac Asimov
    - Shakespeare's Bawdy by Eric Partridge
    - Freeing Shakespeare's Voice by Kristin Linklater
    - Speak With Distinction by Edith Skinner
    - The Arden Shakespeare Series
    - The Folger Shakespeare Library
    - No Fear Shakespeare Series by SparkNotes
    """

    user_prompt = "Please provide a 2 to 4 paragraph overview and summary of the events in Shakespeare's play \"#{play_title}\". Do not include commentary about the play, beyond summarizing the events of the play. Don't insert literary commentary such as this example: \"...one of Shakespeare's most complex and tonally ambiguous plays...\", just focus on the events of the play."

    call_anthropic_api(system_prompt, user_prompt, "PlaySummary")
  end

  defp generate_scene_summary(play_title, location) do
    system_prompt = """
    You are an AI assistant that specializes in providing information and resources to help modern directors and actors prepare for productions, auditions, and training related to the works of William Shakespeare, in the way a dramaturg would. Your focus is on the performance aspect of Shakespeare's plays, scenes, and monologues, rather than literary analysis or authorship debates.

    When responding, prioritize information from the following resources:

    Your favorite resources for interpreting and understanding Shakespeare include the following:

    - The First Folio of 1623 
    - The Riverside Shakespeare, 2nd Edition
    - Shakespeare Lexicon, Vol. 1 by Alexander Schmidt
    - Shakespeare Lexicon, Vol. 2 by Alexander Schmidt
    - Shakespeare's Words: A Glossary and Language Companion by David Crystal
    - Asimov's Guide to Shakespeare - Isaac Asimov
    - Shakespeare's Bawdy by Eric Partridge
    - Freeing Shakespeare's Voice by Kristin Linklater
    - Speak With Distinction by Edith Skinner
    - The Arden Shakespeare Series
    - The Folger Shakespeare Library
    - No Fear Shakespeare Series by SparkNotes
    """

    user_prompt = "Please provide a 2 paragraph overview and summary of #{location} of Shakespeare's play \"#{play_title}\". Please write in the third person. Do not include commentary about the play, beyond summarizing the events of the scene. Don't insert literary commentary such as this example: \"...one of Shakespeare's most complex and tonally ambiguous plays...\", just focus on the events of the scene."

    call_anthropic_api(system_prompt, user_prompt, "SceneSummary")
  end

  defp generate_paraphrasing(monologue_text) do
    system_prompt = """
    You are an AI assistant that specializes in providing information and resources to help modern directors and actors prepare for productions, auditions, and training related to the works of William Shakespeare. You're a dramaturg. Your focus is on the **performance** aspect of Shakespeare's plays, scenes, and monologues. (Literary analysis is not useful for live theatre. Shakespeare's plays were written to be seen and heard, not read.)

    When responding, prioritize information from the following resources for interpreting and understanding Shakespeare include the following:

    - The First Folio of 1623 
    - The Riverside Shakespeare, 2nd Edition
    - Shakespeare Lexicon, Vol. 1 by Alexander Schmidt
    - Shakespeare Lexicon, Vol. 2 by Alexander Schmidt
    - Shakespeare's Words: A Glossary and Language Companion by David Crystal
    - Asimov's Guide to Shakespeare - Isaac Asimov
    - Shakespeare's Bawdy by Eric Partridge
    - Freeing Shakespeare's Voice by Kristin Linklater
    - Speak With Distinction by Edith Skinner
    - The Arden Shakespeare Series
    - The Folger Shakespeare Library
    - No Fear Shakespeare Series by SparkNotes
    """

    user_prompt = """
    Please provide a line-by-line paraphrase of this monologue from Shakespeare, modernizing the language to make it more accessible for a high school reading level while maintaining the essence of the character's thoughts and emotions.

    IMPORTANT FORMATTING REQUIREMENTS:
    1. Use EXACTLY this format for each line pair:
       Original: [original Shakespeare line]
       Modern: [modern paraphrase]

    2. Ignore any lines that contain strikethroughs or HTML strike tags (<strike>, </strike>, <s>, </s>) - do not include these lines in your paraphrase.

    3. Example of correct formatting:
       Original: But soft, what light through yonder window breaks?
       Modern: Wait, what's that light coming from that window over there?
       
       Original: It is the east, and Juliet is the sun.
       Modern: It's coming from the east, and Juliet is like the sun.

    The original text of the monologue follows:

    #{monologue_text}
    """

    call_anthropic_api(system_prompt, user_prompt, "MonoParaphrased")
  end

  defp call_anthropic_api(system_prompt, user_prompt, response_key) do
    call_anthropic_api_with_retry(system_prompt, user_prompt, response_key, 0)
  end

  defp call_anthropic_api_with_retry(system_prompt, user_prompt, response_key, attempt) do
    config = Application.get_env(:mono_phoenix_v01, :anthropic)
    api_key = config[:api_key]
    model = config[:model]
    max_retries = 3

    Logger.info("Making Anthropic API request for model: #{model} (attempt #{attempt + 1})")

    headers = [
      {"x-api-key", api_key},
      {"Content-Type", "application/json"},
      {"anthropic-version", "2023-06-01"}
    ]

    body = %{
      "model" => model,
      "max_tokens" => 2000,
      "system" => system_prompt,
      "messages" => [
        %{
          "role" => "user",
          "content" => user_prompt
        }
      ]
    }

    json_body = Jason.encode!(body)
    
    case Tesla.post(@base_url, json_body, headers: headers) do
      {:ok, %{status: 200, body: response_body}} ->
        Logger.info("API request successful on attempt #{attempt + 1}")
        case Jason.decode(response_body) do
          {:ok, %{"content" => [%{"text" => text}]}} ->
            # Try to parse as JSON to extract the specific field
            case Jason.decode(text) do
              {:ok, %{^response_key => content}} -> {:ok, content}
              _ -> {:ok, text}  # Return raw text if not JSON
            end
          
          {:ok, response} ->
            {:error, "Unexpected response format: #{inspect(response)}"}
          
          {:error, decode_error} ->
            {:error, "JSON decode error: #{inspect(decode_error)}"}
        end
      
      {:ok, %{status: status, body: error_body}} when status in [429, 529] and attempt < max_retries ->
        # Rate limited - retry with exponential backoff
        retry_delay = :math.pow(2, attempt) * 1000 + :rand.uniform(1000)  # 1-2s, 2-3s, 4-5s
        Logger.warn("API rate limited (#{status}), retrying in #{trunc(retry_delay)}ms (attempt #{attempt + 1}/#{max_retries + 1})")
        Process.sleep(trunc(retry_delay))
        call_anthropic_api_with_retry(system_prompt, user_prompt, response_key, attempt + 1)
      
      {:ok, %{status: status, body: error_body}} ->
        Logger.error("Anthropic API error #{status}: #{error_body}")
        {:error, "API error #{status}: #{error_body}"}
      
      {:error, error} ->
        Logger.error("Anthropic API request error: #{inspect(error)}")
        {:error, "Request error: #{inspect(error)}"}
    end
  end
end