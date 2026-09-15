# Health Twin — AI Health Simulation Prototype

The frontend for **Health Twin**, a team-built AI health simulation prototype developed during the Claude Hackathon at Imperial College London.

The project explores how lifestyle choices such as sleep, exercise, stress and diet can influence possible long-term outcomes. Users enter lifestyle information, run a simulation and explore the results through an interactive dashboard.

> Prototype only — not medical advice. Uses synthetic profiles and is intended for demonstration and experimentation.

## What I built

This repository contains the web application for the Health Twin experience:

- Interactive lifestyle input interface
- Simulation processing experience
- Health metrics and future-self dashboard
- AI-generated insights returned by the backend
- Responsive UI with animated interactions
- API integration with the Express backend

## Tech Stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **Amazon Bedrock** — AI processing is handled by the backend

## Architecture

```text
User
 ↓
Next.js / React frontend
 ↓
Express REST API
 ↓
PostgreSQL + Amazon Bedrock
 ↓
Simulation results
 ↓
Interactive dashboard
```

The backend repository contains the REST API, PostgreSQL persistence and Bedrock integration:

**Backend:** https://github.com/alnayeem01/claude-event-health-twin-backend

## Running locally

Requirements:

- Node.js 20+
- Backend API running locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000` and configure `NEXT_PUBLIC_API_BASE_URL` to point to the backend API.

## Project context

**Event:** Claude Hackathon, Imperial College London  
**Track:** Biology & Physical Health

This was developed collaboratively as a team project. The frontend was built as part of the full-stack application connecting the user experience with the simulation API and AI workflow.

## Safeguards

- No real personal health information should be used.
- Simulations are not medical advice or clinical predictions.
- AI-generated outputs may be inaccurate.
- Scores and projections are illustrative rather than clinically validated.
- Use synthetic profiles for testing and demonstrations.
