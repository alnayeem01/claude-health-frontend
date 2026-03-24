"use client";

import { useState } from "react";
import { getRiskColor, getTrendSymbol } from "./types";

type Props = {
  label: string;
  risk: number;
  tooltip: string;
};

export default function RiskBar({ label, risk, tooltip }: Props) {
  const [showTip, setShowTip] = useState(false);
  const color = getRiskColor(risk);
  const trend = getTrendSymbol(risk);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            className="text-xs font-medium flex items-center gap-1 group"
            style={{ color: "var(--text-2)" }}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            onClick={() => setShowTip((v) => !v)}
            type="button"
          >
            {label}
            <span
              className="text-xs"
              style={{ color: "var(--text-3)", transition: "color 0.2s" }}
            >
              ⓘ
            </span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-bold"
            style={{ color: trend.color, transition: "color 0.4s ease" }}
          >
            {trend.symbol}
          </span>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color, transition: "color 0.4s ease" }}
          >
            {risk}%
          </span>
        </div>
      </div>

      {/* Bar */}
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="risk-fill h-full rounded-full"
          style={{
            width: `${risk}%`,
            background: color,
            boxShadow: risk > 55 ? `0 0 8px ${color}88` : "none",
          }}
        />
      </div>

      {/* Tooltip */}
      {showTip && (
        <div
          className="rounded-lg px-3 py-2.5 text-xs leading-relaxed"
          style={{
            background: "rgba(10,15,28,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text-2)",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
