"use client";

import { useEffect, useState } from "react";
import type { InsightData } from "./types";

function useTyping(text: string, speed = 16, startDelay = 0): string {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay]);
  return out;
}

function Section({ label, text, delay }: { label: string; text: string; delay: number }) {
  const displayed = useTyping(text, 14, delay);
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-3)" }}>
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        {displayed}
        {displayed.length < text.length && (
          <span className="inline-block w-px h-3 ml-0.5 align-middle" style={{ background: "var(--text-1)", animation: "blink 0.8s step-end infinite" }} />
        )}
      </p>
    </div>
  );
}

type Props = { insight: InsightData; updatedAt: string };

export default function InsightPanel({ insight, updatedAt }: Props) {
  const [expanded, setExpanded] = useState<"why" | "improve" | null>(null);
  const expandedText = expanded === "why" ? insight.explainWhy : expanded === "improve" ? insight.howToImprove : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
          AI Insight
        </p>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          {updatedAt}
        </p>
      </div>

      <div className="card p-5 space-y-5">
        <Section label="Observation" text={insight.observation} delay={0} />
        <Section label="Risk" text={insight.risk} delay={400} />
        <Section label="Recommendation" text={insight.recommendation} delay={800} />
      </div>

      <div className="flex gap-2">
        {(["why", "improve"] as const).map((type) => {
          const active = expanded === type;
          return (
            <button
              key={type}
              onClick={() => setExpanded((prev) => (prev === type ? null : type))}
              className="flex-1 rounded-xl py-2.5 text-xs font-medium transition-all duration-150"
              style={{
                background: active ? "var(--text-1)" : "var(--bg-card)",
                color: active ? "var(--bg-card)" : "var(--text-2)",
                border: `1px solid ${active ? "var(--text-1)" : "var(--border)"}`,
              }}
            >
              {type === "why" ? "Explain why" : "How to improve"}
            </button>
          );
        })}
      </div>

      {expanded && (
        <div className="card p-4">
          <ExpandedText text={expandedText} />
        </div>
      )}

      <p className="text-[11px] leading-snug px-0.5" style={{ color: "var(--text-3)" }}>
        Educational simulation only — not medical advice. Refresh insight by running a new simulation.
      </p>
    </div>
  );
}

function ExpandedText({ text }: { text: string }) {
  const displayed = useTyping(text, 12, 50);
  return (
    <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
      {displayed}
    </p>
  );
}
