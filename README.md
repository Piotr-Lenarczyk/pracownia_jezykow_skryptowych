# Rasa Chatbot Documentation

## Overview
This repository contains a Rasa-powered chatbot that can handle customer interactions, including:
- Processing orders for meals
- Handling additional requests
- Providing menu details
- Informing about opening hours
- Confirming orders
- Integration with Slack for communication

## Installation
### Prerequisites
Ensure you have the following installed:
- Python 3.8+
- pip
- virtualenv (recommended but optional)
- Rasa CLI

### Step-by-Step Installation
1. Clone this repository:
2. Create a virtual environment and activate it (optional but recommended):
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Train the Rasa model:
   ```bash
   rasa train
   ```

## Running the Chatbot
### Start Rasa Action Server
This runs the custom actions defined in `rasa/actions/actions.py`:
```bash
rasa run actions
```

### Start Rasa Chatbot
```bash
rasa shell
```
This will allow you to test the bot via the command line.

### Running on Slack
1. Set up a Slack App and obtain the necessary credentials.
2. Configure `rasa/credentials.yml` with your Slack tokens.
3. Run the bot:
   ```bash
   rasa run -m models --enable-api --cors "*" --debug
   ```
4. Connect the bot to Slack by setting up an event subscription.

## Bot Capabilities
### Intent Handling
The bot can process intents in multiple ways, ensuring dynamic responses based on the conversation flow.

### Fetching Menu and Opening Hours
- `rasa/menu.json` contains the available meals.
- `rasa/opening_hours.yml` provides operational timings.
- The bot fetches this data dynamically when responding to customer queries.

### Processing Orders
The chatbot can:
- Take an order
- Confirm items
- Handle additional requests
- Finalize the purchase

## Testing
To test the chatbot using predefined stories:
```bash
rasa test
```
Test stories are located in `rasa/tests/test_stories.yml`.

## Configuration Files Overview
- `rasa/config.yml` – Defines NLU pipeline and policies.
- `rasa/domain.yml` – Defines intents, entities, slots, and responses.
- `rasa/endpoints.yml` – Configures API endpoints for action server and messaging platforms.
- `rasa/credentials.yml` – Holds credentials for integrations like Slack.
- `rasa/data/nlu.yml` – Contains training data for NLU.
- `rasa/data/rules.yml` – Defines rules for fixed behavior.
- `rasa/data/stories.yml` – Defines conversation flows.

## Deployment
For production deployment, consider using Docker and a cloud server.

### Running Rasa on a Server
1. Start the action server:
   ```bash
   rasa run actions
   ```
2. Run the bot as an API:
   ```bash
   rasa run -m models --enable-api --cors "*"
   ```
