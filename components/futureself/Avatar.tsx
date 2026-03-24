"use client";

import { getScoreColor } from "./types";

type Props = {
  score: number;
  projectedAge: number;
};

export default function Avatar({ score, projectedAge }: Props) {
  const color = getScoreColor(score);
  const glowOpacity = score >= 72 ? 0.55 : score >= 50 ? 0.45 : 0.6;
  const label =
    score >= 75 ? "Thriving" :
    score >= 60 ? "Stable" :
    score >= 45 ? "At Risk" :
    "Critical";

  return (
    <div className="flex flex-col items-center gap-5">
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--text-3)" }}
      >
        Your Future Self · 5-Year Projection
      </p>

      {/* Avatar container */}
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {/* Outer slow glow ring */}
        <div
          className="absolute inset-0 rounded-full animate-glow-ring"
          style={{
            background: `radial-gradient(circle at center, ${color}18 0%, transparent 68%)`,
            transition: "background 0.5s ease",
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 18,
            border: `1px solid ${color}55`,
            boxShadow: `0 0 20px ${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`,
            borderRadius: "9999px",
            transition: "border-color 0.5s ease, box-shadow 0.5s ease",
          }}
        />

        {/* SVG figure with breathing */}
        <div className="animate-breathe relative z-10">
          <svg
            viewBox="0 0 80 110"
            width={96}
            height={132}
          >
            <defs>
              <radialGradient id="fg" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={color} stopOpacity="0.45" />
              </radialGradient>
              <filter id="soft-glow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Head */}
            <circle
              cx="40" cy="20" r="13"
              fill="url(#fg)"
              filter="url(#soft-glow)"
            />

            {/* Neck */}
            <rect x="36" y="31" width="8" height="7" rx="3" fill={color} opacity="0.65" />

            {/* Torso */}
            <path
              d="M16 42 Q16 36 40 36 Q64 36 64 42 L61 80 Q58 86 40 86 Q22 86 19 80 Z"
              fill="url(#fg)"
              filter="url(#soft-glow)"
            />

            {/* Scan lines */}
            {[53, 62, 71].map((y) => (
              <line
                key={y}
                x1="22" y1={y} x2="58" y2={y}
                stroke={color}
                strokeWidth="0.4"
                opacity="0.3"
              />
            ))}

            {/* Heart beat indicator */}
            <circle cx="40" cy="57" r="2.5" fill="#fff" opacity="0.85" />
            <line x1="30" y1="57" x2="35" y2="57" stroke="#fff" strokeWidth="0.6" opacity="0.4" />
            <line x1="45" y1="57" x2="50" y2="57" stroke="#fff" strokeWidth="0.6" opacity="0.4" />

            {/* Left arm */}
            <path
              d="M17 44 Q10 52 12 68 Q13 74 18 73 Q23 72 24 66 L22 44"
              fill={color}
              opacity="0.55"
            />
            {/* Right arm */}
            <path
              d="M63 44 Q70 52 68 68 Q67 74 62 73 Q57 72 56 66 L58 44"
              fill={color}
              opacity="0.55"
            />

            {/* Legs */}
            <rect x="22" y="84" width="16" height="22" rx="6" fill={color} opacity="0.6" />
            <rect x="42" y="84" width="16" height="22" rx="6" fill={color} opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Score label */}
      <div className="text-center space-y-1">
        <p
          className="text-2xl font-bold tabular-nums"
          style={{ color, transition: "color 0.5s ease" }}
        >
          {score}
          <span className="text-sm font-normal ml-1" style={{ color: "var(--text-3)" }}>
            / 100
          </span>
        </p>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color, transition: "color 0.5s ease" }}
        >
          {label}
        </p>
      </div>

      {/* Lifespan card */}
      <div
        className="w-full glass rounded-xl px-5 py-3 text-center"
        style={{ transition: "all 0.4s ease" }}
      >
        <p className="text-xs mb-0.5" style={{ color: "var(--text-3)" }}>
          Projected Healthy Lifespan
        </p>
        <p
          className="text-xl font-bold tabular-nums"
          style={{ color: "var(--text-1)" }}
        >
          {projectedAge}
          <span className="text-sm font-normal ml-1" style={{ color: "var(--text-2)" }}>
            yrs
          </span>
        </p>
      </div>
    </div>
  );
}
