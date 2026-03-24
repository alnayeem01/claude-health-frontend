# Parallel Universe Simulator

> Every decision creates a different future. See both.

Enter any life decision and the AI simulates two 5-year timelines — one where you take it, one where you don't.

## Setup

```bash
npm install
cp .env.local.example .env.local
# add your GEMINI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo input

> Should I quit my job to start a startup?

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Google Gemini API (`gemini-2.0-flash`)
