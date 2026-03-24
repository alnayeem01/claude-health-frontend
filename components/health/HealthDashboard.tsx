"use client";

import { useState, useMemo } from "react";
import { computeHealth, generateInsights, type LifestyleInputs } from "./types";
import AvatarPanel from "./AvatarPanel";
import MetricsPanel from "./MetricsPanel";
import InsightsPanel from "./InsightsPanel";

const DEFAULT_INPUTS: LifestyleInputs = {
  sleep: 7,
  stress: 5,
  exercise: 3,
  screenTime: 5,
};

export default function HealthDashboard() {
  const [inputs, setInputs] = useState<LifestyleInputs>(DEFAULT_INPUTS);
  const [timelineYear, setTimelineYear] = useState(2030);

  const metrics = useMemo(() => computeHealth(inputs), [inputs]);
  const insights = useMemo(() => generateInsights(inputs, metrics), [inputs, metrics]);

  function handleInputChange(key: keyof LifestyleInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/60 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-base font-bold text-slate-100 tracking-tight">
            Health Simulator
          </h1>
          <p className="text-xs text-slate-500">Your AI-powered digital twin</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live simulation</span>
        </div>
      </header>

      {/* Dashboard grid */}
      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-5">
        {/* Left: Avatar */}
        <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <AvatarPanel score={metrics.overallScore} projectedAge={metrics.projectedAge} />
        </aside>

        {/* Center: Metrics + Sliders */}
        <section>
          <MetricsPanel
            inputs={inputs}
            metrics={metrics}
            timelineYear={timelineYear}
            onInputChange={handleInputChange}
            onTimelineChange={setTimelineYear}
          />
        </section>

        {/* Right: Insights */}
        <aside>
          <InsightsPanel
            insights={insights}
            score={metrics.overallScore}
            timelineYear={timelineYear}
          />
        </aside>
      </main>
    </div>
  );
}
