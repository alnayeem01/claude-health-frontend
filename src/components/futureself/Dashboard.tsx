"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { buildInsight, type LifestyleInputs, type HealthMetrics } from "./types";
import Avatar from "./Avatar";
import ScoreCircle from "./ScoreCircle";
import RiskBar from "./RiskBar";
import InsightPanel from "./InsightPanel";
import Particles from "./Particles";

const RISK_TOOLTIPS = {
  heart: "Driven by chronic stress, poor sleep, and low cardio activity.",
  burnout: "Elevated by sustained high stress without adequate recovery.",
  cognitive: "Sleep is the strongest predictor — it impairs memory and attention over time.",
};

const TIMELINE_LABELS: Record<number, string> = {
  0: "Now", 1: "1 yr", 2: "2 yrs", 3: "3 yrs", 4: "4 yrs", 5: "5 yrs",
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
  { key: "sleep",      label: "Sleep",    min: 4,  max: 12, step: 0.5, format: (v) => `${v}h` },
  { key: "stress",     label: "Stress",   min: 0,  max: 10, step: 1,   format: (v) => `${v}/10` },
  { key: "exercise",   label: "Exercise", min: 0,  max: 7,  step: 1,   format: (v) => `${v}d/wk` },
  { key: "screenTime", label: "Screen",   min: 0,  max: 12, step: 0.5, format: (v) => `${v}h` },
  { key: "diet",       label: "Diet",     min: 1,  max: 10, step: 1,   format: (v) => `${v}/10` },
];

const ease = [0.4, 0, 0.2, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: d, ease },
  }),
};

type Props = {
  inputs: LifestyleInputs;
  metrics: HealthMetrics;
  onInputChange: (key: keyof LifestyleInputs, value: number) => void;
  onReset: () => void;
};

export default function Dashboard({ inputs, metrics, onInputChange, onReset }: Props) {
  const [timelineYear, setTimelineYear] = useState(5);
  const insight = useMemo(() => buildInsight(inputs, metrics), [inputs, metrics]);

  const projectedScore = Math.round(metrics.overallScore * (1 - (5 - timelineYear) * 0.018));
  const projectedAge = Math.round(metrics.projectedAge - (5 - timelineYear) * 0.8);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "var(--bg)" }}>
      <Particles count={18} color="#D6D3D1" />

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-40"
        style={{
          background: "rgba(250,250,249,0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: "var(--good)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>FutureSelf</span>
          <span className="text-xs" style={{ color: "var(--text-3)" }}>Live Simulation</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-150"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-2)",
          }}
        >
          New simulation
        </button>
      </header>

      {/* Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-5 p-5 max-w-7xl mx-auto w-full">

        {/* LEFT — Avatar */}
        <motion.aside
          variants={fade}
          custom={0}
          initial="hidden"
          animate="show"
          className="card p-6"
        >
          <Avatar score={projectedScore} projectedAge={projectedAge} />
        </motion.aside>

        {/* CENTER — Metrics */}
        <motion.section
          variants={fade}
          custom={0.2}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {/* Score + Timeline */}
          <div className="card p-6 flex flex-col items-center gap-5">
            <ScoreCircle score={projectedScore} confidence={metrics.confidence} />
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-3)" }}>Timeline</span>
                <span className="font-semibold" style={{ color: "var(--text-1)" }}>{TIMELINE_LABELS[timelineYear]}</span>
              </div>
              <div className="slider-wrap" style={{ height: 20 }}>
                <div className="slider-track">
                  <div className="slider-fill" style={{ width: `${(timelineYear / 5) * 100}%`, background: "var(--text-1)" }} />
                </div>
                <input
                  type="range"
                  min={0} max={5} step={1}
                  value={timelineYear}
                  onChange={(e) => setTimelineYear(Number(e.target.value))}
                  className="w-full"
                  style={{ background: "transparent" }}
                />
              </div>
              <div className="flex justify-between text-xs" style={{ color: "var(--text-3)" }}>
                <span>Now</span>
                <span>5 years</span>
              </div>
            </div>
          </div>

          {/* Risks */}
          <div className="card p-5 space-y-4 stagger-children">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
              Risk profile
            </p>
            <RiskBar label="Cardiovascular" risk={metrics.heartRisk} tooltip={RISK_TOOLTIPS.heart} />
            <RiskBar label="Burnout" risk={metrics.burnoutRisk} tooltip={RISK_TOOLTIPS.burnout} />
            <RiskBar label="Cognitive decline" risk={metrics.cognitiveRisk} tooltip={RISK_TOOLTIPS.cognitive} />
          </div>

          {/* What-if sliders */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
                Adjust lifestyle
              </p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Real-time</p>
            </div>
            {SLIDERS.map((s) => {
              const val = inputs[s.key];
              const pct = ((val - s.min) / (s.max - s.min)) * 100;
              return (
                <div key={s.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-2)" }}>{s.label}</span>
                    <span className="font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
                      {s.format(val)}
                    </span>
                  </div>
                  <div className="slider-wrap" style={{ height: 20 }}>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: `${pct}%`, background: "var(--text-1)" }} />
                    </div>
                    <input
                      type="range"
                      min={s.min} max={s.max} step={s.step}
                      value={val}
                      onChange={(e) => onInputChange(s.key, Number(e.target.value))}
                      className="w-full"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* RIGHT — Insights */}
        <motion.aside
          variants={fade}
          custom={0.4}
          initial="hidden"
          animate="show"
        >
          <InsightPanel insight={insight} updatedAt="Updated just now" />
        </motion.aside>
      </main>
    </div>
  );
}
