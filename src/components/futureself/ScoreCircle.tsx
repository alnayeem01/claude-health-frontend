"use client";

import { useEffect, useState, useMemo } from "react";
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

  // Tick marks around the ring
  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const isMajor = i % 15 === 0;
      const inner = isMajor ? 38 : 41;
      const outer = 44;
      items.push({
        x1: 66 + inner * Math.cos(rad),
        y1: 66 + inner * Math.sin(rad),
        x2: 66 + outer * Math.cos(rad),
        y2: 66 + outer * Math.sin(rad),
        major: isMajor,
      });
    }
    return items;
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
        Health Score
      </p>

      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 132 132">
          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="var(--border)"
              strokeWidth={t.major ? "1" : "0.4"}
              opacity={t.major ? 0.6 : 0.3}
            />
          ))}

          {/* Background track */}
          <circle cx="66" cy="66" r={R} fill="none" stroke="var(--bg-inset)" strokeWidth="7" />

          {/* Progress arc */}
          <circle
            cx="66" cy="66" r={R}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 66 66)"
            className="score-ring score-ring-shimmer"
          />

          {/* Animated dot at the tip of the arc */}
          {display > 0 && (() => {
            const angle = ((display / 100) * 360 - 90) * (Math.PI / 180);
            const cx = 66 + R * Math.cos(angle);
            const cy = 66 + R * Math.sin(angle);
            return (
              <circle
                cx={cx} cy={cy} r="4"
                fill="var(--bg-card)"
                stroke={color}
                strokeWidth="2"
                style={{ transition: "stroke 0.4s" }}
              />
            );
          })()}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
            {display}
          </span>
          <span className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>/100</span>
        </div>
      </div>

      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5"
        style={{ background: "var(--bg-inset)", color: "var(--text-2)" }}
      >
        <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        {confidence} confidence
      </span>
    </div>
  );
}
