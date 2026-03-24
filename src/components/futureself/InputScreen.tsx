"use client";

import type { LifestyleInputs } from "./types";
import Particles from "./Particles";

type SliderDef = {
  key: keyof LifestyleInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  hint: string;
  icon: string;
  ticks: number;
};

const SLIDERS: SliderDef[] = [
  { key: "sleep",      label: "Sleep",        min: 4, max: 12, step: 0.5, format: (v) => `${v} hrs`,  hint: "per night",              icon: "🌙", ticks: 8 },
  { key: "stress",     label: "Stress",       min: 0, max: 10, step: 1,   format: (v) => `${v}/10`,   hint: "daily intensity",        icon: "⚡", ticks: 10 },
  { key: "exercise",   label: "Exercise",     min: 0, max: 7,  step: 1,   format: (v) => `${v} days`, hint: "active days per week",   icon: "🏃", ticks: 7 },
  { key: "screenTime", label: "Screen time",  min: 0, max: 12, step: 0.5, format: (v) => `${v} hrs`,  hint: "non-work daily",         icon: "📱", ticks: 6 },
  { key: "diet",       label: "Diet quality",  min: 1, max: 10, step: 1,   format: (v) => `${v}/10`,   hint: "nutrition score",        icon: "🥗", ticks: 9 },
];

function getSliderColor(key: keyof LifestyleInputs, val: number): string {
  if (key === "stress") return val >= 7 ? "var(--bad)" : val >= 4 ? "var(--warn)" : "var(--good)";
  if (key === "sleep") return val >= 7 && val <= 9 ? "var(--good)" : val >= 6 ? "var(--warn)" : "var(--bad)";
  if (key === "screenTime") return val <= 3 ? "var(--good)" : val <= 6 ? "var(--warn)" : "var(--bad)";
  if (key === "exercise") return val >= 4 ? "var(--good)" : val >= 2 ? "var(--warn)" : "var(--bad)";
  if (key === "diet") return val >= 7 ? "var(--good)" : val >= 4 ? "var(--warn)" : "var(--bad)";
  return "var(--text-1)";
}

type Props = {
  inputs: LifestyleInputs;
  onInputChange: (key: keyof LifestyleInputs, value: number) => void;
  onSimulate: () => void;
};

export default function InputScreen({ inputs, onInputChange, onSimulate }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-20 relative overflow-hidden">
      <Particles count={15} color="#D6D3D1" />
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "var(--text-3)" }}>
            FutureSelf
          </p>
          <h1 className="text-2xl font-semibold tracking-tight leading-snug mb-2" style={{ color: "var(--text-1)" }}>
            Your lifestyle, projected forward.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Adjust the sliders to match your current habits. We&apos;ll simulate your health trajectory over the next five years.
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-2 mb-10">
          {SLIDERS.map((s) => {
            const val = inputs[s.key];
            const pct = ((val - s.min) / (s.max - s.min)) * 100;
            const fillColor = getSliderColor(s.key, val);

            return (
              <div
                key={s.key}
                className="rounded-xl px-4 py-4 transition-all duration-200"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{s.icon}</span>
                    <div>
                      <p className="text-sm font-medium leading-none" style={{ color: "var(--text-1)" }}>
                        {s.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                        {s.hint}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums px-2 py-0.5 rounded-md"
                    style={{
                      color: fillColor,
                      background: `color-mix(in srgb, ${fillColor} 8%, transparent)`,
                      transition: "color 0.3s ease, background 0.3s ease",
                    }}
                  >
                    {s.format(val)}
                  </span>
                </div>

                {/* Custom slider with track + fill */}
                <div className="slider-wrap" style={{ height: 20 }}>
                  <div className="slider-track">
                    <div
                      className="slider-fill"
                      style={{ width: `${pct}%`, background: fillColor }}
                    />
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
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

        {/* CTA */}
        <button
          onClick={onSimulate}
          className="w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-150 active:scale-[0.98]"
          style={{ background: "var(--text-1)", color: "var(--bg-card)" }}
        >
          Simulate my future
        </button>

        <p className="text-center text-xs mt-5" style={{ color: "var(--text-3)" }}>
          Based on epidemiological risk models
        </p>
      </div>
    </div>
  );
}
