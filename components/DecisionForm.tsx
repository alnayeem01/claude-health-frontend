"use client";

import { useState } from "react";
import { simulateDecision, type SimulateResponse } from "@/lib/api";
import LoadingState from "./LoadingState";
import ResultView from "./ResultView";

export default function DecisionForm() {
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await simulateDecision(decision.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
          Every decision creates a<br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            different future.
          </span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">See both.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="Should I quit my job to start a startup?"
          rows={3}
          disabled={loading}
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 placeholder-slate-400 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !decision.trim()}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Simulating…" : "Simulate My Future"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Loading */}
      {loading && <LoadingState />}

      {/* Results */}
      {result && !loading && <ResultView result={result} />}
    </div>
  );
}
