"use client";

import type { LifestyleInputs } from "./types";

type SliderDef = {
  key: keyof LifestyleInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  hint: string;
};

const SLIDERS: SliderDef[] = [
  { key: "sleep",      label: "Sleep",           min: 4, max: 12, step: 0.5, format: (v) => `${v} hrs`,    hint: "Hours per night" },
  { key: "stress",     label: "Stress",          min: 0, max: 10, step: 1,   format: (v) => `${v}/10`,     hint: "Daily intensity" },
  { key: "exercise",   label: "Exercise",        min: 0, max: 7,  step: 1,   format: (v) => `${v} days`,   hint: "Active days per week" },
  { key: "screenTime", label: "Screen time",     min: 0, max: 12, step: 0.5, format: (v) => `${v} hrs`,    hint: "Non-work daily exposure" },
  { key: "diet",       label: "Diet quality",    min: 1, max: 10, step: 1,   format: (v) => `${v}/10`,     hint: "Overall nutrition score" },
];

type Props = {
  inputs: LifestyleInputs;
  onInputChange: (key: keyof LifestyleInputs, value: number) => void;
  onSimulate: () => void;
};

export default function InputScreen({ inputs, onInputChange, onSimulate }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-20">
      <div className="w-full max-w-md">
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
        <div className="space-y-1 mb-10">
          {SLIDERS.map((s) => {
            const val = inputs[s.key];
            const pct = ((val - s.min) / (s.max - s.min)) * 100;
            return (
              <div key={s.key} className="py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                      {s.label}
                    </span>
                    <span className="text-xs ml-2" style={{ color: "var(--text-3)" }}>
                      {s.hint}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
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
                    background: `linear-gradient(to right, var(--text-1) ${pct}%, var(--border) ${pct}%)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={onSimulate}
          className="w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-150 active:scale-[0.98]"
          style={{
            background: "var(--text-1)",
            color: "var(--bg-card)",
          }}
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
