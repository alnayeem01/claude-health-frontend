export type LifestyleInputs = {
  sleep: number;      // 4–12 hours
  stress: number;     // 0–10 scale
  exercise: number;   // 0–7 days/week
  screenTime: number; // 0–12 hours/day
};

export type HealthMetrics = {
  overallScore: number;   // 0–100
  heartRisk: number;      // 0–100 (higher = worse)
  burnoutRisk: number;
  obesityRisk: number;
  cognitiveRisk: number;
  projectedAge: number;   // projected lifespan
};

export type Insight = {
  icon: string;
  title: string;
  body: string;
  severity: "good" | "warn" | "danger";
};

export function computeHealth(inputs: LifestyleInputs): HealthMetrics {
  const sleepScore =
    inputs.sleep >= 7 && inputs.sleep <= 9
      ? 100
      : Math.max(0, 100 - Math.abs(inputs.sleep - 8) * 20);
  const stressScore = Math.max(0, 100 - inputs.stress * 10);
  const exerciseScore = Math.min(100, inputs.exercise * 14.3);
  const screenScore = Math.max(
    0,
    inputs.screenTime <= 3 ? 100 : 100 - (inputs.screenTime - 3) * 11
  );

  const overallScore = Math.round(
    sleepScore * 0.28 +
    stressScore * 0.28 +
    exerciseScore * 0.25 +
    screenScore * 0.19
  );

  const heartRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - stressScore) * 0.4 +
      (100 - sleepScore) * 0.3 +
      (100 - exerciseScore) * 0.3
    ))
  );
  const burnoutRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - stressScore) * 0.55 +
      (100 - sleepScore) * 0.3 +
      (100 - exerciseScore) * 0.15
    ))
  );
  const obesityRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - exerciseScore) * 0.5 +
      (100 - screenScore) * 0.3 +
      (100 - sleepScore) * 0.2
    ))
  );
  const cognitiveRisk = Math.round(
    Math.min(100, Math.max(0,
      (100 - sleepScore) * 0.38 +
      (100 - stressScore) * 0.32 +
      (100 - exerciseScore) * 0.3
    ))
  );

  const projectedAge = Math.round(72 + (overallScore / 100) * 22);

  return { overallScore, heartRisk, burnoutRisk, obesityRisk, cognitiveRisk, projectedAge };
}

export function generateInsights(inputs: LifestyleInputs, metrics: HealthMetrics): Insight[] {
  const insights: Insight[] = [];

  if (inputs.sleep < 6) {
    insights.push({
      icon: "🌙",
      title: "Critical Sleep Deficit",
      body: "Under 6 hours accelerates cognitive aging by 2–3×. Prioritize sleep above all else.",
      severity: "danger",
    });
  } else if (inputs.sleep > 9) {
    insights.push({
      icon: "🌙",
      title: "Excess Sleep",
      body: "Sleeping over 9 hours may signal inflammation or depression. Target 7–9 for optimal recovery.",
      severity: "warn",
    });
  } else {
    insights.push({
      icon: "🌙",
      title: "Sleep is Optimal",
      body: "Your sleep window is protecting memory consolidation and metabolic regulation.",
      severity: "good",
    });
  }

  if (inputs.stress >= 7) {
    insights.push({
      icon: "⚡",
      title: "Dangerously High Stress",
      body: "Chronic high cortisol is compressing telomeres. Your biological age is likely 5–8 years older than your chronological age.",
      severity: "danger",
    });
  } else if (inputs.stress >= 4) {
    insights.push({
      icon: "⚡",
      title: "Elevated Stress",
      body: "Sustained moderate stress raises heart disease risk by ~40%. Even 10 min of daily breathwork creates measurable cortisol reduction.",
      severity: "warn",
    });
  } else {
    insights.push({
      icon: "⚡",
      title: "Stress Under Control",
      body: "Low stress is a longevity multiplier. Your autonomic nervous system is operating in recovery mode.",
      severity: "good",
    });
  }

  if (inputs.exercise <= 2) {
    insights.push({
      icon: "🏃",
      title: "Sedentary Risk",
      body: "Fewer than 3 active days per week raises all-cause mortality risk by 35%. Zone 2 cardio 3×/week is the minimum effective dose.",
      severity: "danger",
    });
  } else if (inputs.exercise >= 5) {
    insights.push({
      icon: "🏃",
      title: "Elite Activity Level",
      body: "5+ active days per week puts you in the top 10% of cardiovascular health. This alone adds ~7 healthy years.",
      severity: "good",
    });
  } else {
    insights.push({
      icon: "🏃",
      title: "Moderate Activity",
      body: "You're meeting baseline recommendations. Adding one more workout per week cuts burnout risk by ~25%.",
      severity: "warn",
    });
  }

  if (inputs.screenTime > 8) {
    insights.push({
      icon: "📱",
      title: "Screen Overload",
      body: "8+ hours of screen time is suppressing melatonin and creating chronic eye strain. Blue-light exposure after 9pm is particularly damaging.",
      severity: "danger",
    });
  } else if (metrics.overallScore >= 75) {
    insights.push({
      icon: "✨",
      title: "Exceptional Profile",
      body: `Your projected healthy lifespan is ${metrics.projectedAge} years. You're in the top tier of preventive health.`,
      severity: "good",
    });
  } else {
    insights.push({
      icon: "📱",
      title: "Manage Screen Time",
      body: "Reducing screens to under 4 hours outside work improves sleep quality by up to 40%.",
      severity: "warn",
    });
  }

  return insights.slice(0, 4);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#06b6d4"; // cyan
  if (score >= 65) return "#8b5cf6"; // violet
  if (score >= 45) return "#f59e0b"; // amber
  return "#ef4444";                  // red
}

export function getRiskColor(risk: number): string {
  if (risk <= 25) return "#10b981"; // green
  if (risk <= 50) return "#f59e0b"; // amber
  if (risk <= 75) return "#f97316"; // orange
  return "#ef4444";                 // red
}
