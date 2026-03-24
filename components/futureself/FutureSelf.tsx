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

  // Show floating feedback when score shifts in dashboard
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
        text: diff > 0 ? "Improvement detected ↑" : "Risk increasing ↑",
        positive: diff > 0,
      });
      prevScoreRef.current = metrics.overallScore;
      const t = setTimeout(() => setFeedback(null), 2400);
      return () => clearTimeout(t);
    }
  }, [metrics.overallScore, step]);

  function handleInputChange(key: keyof LifestyleInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      {/* Floating feedback toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-7 left-1/2 z-50 rounded-full px-5 py-2.5 text-xs font-semibold"
            style={{
              transform: "translateX(-50%)",
              background: feedback.positive
                ? "rgba(0,245,212,0.12)"
                : "rgba(255,77,77,0.12)",
              border: `1px solid ${feedback.positive ? "rgba(0,245,212,0.5)" : "rgba(255,77,77,0.5)"}`,
              color: feedback.positive ? "var(--primary)" : "var(--danger)",
              backdropFilter: "blur(12px)",
            }}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step transitions */}
      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <InputScreen
              inputs={inputs}
              onInputChange={handleInputChange}
              onSimulate={() => setStep("processing")}
            />
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProcessingScreen onComplete={() => setStep("dashboard")} />
          </motion.div>
        )}

        {step === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Dashboard
              inputs={inputs}
              metrics={metrics}
              onInputChange={handleInputChange}
              onReset={() => setStep("input")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
