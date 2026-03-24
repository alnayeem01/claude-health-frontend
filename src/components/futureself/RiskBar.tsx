"use client";

import { useState } from "react";
import { getRiskColor, getTrend } from "./types";

type Props = { label: string; risk: number; tooltip: string };

export default function RiskBar({ label, risk, tooltip }: Props) {
  const [showTip, setShowTip] = useState(false);
  const color = getRiskColor(risk);
  const trend = getTrend(risk);
  const isHigh = risk > 55;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-medium flex items-center gap-1.5"
          style={{ color: "var(--text-1)" }}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onClick={() => setShowTip((v) => !v)}
        >
          {label}
          <span
            className="inline-flex items-center justify-center rounded-full text-xs"
            style={{
              width: 15, height: 15,
              background: "var(--bg-inset)",
              color: "var(--text-3)",
              fontSize: 9,
              lineHeight: 1,
            }}
          >
            ?
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              color: trend.color,
              background: `color-mix(in srgb, ${trend.color} 8%, transparent)`,
              transition: "color 0.3s, background 0.3s",
            }}
          >
            {trend.symbol} {trend.label}
          </span>
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
            {risk}%
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--bg-inset)" }}>
        <div
          className={`risk-fill h-full rounded-full ${isHigh ? "risk-fill-shimmer" : ""}`}
          style={{
            width: `${risk}%`,
            background: isHigh
              ? `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 70%, white), ${color})`
              : color,
          }}
        />
      </div>

      {/* Tooltip */}
      {showTip && (
        <p
          className="text-xs leading-relaxed py-2 px-3 rounded-lg"
          style={{ background: "var(--bg-inset)", color: "var(--text-2)", animation: "stagger-in 0.2s ease-out" }}
        >
          {tooltip}
        </p>
      )}
    </div>
  );
}
