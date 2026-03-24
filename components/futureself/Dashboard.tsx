"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  computeHealth,
  buildInsight,
  type LifestyleInputs,
} from "./types";
import Avatar from "./Avatar";
import ScoreCircle from "./ScoreCircle";
import RiskBar from "./RiskBar";
import InsightPanel from "./InsightPanel";

const RISK_TOOLTIPS = {
  heart: "Driven by chronic stress, poor sleep, and low cardio activity. Key markers: cortisol, resting heart rate, HRV.",
  burnout: "Elevated by sustained high stress without adequate recovery. Leads to emotional exhaustion and reduced performance.",
  cognitive:
    "Sleep is the strongest predictor. Poor sleep impairs memory consolidation, attention, and neuroplasticity over time.",
};

const TIMELINE_LABELS: Record<number, string> = {
  0: "Now",
  1: "1 year",
  2: "2 years",
  3: "3 years",
  4: "4 years",
  5: "5 years",
};

type SliderDef = {
  key: keyof LifestyleInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

const SLIDERS: SliderDef[] = [
  { key: "sleep",      label: "Sleep",     min: 4,  max: 12, step: 0.5, format: (v) => `${v}h` },
  { key: "stress",     label: "Stress",    min: 0,  max: 10, step: 1,   format: (v) => `${v}/10` },
  { key: "exercise",   label: "Exercise",  min: 0,  max: 7,  step: 1,   format: (v) => `${v}d/wk` },
  { key: "screenTime", label: "Screen",    min: 0,  max: 12, step: 0.5, format: (v) => `${v}h` },
  { key: "diet",       label: "Diet",      min: 1,  max: 10, step: 1,   format: (v) => `${v}/10` },
];

const panelVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

type Props = {
  inputs: LifestyleInputs;
  metrics: ReturnType<typeof computeHealth>;
  onInputChange: (key: keyof LifestyleInputs, value: number) => void;
  onReset: () => void;
};

export default function Dashboard({ inputs, metrics, onInputChange, onReset }: Props) {
  const [timelineYear, setTimelineYear] = useState(5);
  const updatedAt = useMemo(
    () => `Simulation updated just now`,
    // Intentional: capture once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const insight = useMemo(() => buildInsight(inputs, metrics), [inputs, metrics]);

  // Scale projected metrics slightly based on timeline year (demonstration)
  const projectedScore = Math.round(
    metrics.overallScore * (1 - (5 - timelineYear) * 0.018)
  );
  const projectedAge = Math.round(metrics.projectedAge - (5 - timelineYear) * 0.8);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(11,15,26,0.9)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background: "var(--primary)",
              boxShadow: "0 0 8px var(--primary)",
              animation: "pulse 2s infinite",
            }}
          />
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
            FutureSelf
          </span>
          <span className="text-xs" style={{ color: "var(--text-3)" }}>
            · Health Simulation
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            color: "var(--text-2)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
        >
          ← New Simulation
        </button>
      </header>

      {/* 3-column grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-5 p-5 max-w-7xl mx-auto w-full">

        {/* LEFT: Avatar */}
        <motion.aside
          variants={panelVariants}
          initial="hidden"
          animate="show"
          className="glass rounded-2xl p-6"
        >
          <Avatar score={projectedScore} projectedAge={projectedAge} />
        </motion.aside>

        {/* CENTER: Metrics + What-if sliders */}
        <motion.section
          variants={panelVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.28 }}
          className="space-y-4"
        >
          {/* Score + Timeline */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-5">
            <ScoreCircle score={projectedScore} confidence={metrics.confidence} />

            {/* Timeline slider */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs" style={{ color: "var(--text-3)" }}>
                <span>Timeline</span>
                <span style={{ color: "var(--primary)" }}>{TIMELINE_LABELS[timelineYear]}</span>
              </div>
              <input
                type="range"
                min={0} max={5} step={1}
                value={timelineYear}
                onChange={(e) => setTimelineYear(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${(timelineYear / 5) * 100}%, rgba(255,255,255,0.08) ${(timelineYear / 5) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-xs" style={{ color: "var(--text-3)" }}>
                <span>Now</span>
                <span>5 years</span>
              </div>
            </div>
          </div>

          {/* Risk bars */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--text-3)" }}
            >
              Risk Indicators
            </p>
            <RiskBar
              label="Cardiovascular Risk"
              risk={metrics.heartRisk}
              tooltip={RISK_TOOLTIPS.heart}
            />
            <RiskBar
              label="Burnout Risk"
              risk={metrics.burnoutRisk}
              tooltip={RISK_TOOLTIPS.burnout}
            />
            <RiskBar
              label="Cognitive Decline Risk"
              risk={metrics.cognitiveRisk}
              tooltip={RISK_TOOLTIPS.cognitive}
            />
          </div>

          {/* What-if sliders */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--text-3)" }}
              >
                What-If Simulation
              </p>
              <span className="text-xs" style={{ color: "var(--text-3)" }}>
                Adjust to explore
              </span>
            </div>
            {SLIDERS.map((s) => {
              const val = inputs[s.key];
              const pct = ((val - s.min) / (s.max - s.min)) * 100;

              let trackColor = "var(--primary)";
              if (s.key === "stress" && val >= 7) trackColor = "var(--danger)";
              else if (s.key === "stress" && val >= 4) trackColor = "var(--warning)";
              else if (s.key === "sleep" && (val < 6.5 || val > 9.5)) trackColor = "var(--warning)";
              else if (s.key === "screenTime" && val > 6) trackColor = "var(--danger)";
              else if (s.key === "screenTime" && val > 3) trackColor = "var(--warning)";
              else if (s.key === "diet" && val <= 3) trackColor = "var(--danger)";
              else if (s.key === "diet" && val <= 5) trackColor = "var(--warning)";

              return (
                <div key={s.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-2)" }}>{s.label}</span>
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: trackColor, transition: "color 0.3s ease" }}
                    >
                      {s.format(val)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min} max={s.max} step={s.step}
                    value={val}
                    onChange={(e) => onInputChange(s.key, Number(e.target.value))}
                    className="w-full"
                    style={{
                      background: `linear-gradient(to right, ${trackColor} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
                      transition: "background 0.15s ease",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* RIGHT: AI Insights */}
        <motion.aside
          variants={panelVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.56 }}
        >
          <InsightPanel insight={insight} updatedAt={updatedAt} />
        </motion.aside>
      </main>
    </div>
  );
}
