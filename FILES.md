# File Checklist

Track every file in the project. Check off as you verify each one is complete.

## Config & root

- [x] `package.json` — dependencies (next, react, @google/generative-ai)
- [x] `tsconfig.json`
- [x] `next.config.ts`
- [x] `.env.local.example` — documents GEMINI_API_KEY
- [ ] `.env.local` — your real key (gitignored, never commit)

## App (Next.js App Router)

- [x] `app/layout.tsx` — root layout, metadata, fonts
- [x] `app/page.tsx` — landing page, renders DecisionForm
- [x] `app/globals.css` — Tailwind v4 import + base styles
- [x] `app/api/simulate/route.ts` — POST handler, Gemini call, JSON parse

## Components

- [x] `components/DecisionForm.tsx` — decision/loading/result state, form submit
- [x] `components/LoadingState.tsx` — spinner + "Simulating parallel universes…"
- [x] `components/ResultView.tsx` — two-column grid, metrics bar
- [x] `components/TimelineCard.tsx` — year + story card (green/red variant)

## Lib

- [x] `lib/api.ts` — TypeScript types (TimelineEntry, SimulateResponse) + simulateDecision()

## Push when ready

```bash
git add .
git commit -m "feat: parallel universe simulator"
git push -u origin main
```
