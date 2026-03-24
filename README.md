# Health Twin — Frontend (FutureSelf)

**Keywords / discoverability:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · digital health · health dashboard · lifestyle simulation · preventive wellness · health literacy · AWS Bedrock · Claude · Imperial College London · Claude Builder Club · Spring 2026 · social impact · “future self” visualization

---

## Health Twin in plain terms

**Claude Builder Club · Imperial · Spring 2026**

**Health Twin** helps you see how **today’s habits might shape your future self** — with clear numbers, plain-language insight, and AI that **supports your choices** (it does not replace doctors).

**Track:** Biology & Physical Health · Social impact prototype

---

### The problem

Health advice is everywhere, but it rarely feels **personal** or **actionable**. People struggle to connect sleep, stress, diet, and movement to longer-term risk — especially when information is dense, expensive, or buried in jargon.

- Hard to reason about tradeoffs (“what if I fix sleep but stress stays high?”)
- **Low health literacy** blocks better decisions before care is even needed

### Who it’s for

**Busy students and young professionals** who want a **lightweight, honest mirror — not a diagnosis** — to motivate small, realistic changes before problems compound.

- Someone who already “tracks life in their head” but wants **structure**
- Anyone who benefits from **explainable scores + narrative insight**

### What we built (prototype)

| Piece | What you get |
|--------|----------------|
| **Inputs** | Age, body metrics, sleep, stress, exercise, screen time, diet |
| **Transparent model** | BMI, overall score, heart / burnout / cognitive risk, projected “health age” |
| **Claude (Bedrock)** | Structured insight: observation, risk framing, recommendation, “why,” how to improve (generated on the **API** after you click simulate) |
| **This UI** | Input → processing → dashboard with live sliders and insight panel |
| **History** | Runs are **saved on the server**; the API exposes history and get-by-id — this app is centered on **simulate → dashboard**; you can extend the UI to list past runs |

### Human impact

AI here **clarifies and coaches**; it **doesn’t replace clinicians**. The goal is **agency**: understand patterns, name one or two levers, and feel less alone improving habits.

- Reduces “mystery” around lifestyle and downstream risk  
- Supports **dignity** — suggestions, not commands  

### Ethics & safeguards

- **Not medical advice** — clear handoff when professional care is needed  
- **Honest limits** — confidence and uncertainty should stay visible in product design  
- **Privacy** — health-adjacent data must be treated seriously in any real deployment  
- **Bias & fairness** — scores are **illustrative**; real populations need validation and inclusive testing  

### Technical snapshot (stack)

- **Backend (repo root):** Node/Express — validation, deterministic `computeHealth`, **Bedrock** insight generation, **persisted** health runs  
- **This frontend:** Next.js app aligned with the same flow: simulate via `POST /api/health/simulate`, then dashboard with **live** metric updates from the client model  

**Monorepo:** parent folder [`health-twin`](../) — run the API from the repo root.

---

## Requirements

- Node 20+ (recommended)  
- Backend running with CORS allowing this origin (root `.env.example`: `FRONTEND_ORIGIN`)  

---

## Setup

```bash
cd claude-health-frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Match `NEXT_PUBLIC_API_BASE_URL` in [`.env.example`](.env.example) to the API `PORT` (default **3001**). No trailing slash.

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## App structure

| Path | Role |
|------|------|
| `src/app/` | App Router — `page.tsx` mounts FutureSelf |
| `src/components/futureself/` | Input, processing, dashboard, insight UI |
| `src/lib/healthApi.ts` | Typed client for `NEXT_PUBLIC_API_BASE_URL` |

---

## Submission & thanks

**Devpost:** [Claude Hackathon at Imperial](https://claude-hackathon-at-imperial.devpost.com/)

Thank you to **Imperial CBC**, Anthropic’s *Machines of Loving Grace* vision, and our **judges** — we’re excited to keep building tools where AI helps people flourish.

Questions welcome · **Health Twin** team

---

## Disclaimer

Educational prototype only — **not medical advice.** See the root [README](../README.md) for environment variables and full repo setup.
