"use client";

import { useEffect, useState } from "react";
import type { InsightData } from "./types";

function useTyping(text: string, speed = 18, startDelay = 0): string {
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

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return out;
}

type Section = { label: string; text: string; delay: number };

type Props = {
  insight: InsightData;
  updatedAt: string;
};

export default function InsightPanel({ insight, updatedAt }: Props) {
  const [expanded, setExpanded] = useState<"why" | "improve" | null>(null);

  const sections: Section[] = [
    { label: "Observation", text: insight.observation, delay: 0 },
    { label: "Risk",        text: insight.risk,        delay: 400 },
    { label: "Action",      text: insight.recommendation, delay: 800 },
  ];

  const expandedText =
    expanded === "why"
      ? insight.explainWhy
      : expanded === "improve"
      ? insight.howToImprove
      : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-3)" }}
        >
          AI Health Insight
        </p>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          {updatedAt}
        </p>
      </div>

      {/* Insight sections */}
      <div
        className="glass rounded-2xl p-5 space-y-5"
        style={{ transition: "all 0.3s ease" }}
      >
        {sections.map((s) => (
          <InsightSection key={s.label} label={s.label} text={s.text} delay={s.delay} />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() =>
            setExpanded((prev) => (prev === "why" ? null : "why"))
          }
          className="flex-1 rounded-xl py-2.5 text-xs font-medium transition-all duration-200"
          style={{
            background:
              expanded === "why"
                ? "rgba(123,97,255,0.2)"
                : "rgba(255,255,255,0.05)",
            border: `1px solid ${expanded === "why" ? "rgba(123,97,255,0.5)" : "rgba(255,255,255,0.08)"}`,
            color: expanded === "why" ? "var(--accent)" : "var(--text-2)",
          }}
        >
          Explain Why
        </button>
        <button
          onClick={() =>
            setExpanded((prev) => (prev === "improve" ? null : "improve"))
          }
          className="flex-1 rounded-xl py-2.5 text-xs font-medium transition-all duration-200"
          style={{
            background:
              expanded === "improve"
                ? "rgba(0,245,212,0.12)"
                : "rgba(255,255,255,0.05)",
            border: `1px solid ${expanded === "improve" ? "rgba(0,245,212,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: expanded === "improve" ? "var(--primary)" : "var(--text-2)",
          }}
        >
          How to Improve
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div
          className="glass rounded-xl p-4"
          style={{ borderColor: expanded === "why" ? "rgba(123,97,255,0.25)" : "rgba(0,245,212,0.2)" }}
        >
          <ExpandedText text={expandedText} />
        </div>
      )}
    </div>
  );
}

function InsightSection({ label, text, delay }: Section) {
  const displayed = useTyping(text, 16, delay);
  return (
    <div className="space-y-1">
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--text-3)" }}
      >
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        {displayed}
        {displayed.length < text.length && (
          <span
            className="inline-block w-px h-3.5 ml-0.5 align-middle"
            style={{
              background: "var(--primary)",
              animation: "blink 0.8s step-end infinite",
            }}
          />
        )}
      </p>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

function ExpandedText({ text }: { text: string }) {
  const displayed = useTyping(text, 14, 50);
  return (
    <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
      {displayed}
    </p>
  );
}
