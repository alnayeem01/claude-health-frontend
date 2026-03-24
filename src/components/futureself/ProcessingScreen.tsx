"use client";

import { useEffect, useState, useMemo } from "react";
import Particles from "./Particles";

const MESSAGES = [
  "Analyzing lifestyle patterns",
  "Mapping long-term health signals",
  "Generating your digital twin",
  "Calibrating risk models",
  "Finalizing projections",
];

function buildECGPath(cycles: number): string {
  const W = 60;
  let d = "M0,40 ";
  for (let c = 0; c < cycles; c++) {
    const x = c * W;
    d +=
      `L${x + 8},40 L${x + 11},37 L${x + 14},43 L${x + 17},40 ` +
      `L${x + 19},34 L${x + 20},8 L${x + 21},68 L${x + 23},40 ` +
      `L${x + 27},40 L${x + 30},34 L${x + 34},46 L${x + 38},40 L${x + W},40 `;
  }
  return d;
}

const CYCLES = 14;
const SVG_WIDTH = CYCLES * 60;
const ECG_PATH = buildECGPath(CYCLES);

function DNAHelix() {
  const strands = useMemo(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 4;
      const y = 10 + (i / 12) * 80;
      const x1 = 50 + Math.sin(angle) * 18;
      const x2 = 50 - Math.sin(angle) * 18;
      const opacity = 0.2 + Math.cos(angle) * 0.15;
      items.push({ y, x1, x2, opacity, r: 2 + Math.abs(Math.cos(angle)) * 1 });
    }
    return items;
  }, []);

  return (
    <div style={{ perspective: 200, width: 100, height: 100 }}>
      <svg
        viewBox="0 0 100 100"
        width={100}
        height={100}
        style={{ animation: "helix-rotate 4s linear infinite" }}
      >
        {strands.map((s, i) => (
          <g key={i}>
            <circle cx={s.x1} cy={s.y} r={s.r} fill="var(--text-3)" opacity={s.opacity + 0.15} />
            <circle cx={s.x2} cy={s.y} r={s.r} fill="var(--text-3)" opacity={s.opacity + 0.15} />
            <line
              x1={s.x1} y1={s.y} x2={s.x2} y2={s.y}
              stroke="var(--border-strong)"
              strokeWidth="0.5"
              opacity={s.opacity}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

type Props = {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
};

export default function ProcessingScreen({ loading, error, onRetry, onBack }: Props) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgKey, setMsgKey] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading || error) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
      setMsgKey((k) => k + 1);
    }, 1400);
    return () => clearInterval(interval);
  }, [loading, error]);

  useEffect(() => {
    if (!loading || error) {
      setProgress(error ? 0 : 1);
      return;
    }
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / 8000, 0.92);
      setProgress(p);
      if (loading && !error && p < 0.92) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loading, error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-5" style={{ background: "var(--bg)" }}>
      <Particles count={20} color="#A8A29E" />

      <div className="absolute top-0 w-full overflow-hidden" style={{ height: 80, opacity: 0.15 }}>
        <div className="ecg-track flex" style={{ width: SVG_WIDTH * 2 }}>
          {[0, 1].map((copy) => (
            <svg key={copy} width={SVG_WIDTH} height={80} viewBox={`0 0 ${SVG_WIDTH} 80`} fill="none" style={{ flexShrink: 0 }}>
              <path d={ECG_PATH} stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 w-full overflow-hidden" style={{ height: 80, opacity: 0.08, transform: "scaleY(-1)" }}>
        <div className="ecg-track flex" style={{ width: SVG_WIDTH * 2 }}>
          {[0, 1].map((copy) => (
            <svg key={copy} width={SVG_WIDTH} height={80} viewBox={`0 0 ${SVG_WIDTH} 80`} fill="none" style={{ flexShrink: 0 }}>
              <path d={ECG_PATH} stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-7 z-10 max-w-sm w-full">
        <DNAHelix />

        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: "var(--text-1)",
              transition: "width 0.1s linear",
            }}
          />
        </div>

        {error ? (
          <>
            <p className="text-sm font-medium text-center" style={{ color: "var(--bad)" }}>
              {error}
            </p>
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 rounded-xl py-2.5 text-xs font-medium"
                style={{
                  background: "var(--bg-card)",
                  color: "var(--text-2)",
                  border: "1px solid var(--border)",
                }}
              >
                Edit inputs
              </button>
              <button
                type="button"
                onClick={onRetry}
                className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
                style={{ background: "var(--text-1)", color: "var(--bg-card)" }}
              >
                Retry
              </button>
            </div>
          </>
        ) : (
          <div style={{ minHeight: 28 }}>
            <p key={msgKey} className="animate-msg text-sm font-medium text-center" style={{ color: "var(--text-2)" }}>
              {loading ? MESSAGES[msgIndex] : "Done"}
            </p>
          </div>
        )}

        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          FutureSelf · Simulation Engine
        </p>
      </div>
    </div>
  );
}
