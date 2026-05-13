# Twilight Sparkle Learning Bot

An AI-powered personal learning assistant delivered as a Telegram bot, built with [n8n](https://n8n.io). The bot helps users learn new material through intelligent summarization and quiz generation.

**Bot:** [@twilight_sparkle_learning_bot](https://t.me/twilight_sparkle_learning_bot)

---

## Features

- **Material processing** — submit any URL and receive a structured summary with key points, main concepts, and difficulty level.
- **Quiz generation** — AI-generated multiple-choice quizzes based on your saved materials.
- **Answer validation & scoring** — instant feedback on each answer with explanations for incorrect responses and a final score summary.
- **Persistent storage** — saved materials and progress are retained between sessions.

---

## How to Use the Bot

### Step 1 — Start the bot

1. Open Telegram and search for **@twilight_sparkle_learning_bot** (or use [this link](https://t.me/twilight_sparkle_learning_bot)).
2. Press **Start** or send `/start`.
3. The bot will reply with a welcome message listing available commands.

### Step 2 — Learn from a URL

1. Send `/learn` followed by a URL, for example:
   ```
   /learn https://en.wikipedia.org/wiki/Photosynthesis
   ```
2. Wait 15–30 seconds while the bot fetches the page, extracts the content, and generates a summary.
3. The bot will reply with:
   - A **title** for the material
   - A **difficulty level** (beginner / intermediate / advanced)
   - A **brief overview** (2–3 sentences)
   - **5–7 key points** extracted from the content
   - **Main concepts** identified in the material
4. You can submit multiple URLs to build a library of learning materials.

### Step 3 — Take a quiz

1. Send `/quiz`.
2. The bot will display your saved topics as **inline buttons**. Tap the topic you want to be quizzed on.
3. Wait 10–20 seconds while the AI generates 5 multiple-choice questions.
4. For each question:
   - Read the question and four answer options (A, B, C, D).
   - Tap the button corresponding to your answer.
   - The bot will immediately tell you if you were correct (✅) or incorrect (❌), along with an explanation if you got it wrong.
   - The next question is sent automatically.
5. After all 5 questions, the bot displays a **results summary**:
   - Your score as a fraction and percentage (e.g. 4/5 — 80%)
   - Per-question breakdown with correct/incorrect indicators
   - Explanations for any questions you missed

### Step 4 — Keep learning

- Submit more URLs with `/learn` to expand your material library.
- Retake quizzes with `/quiz` to reinforce your knowledge — questions are regenerated each time.
- Send `/start` at any time to see the help message again.

---

## Command Reference

| Command | Description |
|---------|-------------|
| `/start` | Display welcome message and usage instructions |
| `/learn [URL]` | Submit a URL to extract and summarize learning material |
| `/quiz` | Start a quiz on one of your saved materials |

---

## Architecture Overview

The bot is built as a single n8n workflow with the following components:

1. **Telegram Trigger** — receives messages and inline button callbacks from users.
2. **Command Router** (Switch node) — routes incoming messages to the appropriate handler based on the command (`/start`, `/learn`, `/quiz`, or callback query).
3. **Teacher AI Agent** — analyzes submitted content and produces structured summaries with key points and difficulty assessment.
4. **Examiner AI Agent** — generates 5 multiple-choice quiz questions from saved material, validates answers, and calculates scores.
5. **Static Data Storage** — n8n workflow static data is used to persist learning materials and quiz state between sessions.

---

## Technology Stack

- **n8n** — workflow automation platform (cloud trial)
- **Telegram Bot API** — user interface via Telegram
- **Built-in n8n AI nodes** — GPT-powered Teacher and Examiner agents (no extra subscriptions needed)

