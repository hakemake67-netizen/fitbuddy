# FitBuddy

FitBuddy is a fitness planning app with workout tracking, nutrition guidance, and an AI coach.

## Run locally

Prerequisite: Node.js 22.12 or newer.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable Gemini-powered features.
3. Start the app with `npm run dev` and open http://localhost:3000.

The app stores local profiles and workout plans in `data/fitbuddy_store.json`. This file is excluded from Git.

## Checks

- `npm run lint`
- `npm run build`
