"use client";

import { useState } from "react";
import { getRiskColor, getTrend } from "./types";

type Props = { label: string; risk: number; tooltip: string };

export default function RiskBar({ label, risk, tooltip }: Props) {
  const [showTip, setShowTip] = useState(false);
  const color = getRiskColor(risk);
  const trend = getTrend(risk);

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
          <span className="text-xs" style={{ color: "var(--text-3)" }}>?</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: trend.color }}>
            {trend.symbol} {trend.label}
          </span>
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
            {risk}%
          </span>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--bg-inset)" }}>
        <div
          className="risk-fill h-full rounded-full"
          style={{ width: `${risk}%`, background: color }}
        />
      </div>

      {showTip && (
        <p className="text-xs leading-relaxed py-2 px-3 rounded-lg" style={{ background: "var(--bg-inset)", color: "var(--text-2)" }}>
          {tooltip}
        </p>
      )}
    </div>
  );
}
