defmodule MonoPhoenixV01Web.ContactLive do
  use MonoPhoenixV01Web, :live_view
  alias MonoPhoenixV01.Mailer

  @impl true
  def mount(_params, _session, socket) do
    {:ok, 
     socket 
     |> assign(:form, to_form(%{"name" => "", "email" => "", "subject" => "", "message" => "", "source_check" => ""}))
     |> assign(:success_message, nil)
     |> assign(:error_message, nil)
     |> assign(:submitting, false)
    }
  end

  @impl true
  def handle_event("submit", params, socket) do
    %{"name" => name, "email" => email, "subject" => subject, "message" => message, "source_check" => source_check} = params
    
    # Phoenix converts hyphens to underscores in form field names
    captcha_response = Map.get(params, "g_recaptcha_response") || Map.get(params, "g-recaptcha-response")
    # Check source_check (honeypot) - if filled, it's likely a bot
    if source_check != "" do
      # Silently ignore - don't give bots feedback
      {:noreply, 
       socket 
       |> assign(:success_message, Phoenix.HTML.raw("Thanks. Your message was sent.<br/>Full disclosure: This has become a bit of a backburner project, so we may or may not reply. *sheepish grin*"))
       |> assign(:error_message, nil)
      }
    else
      # Validate the form fields
      case validate_contact_form(name, email, subject, message) do
        :ok ->
          # Verify reCAPTCHA
          case Recaptcha.verify(captcha_response) do
            {:ok, _response} ->
              require Logger
              Logger.info("Contact form: reCAPTCHA verified successfully for #{email}")
              
              # Send the email
              email_result = send_contact_email(name, email, subject, message)
              |> Mailer.deliver()
              
              case email_result do
                {:ok, response} ->
                  Logger.info("Contact form: Email sent successfully for #{email}. Response: #{inspect(response)}")
                  {:noreply, 
                   socket 
                   |> assign(:form, to_form(%{"name" => "", "email" => "", "subject" => "", "message" => "", "source_check" => ""}))
                   |> assign(:success_message, Phoenix.HTML.raw("Thanks. Your message was sent.<br/>Full disclosure: This has become a bit of a backburner project, so we may or may not reply. *sheepish grin*"))
                   |> assign(:error_message, nil)
                   |> assign(:submitting, false)
                  }
                
                {:error, reason} ->
                  Logger.error("Contact form: Email delivery failed for #{email}. Reason: #{inspect(reason)}")
                  {:noreply, 
                   socket 
                   |> assign(:error_message, "Sorry, there was an error sending your message. Please try again later.")
                   |> assign(:success_message, nil)
                   |> assign(:submitting, false)
                  }
              end
            
            {:error, errors} ->
              require Logger
              Logger.warning("Contact form: reCAPTCHA verification failed for #{email}. Errors: #{inspect(errors)}")
              {:noreply, 
               socket 
               |> assign(:error_message, "Please complete the reCAPTCHA verification.")
               |> assign(:success_message, nil)
               |> assign(:submitting, false)
              }
          end
        
        {:error, message} ->
          {:noreply, 
           socket 
           |> assign(:error_message, message)
           |> assign(:success_message, nil)
           |> assign(:submitting, false)
          }
      end
    end
  end

  # Fallback handler when reCAPTCHA is not loaded/working
  @impl true 
  def handle_event("submit", %{"name" => name, "email" => email, "subject" => subject, "message" => message, "source_check" => source_check}, socket) do
    # For now, skip reCAPTCHA verification and process the form
    # Check source_check (honeypot) - if filled, it's likely a bot
    if source_check != "" do
      # Silently ignore - don't give bots feedback
      {:noreply, 
       socket 
       |> assign(:success_message, Phoenix.HTML.raw("Thanks. Your message was sent.<br/>Full disclosure: This has become a bit of a backburner project, so we may or may not reply. *sheepish grin*"))
       |> assign(:error_message, nil)
      }
    else
      # Validate the form fields
      case validate_contact_form(name, email, subject, message) do
        :ok ->
          require Logger
          Logger.info("Contact form: Fallback handler - sending email without reCAPTCHA for #{email}")
          
          # Send the email (without reCAPTCHA verification for now)
          email_result = send_contact_email(name, email, subject, message)
          |> Mailer.deliver()
          
          case email_result do
            {:ok, response} ->
              Logger.info("Contact form: Fallback - Email sent successfully for #{email}. Response: #{inspect(response)}")
              {:noreply, 
               socket 
               |> assign(:form, to_form(%{"name" => "", "email" => "", "subject" => "", "message" => "", "source_check" => ""}))
               |> assign(:success_message, Phoenix.HTML.raw("Thanks. Your message was sent.<br/>Full disclosure: This has become a bit of a backburner project, so we may or may not reply. *sheepish grin*"))
               |> assign(:error_message, nil)
               |> assign(:submitting, false)
              }
            
            {:error, reason} ->
              Logger.error("Contact form: Fallback - Email delivery failed for #{email}. Reason: #{inspect(reason)}")
              {:noreply, 
               socket 
               |> assign(:error_message, "Sorry, there was an error sending your message. Please try again later.")
               |> assign(:success_message, nil)
               |> assign(:submitting, false)
              }
          end
        
        {:error, message} ->
          {:noreply, 
           socket 
           |> assign(:error_message, message)
           |> assign(:success_message, nil)
           |> assign(:submitting, false)
          }
      end
    end
  end

  @impl true
  def handle_event("validate", _params, socket) do
    # Reduce console noise - only validate if there are actual errors to show
    # Don't update form state on every keystroke  
    {:noreply, socket}
  end

  # Validate contact form fields
  defp validate_contact_form(name, email, subject, message) do
    cond do
      String.trim(name) == "" ->
        {:error, "Name is required"}
      
      String.trim(email) == "" ->
        {:error, "Email is required"}
      
      not String.contains?(email, "@") ->
        {:error, "Please enter a valid email address"}
      
      String.trim(subject) == "" ->
        {:error, "Subject is required"}
      
      String.trim(message) == "" ->
        {:error, "Message is required"}
      
      String.length(String.trim(message)) < 10 ->
        {:error, "Please provide a more detailed message (at least 10 characters)"}
      
      true ->
        :ok
    end
  end

  # Create the email
  defp send_contact_email(name, email, subject, message) do
    require Logger
    Logger.info("Contact form: Creating email - From: #{name} <#{email}>, Subject: #{subject}")
    
    email_struct = Swoosh.Email.new()
    |> Swoosh.Email.to("shakesmonos@shults.org")
    |> Swoosh.Email.from({"ShakesMonos Contact Form", "shakesmonos@shults.org"}) 
    |> Swoosh.Email.reply_to(email)
    |> Swoosh.Email.subject("Contact Form: #{subject}")
    |> Swoosh.Email.text_body("""
    You have received a new message through the contact form on shakespeare-monologues.org

    From: #{name} (#{email})
    Subject: #{subject}

    Message:
    #{message}

    ---
    This message was sent via the contact form on shakespeare-monologues.org
    Reply directly to this email to respond to #{name}.
    """)
    
    Logger.debug("Contact form: Email structure created: #{inspect(email_struct)}")
    email_struct
  end

  @impl true
  def render(assigns) do
    ~H"""
    <title>Contact Us · Shakespeare's Monologues</title>
    
    <table align="center" width="100%">
      <tr>
        <td align="center" width="100%">
          <table align="center" valign="top" cellpadding="0" cellspacing="0" width="">
            <tr>
              <td colspan="" cellpadding="0" cellspacing="0" align="center" valign="top" width="500" class="accent-font">
                <br />
                <font size="+3">Contact</font>
                <br />
                <font size="+1">Send feedback, corrections, questions etc.</font>
                <br /><br />
              </td>
            </tr>
          </table>

          <table align="center" valign="middle" height="" width="80%" class="accent-font" style="max-width: 600px;">
            <tr>
              <td width="90%">
                <%= if @success_message do %>
                  <div class="alert alert-success">
                    <%= @success_message %>
                  </div>
                <% end %>

                <%= if @error_message do %>
                  <div class="alert alert-error">
                    <%= @error_message %>
                  </div>
                <% end %>

                <.form for={@form} phx-submit="submit" class="contact-form">
                  <div class="form-group">
                    <label for="name"><b>Name:</b></label>
                    <%= text_input @form, :name, required: true, class: "form-input" %>
                  </div>

                  <div class="form-group">
                    <label for="email"><b>E-Mail Address:</b></label>
                    <%= email_input @form, :email, required: true, class: "form-input" %>
                  </div>

                  <div class="form-group">
                    <label for="subject"><b>Subject:</b></label>
                    <%= select @form, :subject, [
                      {"Select", ""},
                      {"Question", "Question"},
                      {"Feedback", "Feedback"}, 
                      {"Correction", "Correction"},
                      {"Other", "Other"}
                    ], required: true, class: "form-input" %>
                  </div>

                  <div class="form-group">
                    <label for="message"><b>Message:</b></label>
                    <%= textarea @form, :message, rows: "8", required: true, class: "form-input form-textarea" %>
                  </div>

                  <!-- Source check field - hidden from humans, visible to bots -->
                  <div style="position: absolute; left: -9999px; top: -9999px;">
                    <%= text_input @form, :source_check, tabindex: "-1", autocomplete: "off" %>
                  </div>

                  <!-- reCAPTCHA widget -->
                  <div class="form-group">
                    <div id="recaptcha-widget" phx-hook="Recaptcha" data-sitekey={Application.get_env(:recaptcha, :public_key)}></div>
                  </div>

                  <div class="form-group">
                    <button type="submit" class="btn-submit" disabled={@submitting}>
                      <%= if @submitting, do: "Sending...", else: "Send" %>
                    </button>
                  </div>
                </.form>

                <br /><br />
                
                <ul style="font-size: 13px;">
                  <li>This contact form is secured via SSL/https (encrypted.)</li>
                  <li>The message you enter will be sent to us via Google Workspace servers (Gmail servers)</li>
                  <li>Your name and email address will be used only to reply to you, if needed.</li>
                  <li>We don't have an enewsletter, we don't have anything to sell, nor will we sell your info to others.</li>
                  <li><strong>Do NOT send any secure information</strong> via this form, ever. We will never ask you for payment info of any kind, or passwords, or social security numbers, or anything else that could be used to access your identity, accounts, or funds. If you've been told to send any such info via this form, it wasn't us, you're being scammed.</li>
                  <li><strong>Seriously: DO NOT send secure or private info via this form.</strong></li>
                  <li>Do not use this form to try to sell me anything. I will report you to the abuse team at your ISP or VPN service. Tarry not, away with thee, spammer!</li>
                </ul>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <style>
      .contact-form {
        margin: 20px 0;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #111;
      }
      
      .form-input {
        width: 100%;
        max-width: 400px;
        padding: 8px;
        border: 1px solid #999;
        border-radius: 3px;
        font-size: 16px;
        font-family: inherit;
        background-color: #fff;
        color: #111;
      }
      
      .form-textarea {
        resize: vertical;
        min-height: 120px;
      }
      
      .form-input:focus {
        outline: none;
        border-color: #5E2612;
        background-color: #fff;
      }
      
      .btn-submit {
        background-color: #8B4513;
        color: white;
        padding: 8px 20px;
        border: none;
        border-radius: 3px;
        font-size: 14px;
        cursor: pointer;
        font-family: inherit;
      }
      
      .btn-submit:hover:not(:disabled) {
        background-color: #A0522D;
      }
      
      .btn-submit:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
      
      .alert {
        padding: 15px;
        margin: 15px 0;
        border: 1px solid transparent;
        border-radius: 4px;
        text-align: left;
      }
      
      .alert-success {
        background-color: #dff0d8;
        color: #3c763d;
        border-color: #d6e9c6;
      }
      
      .alert-error {
        background-color: #f2dede;
        color: #a94442;
        border-color: #ebccd1;
      }

      /* Dark mode compatibility */
      body.dark-mode .form-input {
        background-color: #333;
        color: #fff;
        border-color: #666;
      }
      
      body.dark-mode .form-input:focus {
        background-color: #444;
        color: #fff;
        border-color: #A0522D;
      }
      
      body.dark-mode .form-group label {
        color: #fff;
      }
    </style>

    <!-- reCAPTCHA script will be loaded by the Recaptcha hook in app.js -->
    """
  end
end