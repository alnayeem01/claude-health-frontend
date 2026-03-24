"use client";

import { getScoreColor } from "./types";

type Props = { score: number; projectedAge: number };

export default function Avatar({ score, projectedAge }: Props) {
  const color = getScoreColor(score);
  const label = score >= 75 ? "Thriving" : score >= 60 ? "Stable" : score >= 45 ? "At risk" : "Critical";

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
        Digital Twin
      </p>

      <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
        {/* Subtle ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 6,
            border: `1.5px solid ${color}40`,
            transition: "border-color 0.5s ease",
          }}
        />

        {/* SVG figure */}
        <div className="animate-breathe relative z-10">
          <svg viewBox="0 0 80 110" width={80} height={110}>
            <defs>
              <linearGradient id="avatarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="20" r="12" fill="url(#avatarGrad)" />
            <rect x="36" y="31" width="8" height="6" rx="3" fill={color} opacity="0.6" />
            <path d="M18 42 Q18 36 40 36 Q62 36 62 42 L59 78 Q56 84 40 84 Q24 84 21 78 Z" fill="url(#avatarGrad)" />
            <path d="M19 44 Q12 52 14 66 Q15 72 20 71 Q24 70 24 64 L22 44" fill={color} opacity="0.45" />
            <path d="M61 44 Q68 52 66 66 Q65 72 60 71 Q56 70 56 64 L58 44" fill={color} opacity="0.45" />
            <rect x="24" y="82" width="14" height="20" rx="5" fill={color} opacity="0.5" />
            <rect x="42" y="82" width="14" height="20" rx="5" fill={color} opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Score + label */}
      <div className="text-center">
        <p className="text-2xl font-semibold tabular-nums" style={{ color, transition: "color 0.4s ease" }}>
          {score}
          <span className="text-sm font-normal ml-0.5" style={{ color: "var(--text-3)" }}>/100</span>
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color, transition: "color 0.4s ease" }}>
          {label}
        </p>
      </div>

      {/* Lifespan */}
      <div className="w-full text-center py-3 rounded-xl" style={{ background: "var(--bg-inset)" }}>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>Projected lifespan</p>
        <p className="text-lg font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
          {projectedAge} <span className="text-sm font-normal" style={{ color: "var(--text-3)" }}>years</span>
        </p>
      </div>
    </div>
  );
}
