"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "./types";

const R = 52;
const CIRC = 2 * Math.PI * R;

function useCountUp(target: number, duration = 1100): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

type Props = { score: number; confidence: string };

export default function ScoreCircle({ score, confidence }: Props) {
  const displayScore = useCountUp(score);
  const color = getScoreColor(displayScore);
  const offset = CIRC * (1 - displayScore / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--text-3)" }}
      >
        Health Score
      </p>

      <div className="relative" style={{ width: 148, height: 148 }}>
        <svg width="148" height="148" viewBox="0 0 148 148">
          {/* Background track */}
          <circle
            cx="74" cy="74" r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="9"
          />
          {/* Progress arc */}
          <circle
            cx="74" cy="74" r={R}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 74 74)"
            className="score-ring-path"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color, transition: "color 0.4s ease" }}
          >
            {displayScore}
          </span>
          <span className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
            / 100
          </span>
        </div>
      </div>

      {/* Confidence badge */}
      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
        <span className="text-xs" style={{ color: "var(--text-2)" }}>
          Prediction Confidence:{" "}
          <span className="font-semibold">{confidence}</span>
        </span>
      </div>
    </div>
  );
}
