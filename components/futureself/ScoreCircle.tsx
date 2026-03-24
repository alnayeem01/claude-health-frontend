"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "./types";

const R = 48;
const CIRC = 2 * Math.PI * R;

function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
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
  const display = useCountUp(score);
  const color = getScoreColor(display);
  const offset = CIRC * (1 - display / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
        Health Score
      </p>

      <div className="relative" style={{ width: 132, height: 132 }}>
        <svg width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="var(--bg-inset)" strokeWidth="7" />
          <circle
            cx="66" cy="66" r={R}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 66 66)"
            className="score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
            {display}
          </span>
        </div>
      </div>

      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full"
        style={{
          background: "var(--bg-inset)",
          color: "var(--text-2)",
        }}
      >
        {confidence} confidence
      </span>
    </div>
  );
}
