import openai

# Use the `openai` module to set your API key
openai.api_key = "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"

# Set the prompt you want to send to GPT-4
messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hi there, TheAI. I'm just testing my python script template for prompting you. Please respond to acknowledge that you received this message. Let me know if you see any problems, otherwise you can just say 'Looks good' or the like."},
]

# Use the `openai` module to send the prompt to GPT-4 and receive the response
chat = openai.ChatCompletion.create(
  model="gpt-4",
  messages=messages,
  max_tokens=100,
)

# Get the response from GPT-4
response = chat['choices'][0]['message']['content']

# Print the response
print(response)

# You can also write the response to a file by using the following code:

# Open a file in write mode
with open("output.txt", "w") as file:
    # Write the response to the file
    file.write(response)
