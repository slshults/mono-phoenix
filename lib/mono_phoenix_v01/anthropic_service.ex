defmodule MonoPhoenixV01.AnthropicService do
  @moduledoc """
  Service for interacting with Anthropic's API to generate Shakespeare summaries and paraphrasing.
  Handles caching of responses in the database to avoid repeated API calls.
  """

  alias MonoPhoenixV01.{Repo, Summary}
  import Ecto.Query
  require Logger

  # Configure Tesla HTTP client
  use Tesla, only: [:post]
  plug Tesla.Middleware.BaseUrl, "https://api.anthropic.com/v1"
  plug Tesla.Middleware.JSON
  
  # Use Hackney adapter with explicit timeout
  adapter Tesla.Adapter.Hackney, recv_timeout: 60_000, connect_timeout: 30_000

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

  defp get_scene_url(play_title, location) do
    import Ecto.Query
    require Logger
    
    try do
      # Query for the body_link (scene URL) based on play title and location
      # We'll get the first matching monologue since they all share the same scene URL
      from(m in "monologues",
        join: p in "plays", on: m.play_id == p.id,
        where: p.title == ^play_title and m.location == ^location,
        select: m.body_link,
        limit: 1
      )
      |> Repo.one()
    rescue
      error ->
        Logger.warning("Failed to query scene URL for #{play_title} - #{location}: #{inspect(error)}")
        nil
    end
  end

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
    # Query for the scene URL to provide additional context
    scene_url = get_scene_url(play_title, location)
    
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
    
    IMPORTANT: Different editions of Shakespeare's works may use different terminology for the same sections. For example:
    - What one edition calls a "Prologue" another might call an "Induction"
    - Act and scene numbering may vary between editions
    - Some editions combine or split scenes differently
    
    Be flexible with terminology and focus on the actual content and events rather than getting confused by naming differences between editions.
    """

    url_context = if scene_url do
      " For reference, this scene can be found at: #{scene_url}"
    else
      ""
    end

    user_prompt = "Please provide a 2 paragraph overview and summary of #{location} of Shakespeare's play \"#{play_title}\".#{url_context} Please write in the third person. Do not include commentary about the play, beyond summarizing the events of the scene. Don't insert literary commentary such as this example: \"...one of Shakespeare's most complex and tonally ambiguous plays...\", just focus on the events of the scene."

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
      "system" => [
        %{
          "type" => "text",
          "text" => system_prompt,
          "cache_control" => %{"type" => "ephemeral"}
        }
      ],
      "messages" => [
        %{
          "role" => "user",
          "content" => user_prompt
        }
      ]
    }
    
    # Calculate approximate input tokens (rough estimate: ~4 chars per token)
    input_text_length = String.length(system_prompt) + String.length(user_prompt)
    estimated_input_tokens = div(input_text_length, 4)
    
    # Record start time for latency calculation
    start_time = System.monotonic_time(:millisecond)
    
    case post("/messages", body, headers: headers) do
      {:ok, %{status: 200, body: %{"content" => [%{"text" => text}], "usage" => usage}}} ->
        end_time = System.monotonic_time(:millisecond)
        latency_ms = end_time - start_time
        
        Logger.info("API request successful on attempt #{attempt + 1}")
        
        # Extract token usage from Anthropic response
        input_tokens = Map.get(usage, "input_tokens", estimated_input_tokens)
        output_tokens = Map.get(usage, "output_tokens", div(String.length(text), 4))
        
        # Extract cache usage metrics (new with prompt caching)
        cache_creation_input_tokens = Map.get(usage, "cache_creation_input_tokens")
        cache_read_input_tokens = Map.get(usage, "cache_read_input_tokens")
        
        # Log cache usage for monitoring
        log_cache_usage(cache_creation_input_tokens, cache_read_input_tokens, input_tokens)
        
        # Track successful LLM call with cache metrics
        track_llm_analytics(response_key, model, input_tokens, output_tokens, latency_ms, true, attempt + 1, nil, cache_creation_input_tokens, cache_read_input_tokens, system_prompt, user_prompt, text)
        
        # Try to parse as JSON to extract the specific field
        case Jason.decode(text) do
          {:ok, %{^response_key => content}} -> {:ok, content}
          _ -> {:ok, text}  # Return raw text if not JSON
        end
      
      {:ok, %{status: 200, body: %{"content" => [%{"text" => text}]}}} ->
        end_time = System.monotonic_time(:millisecond)
        latency_ms = end_time - start_time
        
        Logger.info("API request successful on attempt #{attempt + 1}")
        
        # Fallback when no usage data is provided
        output_tokens = div(String.length(text), 4)
        
        # Track successful LLM call with estimated tokens (no cache data available)
        track_llm_analytics(response_key, model, estimated_input_tokens, output_tokens, latency_ms, true, attempt + 1, nil, nil, nil, system_prompt, user_prompt, text)
        
        # Try to parse as JSON to extract the specific field
        case Jason.decode(text) do
          {:ok, %{^response_key => content}} -> {:ok, content}
          _ -> {:ok, text}  # Return raw text if not JSON
        end
      
      {:ok, %{status: 200, body: response}} ->
        end_time = System.monotonic_time(:millisecond)
        latency_ms = end_time - start_time
        
        # Track failed LLM call due to unexpected format
        track_llm_analytics(response_key, model, estimated_input_tokens, 0, latency_ms, false, attempt + 1, "Unexpected response format", nil, nil, system_prompt, user_prompt, nil)
        {:error, "Unexpected response format: #{inspect(response)}"}
      
      {:ok, %{status: status, body: _error_body}} when status in [429, 529] and attempt < max_retries ->
        # Rate limited - retry with exponential backoff
        retry_delay = :math.pow(2, attempt) * 1000 + :rand.uniform(1000)  # 1-2s, 2-3s, 4-5s
        Logger.warning("API rate limited (#{status}), retrying in #{trunc(retry_delay)}ms (attempt #{attempt + 1}/#{max_retries + 1})")
        Process.sleep(trunc(retry_delay))
        call_anthropic_api_with_retry(system_prompt, user_prompt, response_key, attempt + 1)
      
      {:ok, %{status: status, body: error_body}} ->
        end_time = System.monotonic_time(:millisecond)
        latency_ms = end_time - start_time
        
        # Track failed LLM call
        track_llm_analytics(response_key, model, estimated_input_tokens, 0, latency_ms, false, attempt + 1, "API error #{status}", nil, nil, system_prompt, user_prompt, nil)
        
        Logger.error("Anthropic API error #{status}: #{inspect(error_body)}")
        {:error, "API error #{status}: #{inspect(error_body)}"}
      
      {:error, error} ->
        end_time = System.monotonic_time(:millisecond)
        latency_ms = end_time - start_time
        
        # Track failed LLM call
        track_llm_analytics(response_key, model, estimated_input_tokens, 0, latency_ms, false, attempt + 1, "Request error", nil, nil, system_prompt, user_prompt, nil)
        
        Logger.error("Anthropic API request error: #{inspect(error)}")
        {:error, "Request error: #{inspect(error)}"}
    end
  end

  # PostHog LLM Analytics tracking function with enhanced properties
  defp track_llm_analytics(request_type, model, input_tokens, output_tokens, latency_ms, success, attempt, error_message \\ nil, cache_creation_input_tokens \\ nil, cache_read_input_tokens \\ nil, system_prompt \\ nil, user_prompt \\ nil, ai_output \\ nil) do
    # Generate unique trace and span IDs for this request
    trace_id = generate_trace_id()
    span_id = generate_span_id()
    
    # Format input messages for PostHog LLM analytics
    ai_input = if system_prompt && user_prompt do
      [
        %{
          "role" => "system",
          "content" => [%{"type" => "text", "text" => system_prompt}]
        },
        %{
          "role" => "user", 
          "content" => [%{"type" => "text", "text" => user_prompt}]
        }
      ]
    else
      nil
    end
    
    # Format output choices for PostHog LLM analytics
    ai_output_choices = if ai_output do
      [
        %{
          "role" => "assistant",
          "content" => [%{"type" => "text", "text" => ai_output}]
        }
      ]
    else
      nil
    end
    
    # Calculate estimated cost based on Anthropic pricing (as of 2024)
    # These are rough estimates - you should update with current pricing
    estimated_cost = case model do
      "claude-3-5-sonnet-20241022" ->
        (input_tokens * 0.003 / 1000) + (output_tokens * 0.015 / 1000)
      "claude-3-5-haiku-20241022" ->
        (input_tokens * 0.00025 / 1000) + (output_tokens * 0.00125 / 1000)
      "claude-3-opus-20240229" ->
        (input_tokens * 0.015 / 1000) + (output_tokens * 0.075 / 1000)
      _ ->
        (input_tokens * 0.003 / 1000) + (output_tokens * 0.015 / 1000)  # Default to Sonnet pricing
    end

    # Enhanced properties following PostHog LLM analytics spec
    properties = %{
      # MANDATORY PostHog LLM properties
      "$ai_input" => ai_input,
      "$ai_output_choices" => ai_output_choices,
      
      # Core PostHog LLM properties (using standard naming)
      "$ai_model" => model,
      "$ai_provider" => "anthropic",
      "$ai_input_tokens" => input_tokens,
      "$ai_output_tokens" => output_tokens,
      "$ai_total_cost_usd" => Float.round(estimated_cost, 6),
      "$ai_latency" => latency_ms,  # Keep in milliseconds as per PostHog docs
      
      # Tracing properties
      "$ai_trace_id" => trace_id,
      "$ai_span_id" => span_id,
      "$ai_span_name" => format_span_name(request_type),
      
      # Anthropic-specific properties
      "$ai_max_tokens" => 2000,  # Our configured max_tokens
      "$ai_temperature" => nil,  # We don't set temperature, using default
      
      # Cache properties (Anthropic prompt caching data)
      "$ai_cache_read_input_tokens" => cache_read_input_tokens,
      "$ai_cache_creation_input_tokens" => cache_creation_input_tokens,
      
      # Tools tracking (we don't use tools currently, but including for future)
      "$ai_tools" => nil,
      
      # Custom business properties
      "content_type" => request_type,
      "attempt_number" => attempt,
      "generation_success" => success,
      "shakespeare_app_version" => "2025.1",
      "request_source" => "shakespeare_monologues",
      "cache_hit" => cache_read_input_tokens != nil,
      "cache_created" => cache_creation_input_tokens != nil,
      "prompt_caching_enabled" => true,
      
      # Legacy properties for backward compatibility
      "model_name" => model,
      "input_tokens" => input_tokens,
      "output_tokens" => output_tokens,
      "total_tokens" => input_tokens + output_tokens,
      "estimated_cost" => Float.round(estimated_cost, 6),
      "provider" => "anthropic",
      "success" => success,
      "latency_ms" => latency_ms,
      "request_type" => request_type,
      "timestamp" => DateTime.utc_now() |> DateTime.to_iso8601()
    }

    properties = if error_message do
      properties
      |> Map.put("$ai_error", error_message)
      |> Map.put("error_message", error_message)
    else
      properties
    end

    # Send directly to PostHog (this works in all contexts)
    try do
      send_to_posthog("$ai_generation", properties)
    rescue
      error ->
        Logger.warning("Failed to send LLM analytics to PostHog: #{inspect(error)}")
    end

    # Also send to Phoenix LiveView for backward compatibility (when in LiveView context)
    try do
      Phoenix.PubSub.broadcast(
        MonoPhoenixV01.PubSub,
        "posthog_events",
        {:track_llm, properties}
      )
    rescue
      error ->
        Logger.debug("Failed to broadcast LLM analytics event (expected when not in LiveView): #{inspect(error)}")
    end
  end

  # Generate a unique trace ID for grouping related AI operations
  defp generate_trace_id do
    :crypto.strong_rand_bytes(16) |> Base.encode16(case: :lower)
  end

  # Generate a unique span ID for this specific generation
  defp generate_span_id do
    :crypto.strong_rand_bytes(8) |> Base.encode16(case: :lower)
  end

  # Format a user-friendly span name based on request type
  defp format_span_name(request_type) do
    case request_type do
      "PlaySummary" -> "Play Summary Generation"
      "SceneSummary" -> "Scene Summary Generation"
      "MonoParaphrased" -> "Monologue Paraphrasing"
      _ -> "Shakespeare AI Generation"
    end
  end

  # Log cache usage metrics for monitoring
  defp log_cache_usage(cache_creation_input_tokens, cache_read_input_tokens, total_input_tokens) do
    cond do
      cache_creation_input_tokens && cache_read_input_tokens ->
        cache_efficiency = Float.round((cache_read_input_tokens / total_input_tokens) * 100, 1)
        Logger.info("🚀 Prompt Cache: Created #{cache_creation_input_tokens} tokens, Read #{cache_read_input_tokens} tokens (#{cache_efficiency}% cache efficiency)")
      
      cache_creation_input_tokens ->
        Logger.info("💾 Prompt Cache: Created new cache entry with #{cache_creation_input_tokens} tokens")
      
      cache_read_input_tokens ->
        cache_efficiency = Float.round((cache_read_input_tokens / total_input_tokens) * 100, 1)
        Logger.info("⚡ Prompt Cache: Hit! Read #{cache_read_input_tokens} tokens (#{cache_efficiency}% cache efficiency)")
      
      true ->
        Logger.info("❌ Prompt Cache: No cache usage detected")
    end
  end

  # Send event directly to PostHog API
  defp send_to_posthog(event_name, properties) do
    # Get PostHog configuration from environment
    posthog_host = System.get_env("POSTHOG_HOST", "https://us.i.posthog.com")
    
    # Use Project API Key for event ingestion (different from Personal API Key used for MCP)
    # This is the same key used in the frontend PostHog snippet
    posthog_api_key = "phc_6aYLpkqQsmYJanYseJ8SJcOMicomCxj9v9Pl6hnZQS3"

    # Create the event payload following PostHog format
    payload = %{
      "api_key" => posthog_api_key,
      "event" => event_name,
      "properties" => properties,
      "distinct_id" => "shakespeare_monologues_server",  # Server-side events use a fixed ID
      "timestamp" => DateTime.utc_now() |> DateTime.to_iso8601()
    }

    # PostHog batch endpoint
    url = "#{posthog_host}/batch"
    
    headers = [
      {"Content-Type", "application/json"},
      {"User-Agent", "MonoPhoenixV01/1.0"}
    ]

    # Wrap in batch format
    body = %{
      "api_key" => posthog_api_key,
      "batch" => [payload]
    }
    |> Jason.encode!()

    # Send HTTP request using Tesla (already configured in the module)
    case Tesla.post(url, body, headers: headers) do
      {:ok, %{status: status}} when status in 200..299 ->
        Logger.debug("PostHog LLM analytics event sent successfully")
        :ok
      
      {:ok, %{status: status, body: error_body}} ->
        Logger.warning("PostHog API error #{status}: #{inspect(error_body)}")
        {:error, "HTTP #{status}"}
      
      {:error, error} ->
        Logger.warning("Failed to send PostHog event: #{inspect(error)}")
        {:error, error}
    end
  rescue
    error ->
      Logger.warning("Exception sending PostHog event: #{inspect(error)}")
      {:error, error}
  end
end