import type { SimulateResponse } from "@/lib/api";
import TimelineCard from "./TimelineCard";

type Props = {
  result: SimulateResponse;
};

export default function ResultView({ result }: Props) {
  return (
    <div className="w-full space-y-6">
      {/* Metrics bar */}
      {(result.regretLevel || result.happinessIndex) && (
        <div className="flex flex-wrap justify-center gap-4">
          {result.regretLevel && (
            <div className="flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-sm font-medium text-red-700">
                Regret if you don&apos;t:{" "}
                <strong>{result.regretLevel}</strong>
              </span>
            </div>
          )}
          {result.happinessIndex && (
            <div className="flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">
                Happiness if you do:{" "}
                <strong>{result.happinessIndex}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Universe columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Universe A */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block h-3 w-3 rounded-full bg-green-400" />
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              Universe A — You take the decision
            </h2>
          </div>
          {result.universeA.map((entry) => (
            <TimelineCard
              key={entry.year}
              year={entry.year}
              text={entry.story}
              variant="a"
            />
          ))}
        </div>

        {/* Universe B */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block h-3 w-3 rounded-full bg-red-400" />
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              Universe B — You don&apos;t
            </h2>
          </div>
          {result.universeB.map((entry) => (
            <TimelineCard
              key={entry.year}
              year={entry.year}
              text={entry.story}
              variant="b"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
