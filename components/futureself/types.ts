export type LifestyleInputs = {
  sleep: number;
  stress: number;
  exercise: number;
  screenTime: number;
  diet: number;
};

export type HealthMetrics = {
  overallScore: number;
  heartRisk: number;
  burnoutRisk: number;
  cognitiveRisk: number;
  projectedAge: number;
  confidence: "Low" | "Medium" | "High";
};

export type InsightData = {
  observation: string;
  risk: string;
  recommendation: string;
  explainWhy: string;
  howToImprove: string;
};

export function computeHealth(i: LifestyleInputs): HealthMetrics {
  const sleepScore =
    i.sleep >= 7 && i.sleep <= 9
      ? 100
      : Math.max(0, 100 - Math.abs(i.sleep - 8) * 22);
  const stressScore = Math.max(0, 100 - i.stress * 10);
  const exerciseScore = Math.min(100, i.exercise * 14.3);
  const screenScore = Math.max(
    0,
    i.screenTime <= 3 ? 100 : 100 - (i.screenTime - 3) * 11
  );
  const dietScore = Math.min(100, (i.diet / 10) * 100);

  const overallScore = Math.round(
    sleepScore * 0.25 +
      stressScore * 0.25 +
      exerciseScore * 0.22 +
      screenScore * 0.13 +
      dietScore * 0.15
  );

  const heartRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - stressScore) * 0.38 +
      (100 - sleepScore) * 0.28 +
      (100 - exerciseScore) * 0.22 +
      (100 - dietScore) * 0.12
    ))
  );
  const burnoutRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - stressScore) * 0.5 +
      (100 - sleepScore) * 0.32 +
      (100 - exerciseScore) * 0.12 +
      (100 - screenScore) * 0.06
    ))
  );
  const cognitiveRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - sleepScore) * 0.36 +
      (100 - stressScore) * 0.3 +
      (100 - exerciseScore) * 0.2 +
      (100 - dietScore) * 0.14
    ))
  );

  const projectedAge = Math.round(72 + (overallScore / 100) * 22);
  const highRisk = Math.max(heartRisk, burnoutRisk, cognitiveRisk);
  const confidence: "Low" | "Medium" | "High" =
    overallScore >= 70 || highRisk <= 30 ? "High" : overallScore >= 45 ? "Medium" : "Low";

  return { overallScore, heartRisk, burnoutRisk, cognitiveRisk, projectedAge, confidence };
}

export function buildInsight(i: LifestyleInputs, m: HealthMetrics): InsightData {
  const observation =
    m.overallScore >= 75
      ? "Your lifestyle profile reflects strong preventive health habits. Sleep, stress, and activity are all near optimal ranges."
      : m.overallScore >= 55
      ? `Your profile shows a mixed pattern — ${i.sleep < 7 ? "sleep deprivation" : i.stress > 6 ? "elevated stress" : "low activity"} is the primary drag on your score.`
      : "Your current lifestyle is creating compounding risk. Multiple inputs are outside safe ranges and will accelerate biological aging if unchanged.";

  const dominantRisk =
    m.burnoutRisk > m.heartRisk && m.burnoutRisk > m.cognitiveRisk
      ? "burnout"
      : m.heartRisk > m.cognitiveRisk
      ? "cardiovascular"
      : "cognitive decline";

  const risk =
    dominantRisk === "burnout"
      ? `Burnout risk is your highest concern at ${m.burnoutRisk}%. Chronic stress combined with inadequate sleep is depleting your recovery capacity.`
      : dominantRisk === "cardiovascular"
      ? `Cardiovascular risk at ${m.heartRisk}% is elevated. Sustained high stress and low exercise directly strain heart health over time.`
      : `Cognitive risk at ${m.cognitiveRisk}% is notable. Sleep quality is the single strongest predictor of long-term cognitive function.`;

  const recommendation =
    i.exercise <= 2
      ? "Add 3 days of moderate exercise per week — even 30-minute walks. This alone cuts all-cause mortality risk by 35%."
      : i.stress >= 7
      ? "Introduce daily stress reduction: 10 minutes of breathing exercises or low-intensity movement. Cortisol reduction takes 2–3 weeks."
      : i.sleep < 6.5
      ? "Target 7–8 hours consistently. Sleep is the highest-ROI intervention — it affects every other metric simultaneously."
      : i.diet <= 4
      ? "Shift one meal daily toward whole foods. Diet quality compounds silently — the effect is visible in 3–6 months."
      : "Maintain your current habits. Focus on consistency over the next 6 months — compound effects are now working in your favor.";

  const explainWhy =
    `Health risk compounds non-linearly. At your current score of ${m.overallScore}, each negative input amplifies the others. ` +
    `For example, poor sleep raises cortisol, which increases cravings and reduces exercise motivation — creating a reinforcing cycle. ` +
    `The ${dominantRisk} risk at ${Math.max(m.heartRisk, m.burnoutRisk, m.cognitiveRisk)}% represents the most likely first-order consequence of sustained current habits.`;

  const howToImprove =
    `A practical improvement path: ` +
    (i.sleep < 7 ? `1. Set a fixed sleep window (e.g. 11pm–7am). No screens 45 minutes before bed. ` : "") +
    (i.stress > 5 ? `2. Identify your top 3 stressors and act on at least one. Even reducing 1 stressor drops burnout risk by ~15%. ` : "") +
    (i.exercise < 4 ? `3. Schedule exercise like a meeting. Start with 3 days. Habit formation takes 21–66 days. ` : "") +
    `These changes, maintained for 90 days, could increase your score by 10–20 points.`;

  return { observation, risk, recommendation, explainWhy, howToImprove };
}

export function getScoreColor(score: number): string {
  if (score >= 72) return "var(--good)";
  if (score >= 50) return "var(--warn)";
  return "var(--bad)";
}

export function getRiskColor(risk: number): string {
  if (risk <= 28) return "var(--good)";
  if (risk <= 55) return "var(--warn)";
  return "var(--bad)";
}

export function getTrend(risk: number): { symbol: string; label: string; color: string } {
  if (risk <= 28) return { symbol: "↓", label: "Low", color: "var(--good)" };
  if (risk <= 55) return { symbol: "→", label: "Moderate", color: "var(--warn)" };
  return { symbol: "↑", label: "High", color: "var(--bad)" };
}
