import openai
import datetime
import pytz
import os

# Use the `openai` module to set your API key
openai.api_key = "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"

# Set the prompt you want to send to GPT-4
messages=[
    {"role": "system", "content": """
    Multi-line content for role here
    """},
    {"role": "user", "content": """
    Multi-line content for instructions here
    """},
]

# Use the `openai` module to send the prompt to GPT-4 and receive the response
chat = openai.ChatCompletion.create(
  model="gpt-4",
  messages=messages,
  max_tokens=3000,
)

# Get the response from GPT-4
response = chat['choices'][0]['message']['content']

# Print the response
print(response)

# Get the script's file name
script_name = os.path.basename(__file__).replace(".py", "")

# Get the current date and time in Pacific Time
pacific = pytz.timezone('US/Pacific')
datetime_pacific = datetime.datetime.now(pacific)

# Format the date and time
formatted_date_time = datetime_pacific.strftime("%Y%m%d-%I.%M%p")

# Create the file name
file_name = f"{script_name}-{formatted_date_time}.txt"

# Open a file in write mode
with open(file_name, "w") as file:
    # Write the response to the file
    file.write(response)
