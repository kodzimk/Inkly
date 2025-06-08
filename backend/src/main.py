from assistant import Assistant
assistant = Assistant()

# Ask a question
response = assistant.answer_question("How do I implement email verification?")

# The response will include:
# - A detailed answer
# - Confidence level
# - Suggested follow-up questions
# - Relevant context used

# Example troubleshooting
response = assistant.answer_question("Why is my verification code not working?")

# Get conversation history
history = assistant.get_conversation_history()