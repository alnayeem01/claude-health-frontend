"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { computeHealth, type LifestyleInputs } from "./types";
import InputScreen from "./InputScreen";
import ProcessingScreen from "./ProcessingScreen";
import Dashboard from "./Dashboard";

const DEFAULT_INPUTS: LifestyleInputs = {
  sleep: 7,
  stress: 5,
  exercise: 3,
  screenTime: 5,
  diet: 6,
};

export default function FutureSelf() {
  const [step, setStep] = useState<"input" | "processing" | "dashboard">("input");
  const [inputs, setInputs] = useState<LifestyleInputs>(DEFAULT_INPUTS);
  const [feedback, setFeedback] = useState<{ text: string; positive: boolean } | null>(null);

  const metrics = useMemo(() => computeHealth(inputs), [inputs]);
  const prevScoreRef = useRef<number | null>(null);

  useEffect(() => {
    if (step !== "dashboard") {
      prevScoreRef.current = null;
      return;
    }
    if (prevScoreRef.current === null) {
      prevScoreRef.current = metrics.overallScore;
      return;
    }
    const diff = metrics.overallScore - prevScoreRef.current;
    if (Math.abs(diff) >= 2) {
      setFeedback({
        text: diff > 0 ? "Risk decreasing ↓" : "Risk increasing ↑",
        positive: diff > 0,
      });
      prevScoreRef.current = metrics.overallScore;
      const t = setTimeout(() => setFeedback(null), 2200);
      return () => clearTimeout(t);
    }
  }, [metrics.overallScore, step]);

  function handleInputChange(key: keyof LifestyleInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2 text-xs font-medium"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: feedback.positive ? "var(--good)" : "var(--bad)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <InputScreen inputs={inputs} onInputChange={handleInputChange} onSimulate={() => setStep("processing")} />
          </motion.div>
        )}
        {step === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ProcessingScreen onComplete={() => setStep("dashboard")} />
          </motion.div>
        )}
        {step === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Dashboard inputs={inputs} metrics={metrics} onInputChange={handleInputChange} onReset={() => setStep("input")} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
