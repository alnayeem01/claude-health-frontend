import { type HealthMetrics, type LifestyleInputs, getScoreColor, getRiskColor } from "./types";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  onChange: (v: number) => void;
};

function Slider({ label, value, min, max, step, unit, color, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

type RiskBarProps = {
  label: string;
  risk: number;
};

function RiskBar({ label, risk }: RiskBarProps) {
  const color = getRiskColor(risk);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>
          {risk}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="risk-bar-fill h-full rounded-full"
          style={{ width: `${risk}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

type Props = {
  inputs: LifestyleInputs;
  metrics: HealthMetrics;
  timelineYear: number;
  onInputChange: (key: keyof LifestyleInputs, value: number) => void;
  onTimelineChange: (year: number) => void;
};

export default function MetricsPanel({
  inputs,
  metrics,
  timelineYear,
  onInputChange,
  onTimelineChange,
}: Props) {
  const color = getScoreColor(metrics.overallScore);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - metrics.overallScore / 100);

  return (
    <div className="space-y-5 animate-fade-up-delay-1">
      {/* Score ring */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Health Score
        </p>
        <div className="relative" style={{ width: 140, height: 140 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Track */}
            <circle
              cx="70" cy="70" r="52"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="70" cy="70" r="52"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              className="score-ring-path"
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums" style={{ color }}>
              {metrics.overallScore}
            </span>
            <span className="text-xs text-slate-400">out of 100</span>
          </div>
        </div>
      </div>

      {/* Risk bars */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
          Risk Profile
        </p>
        <RiskBar label="Heart Disease" risk={metrics.heartRisk} />
        <RiskBar label="Burnout" risk={metrics.burnoutRisk} />
        <RiskBar label="Obesity" risk={metrics.obesityRisk} />
        <RiskBar label="Cognitive Decline" risk={metrics.cognitiveRisk} />
      </div>

      {/* Timeline slider */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Future Timeline
          </p>
          <span className="text-xs font-bold text-cyan-400">+{timelineYear - 2025} yrs</span>
        </div>
        <Slider
          label=""
          value={timelineYear}
          min={2025}
          max={2040}
          step={1}
          unit=""
          color="#06b6d4"
          onChange={(v) => onTimelineChange(v)}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Now</span>
          <span>{timelineYear}</span>
          <span>2040</span>
        </div>
      </div>

      {/* Lifestyle sliders */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
          Lifestyle Inputs
        </p>
        <Slider
          label="Sleep"
          value={inputs.sleep}
          min={4} max={12} step={0.5}
          unit="h"
          color="#8b5cf6"
          onChange={(v) => onInputChange("sleep", v)}
        />
        <Slider
          label="Stress Level"
          value={inputs.stress}
          min={0} max={10} step={1}
          unit="/10"
          color={inputs.stress >= 7 ? "#ef4444" : inputs.stress >= 4 ? "#f59e0b" : "#10b981"}
          onChange={(v) => onInputChange("stress", v)}
        />
        <Slider
          label="Exercise"
          value={inputs.exercise}
          min={0} max={7} step={1}
          unit="d/wk"
          color="#06b6d4"
          onChange={(v) => onInputChange("exercise", v)}
        />
        <Slider
          label="Screen Time"
          value={inputs.screenTime}
          min={0} max={12} step={0.5}
          unit="h"
          color={inputs.screenTime > 6 ? "#ef4444" : inputs.screenTime > 3 ? "#f59e0b" : "#10b981"}
          onChange={(v) => onInputChange("screenTime", v)}
        />
      </div>
    </div>
  );
}
