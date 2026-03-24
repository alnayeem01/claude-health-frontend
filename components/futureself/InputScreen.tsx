"use client";

import type { LifestyleInputs } from "./types";

type SliderDef = {
  key: keyof LifestyleInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  description: string;
};

const SLIDERS: SliderDef[] = [
  {
    key: "sleep",
    label: "Sleep Duration",
    min: 4, max: 12, step: 0.5,
    format: (v) => `${v}h`,
    description: "Average hours per night",
  },
  {
    key: "stress",
    label: "Stress Level",
    min: 0, max: 10, step: 1,
    format: (v) => `${v} / 10`,
    description: "Chronic daily stress intensity",
  },
  {
    key: "exercise",
    label: "Exercise Frequency",
    min: 0, max: 7, step: 1,
    format: (v) => `${v}d / wk`,
    description: "Active days per week",
  },
  {
    key: "screenTime",
    label: "Screen Time",
    min: 0, max: 12, step: 0.5,
    format: (v) => `${v}h`,
    description: "Daily non-work screen exposure",
  },
  {
    key: "diet",
    label: "Diet Quality",
    min: 1, max: 10, step: 1,
    format: (v) => `${v} / 10`,
    description: "Nutritional quality of daily intake",
  },
];

type Props = {
  inputs: LifestyleInputs;
  onInputChange: (key: keyof LifestyleInputs, value: number) => void;
  onSimulate: () => void;
};

export default function InputScreen({ inputs, onInputChange, onSimulate }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-lg fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em] mb-4"
            style={{ color: "var(--primary)" }}
          >
            FutureSelf
          </p>
          <h1
            className="text-3xl font-bold tracking-tight mb-3"
            style={{ color: "var(--text-1)" }}
          >
            Health Simulation
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Enter your current lifestyle data. The simulation will project
            your health across a 5-year horizon.
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-5 mb-10">
          {SLIDERS.map((s, idx) => {
            const val = inputs[s.key];
            const pct = ((val - s.min) / (s.max - s.min)) * 100;

            // Determine track color based on value quality
            let trackColor = "var(--primary)";
            if (s.key === "stress" && val >= 7) trackColor = "var(--danger)";
            else if (s.key === "stress" && val >= 4) trackColor = "var(--warning)";
            else if (s.key === "sleep" && (val < 6.5 || val > 9.5)) trackColor = "var(--warning)";
            else if (s.key === "screenTime" && val > 6) trackColor = "var(--danger)";
            else if (s.key === "screenTime" && val > 4) trackColor = "var(--warning)";
            else if (s.key === "diet" && val <= 3) trackColor = "var(--danger)";
            else if (s.key === "diet" && val <= 5) trackColor = "var(--warning)";

            return (
              <div
                key={s.key}
                className="glass rounded-xl px-5 py-4 transition-all duration-200"
                style={{
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-1)" }}
                    >
                      {s.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                      {s.description}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums mt-0.5"
                    style={{ color: trackColor, transition: "color 0.3s ease" }}
                  >
                    {s.format(val)}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
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

        {/* CTA */}
        <button
          onClick={onSimulate}
          className="w-full rounded-xl py-4 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98]"
          style={{
            background: "var(--primary)",
            color: "#0B0F1A",
            boxShadow: "0 0 24px rgba(0,245,212,0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 36px rgba(0,245,212,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(0,245,212,0.3)";
          }}
        >
          Simulate My Future
        </button>

        <p className="text-center text-xs mt-4" style={{ color: "var(--text-3)" }}>
          Simulation uses validated epidemiological risk models
        </p>
      </div>
    </div>
  );
}
