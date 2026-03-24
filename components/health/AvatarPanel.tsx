import { getScoreColor } from "./types";

type Props = {
  score: number;
  projectedAge: number;
};

export default function AvatarPanel({ score, projectedAge }: Props) {
  const color = getScoreColor(score);
  const label =
    score >= 80 ? "Thriving" :
    score >= 65 ? "Stable" :
    score >= 45 ? "At Risk" :
    "Critical";

  return (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Digital Twin
      </p>

      {/* Avatar with glow rings */}
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {/* Outer slow pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-glow-pulse-slow"
          style={{
            background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
            boxShadow: `0 0 60px ${color}33`,
          }}
        />
        {/* Inner pulse ring */}
        <div
          className="absolute rounded-full animate-glow-pulse"
          style={{
            inset: 16,
            boxShadow: `0 0 30px ${color}66, inset 0 0 20px ${color}22`,
            borderRadius: "9999px",
            border: `1.5px solid ${color}66`,
          }}
        />

        {/* SVG avatar */}
        <svg
          viewBox="0 0 100 120"
          width={110}
          height={132}
          className="relative z-10"
          style={{ transition: "filter 0.5s ease" }}
        >
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </radialGradient>
            <filter id="avatarGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Head */}
          <circle cx="50" cy="24" r="16" fill="url(#bodyGrad)" filter="url(#avatarGlow)" />

          {/* Neck */}
          <rect x="44" y="38" width="12" height="8" rx="4" fill={color} opacity="0.7" />

          {/* Body / torso */}
          <path
            d="M 20 50 Q 20 44 50 44 Q 80 44 80 50 L 76 90 Q 72 96 50 96 Q 28 96 24 90 Z"
            fill="url(#bodyGrad)"
            filter="url(#avatarGlow)"
          />

          {/* Body scan lines */}
          {[60, 70, 80].map((y) => (
            <line
              key={y}
              x1="28"
              y1={y}
              x2="72"
              y2={y}
              stroke={color}
              strokeWidth="0.5"
              opacity="0.4"
            />
          ))}

          {/* Heart pulse dot */}
          <circle cx="50" cy="64" r="3" fill="#fff" opacity="0.9" />

          {/* Legs */}
          <rect x="28" y="94" width="18" height="22" rx="6" fill={color} opacity="0.7" />
          <rect x="54" y="94" width="18" height="22" rx="6" fill={color} opacity="0.7" />
        </svg>
      </div>

      {/* Status label */}
      <div className="text-center space-y-1">
        <p
          className="text-2xl font-bold tabular-nums"
          style={{ color, transition: "color 0.4s ease" }}
        >
          {score}
          <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
        </p>
        <p
          className="text-sm font-semibold tracking-wide"
          style={{ color, transition: "color 0.4s ease" }}
        >
          {label}
        </p>
      </div>

      {/* Projected age */}
      <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3 text-center">
        <p className="text-xs text-slate-400 mb-0.5">Projected Lifespan</p>
        <p className="text-xl font-bold text-slate-100">{projectedAge} yrs</p>
      </div>
    </div>
  );
}
