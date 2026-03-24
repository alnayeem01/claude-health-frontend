import type { Insight } from "./types";

type Props = {
  insights: Insight[];
  score: number;
  timelineYear: number;
};

const severityStyles = {
  good: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  warn: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
  danger: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    dot: "bg-red-400",
    text: "text-red-300",
  },
};

export default function InsightsPanel({ insights, score, timelineYear }: Props) {
  const statusText =
    score >= 80 ? "Your body is operating at peak performance. Keep it up." :
    score >= 65 ? "You're maintaining a solid baseline. Small tweaks will amplify your results." :
    score >= 45 ? "Your lifestyle is creating compounding risk. Changes now have maximum impact." :
    "Urgent intervention needed. Your current trajectory significantly shortens healthspan.";

  return (
    <div className="space-y-4 animate-fade-up-delay-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        AI Insights
      </p>

      {/* Summary card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">🧠</span>
          <div>
            <p className="text-xs font-bold text-slate-300 mb-1">
              {timelineYear} Health Forecast
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">{statusText}</p>
          </div>
        </div>
      </div>

      {/* Individual insights */}
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const style = severityStyles[insight.severity];
          return (
            <div
              key={i}
              className={`rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm p-4 transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{insight.icon}</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot} flex-shrink-0`} />
                    <p className={`text-xs font-bold ${style.text}`}>{insight.title}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action prompt */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
        <p className="text-xs text-violet-300 leading-relaxed">
          <span className="font-bold">Tip: </span>
          Move the sliders to simulate lifestyle changes and watch your health score and risk profile update in real time.
        </p>
      </div>
    </div>
  );
}
