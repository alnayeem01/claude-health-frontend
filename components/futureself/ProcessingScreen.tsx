"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyzing lifestyle patterns…",
  "Mapping long-term health signals…",
  "Generating your digital twin…",
  "Calibrating risk models…",
  "Finalizing projections…",
];

// One full ECG cycle (60px wide, centered at y=40, height 80px total)
function buildECGPath(cycles: number): string {
  const W = 60;
  let d = `M0,40 `;
  for (let c = 0; c < cycles; c++) {
    const x = c * W;
    d +=
      `L${x + 8},40 ` +          // flat baseline
      `L${x + 11},37 ` +         // P wave up
      `L${x + 14},43 ` +         // P wave down
      `L${x + 17},40 ` +         // return to baseline
      `L${x + 19},34 ` +         // Q dip
      `L${x + 20},8 ` +          // R spike up
      `L${x + 21},68 ` +         // S spike down
      `L${x + 23},40 ` +         // return to baseline
      `L${x + 27},40 ` +         // ST segment
      `L${x + 30},34 ` +         // T wave up
      `L${x + 34},46 ` +         // T wave peak
      `L${x + 38},40 ` +         // T wave down
      `L${x + W},40 `;           // flat to next cycle
  }
  return d;
}

const CYCLES = 14;
const SVG_WIDTH = CYCLES * 60; // one full run
const ECG_PATH = buildECGPath(CYCLES);

type Props = { onComplete: () => void };

export default function ProcessingScreen({ onComplete }: Props) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgKey, setMsgKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => {
        const next = (i + 1) % MESSAGES.length;
        return next;
      });
      setMsgKey((k) => k + 1);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      {/* ECG strip */}
      <div className="w-full overflow-hidden" style={{ height: 80, opacity: 0.55 }}>
        <div className="ecg-track flex" style={{ width: SVG_WIDTH * 2 }}>
          {[0, 1].map((copy) => (
            <svg
              key={copy}
              width={SVG_WIDTH}
              height={80}
              viewBox={`0 0 ${SVG_WIDTH} 80`}
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path
                d={ECG_PATH}
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Status text */}
      <div className="flex flex-col items-center gap-8 mt-16">
        {/* Spinner ring */}
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle
            cx="26" cy="26" r="22"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
          />
          <circle
            cx="26" cy="26" r="22"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="138"
            strokeDashoffset="100"
            style={{
              transformOrigin: "26px 26px",
              animation: "spin 1.2s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>

        {/* Rotating message */}
        <div style={{ minHeight: 32 }}>
          <p
            key={msgKey}
            className="animate-msg text-base font-medium text-center"
            style={{ color: "var(--text-2)" }}
          >
            {MESSAGES[msgIndex]}
          </p>
        </div>

        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          FutureSelf AI · Health Simulation Engine
        </p>
      </div>
    </div>
  );
}
