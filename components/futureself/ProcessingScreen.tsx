"use client";

import { useEffect, useState } from "react";

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

type Props = { onComplete: () => void };

export default function ProcessingScreen({ onComplete }: Props) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgKey, setMsgKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
      setMsgKey((k) => k + 1);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
      {/* ECG */}
      <div className="w-full overflow-hidden" style={{ height: 80, opacity: 0.2 }}>
        <div className="ecg-track flex" style={{ width: SVG_WIDTH * 2 }}>
          {[0, 1].map((copy) => (
            <svg key={copy} width={SVG_WIDTH} height={80} viewBox={`0 0 ${SVG_WIDTH} 80`} fill="none" style={{ flexShrink: 0 }}>
              <path d={ECG_PATH} stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-7 mt-16">
        {/* Simple spinner */}
        <div
          className="h-8 w-8 rounded-full"
          style={{
            border: "2px solid var(--border)",
            borderTopColor: "var(--text-1)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{ minHeight: 28 }}>
          <p
            key={msgKey}
            className="animate-msg text-sm font-medium text-center"
            style={{ color: "var(--text-2)" }}
          >
            {MESSAGES[msgIndex]}
          </p>
        </div>

        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          FutureSelf
        </p>
      </div>
    </div>
  );
}
