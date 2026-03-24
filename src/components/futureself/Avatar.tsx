"use client";

import { getScoreColor } from "./types";

type Props = { score: number; projectedAge: number };

function getFace(score: number) {
  // Eyebrow angle: positive = raised (happy), negative = furrowed (stressed)
  const browAngle = score >= 75 ? 3 : score >= 60 ? 1 : score >= 45 ? -2 : -5;
  // Eye openness: 1 = open, smaller = squinty
  const eyeRy = score >= 60 ? 2.8 : score >= 45 ? 2.2 : 1.6;
  // Mouth: positive cy offset = smile, negative = frown
  const mouthCurve = score >= 75 ? 6 : score >= 60 ? 2 : score >= 45 ? -1 : -4;
  // Pupil size
  const pupilR = score >= 50 ? 1.2 : 0.9;
  // Cheek blush opacity
  const blush = score >= 70 ? 0.12 : 0;
  // Sweat drop for high stress
  const showSweat = score < 40;

  return { browAngle, eyeRy, mouthCurve, pupilR, blush, showSweat };
}

export default function Avatar({ score, projectedAge }: Props) {
  const color = getScoreColor(score);
  const label = score >= 75 ? "Thriving" : score >= 60 ? "Stable" : score >= 45 ? "At risk" : "Critical";
  const face = getFace(score);

  // Skin tone stays neutral — color only affects ring + glow
  const skin = "#E8C4A0";
  const skinShadow = "#D4A574";
  const hair = "#3D2B1F";

  const framePx = 248;
  const figureW = 132;
  const figureH = Math.round((figureW * 140) / 100);

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
        Digital Twin
      </p>

      <div
        className="relative flex items-center justify-center"
        style={{ width: framePx, height: framePx }}
      >
        {/* Ring */}
        <svg className="absolute inset-0" width={framePx} height={framePx} viewBox="0 0 170 170">
          <circle cx="85" cy="85" r="80" fill="none" stroke="var(--bg-inset)" strokeWidth="2.5" />
          <circle
            cx="85" cy="85" r="80" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 80}
            strokeDashoffset={2 * Math.PI * 80 * (1 - score / 100)}
            transform="rotate(-90 85 85)"
            className="score-ring score-ring-shimmer"
            opacity="0.5"
          />
        </svg>

        {/* Scan line */}
        <div className="avatar-scanline" style={{ background: `${color}` }} />

        {/* Body */}
        <div className="animate-breathe relative z-10">
          <svg viewBox="0 0 100 140" width={figureW} height={figureH}>
            <defs>
              <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={skin} />
                <stop offset="100%" stopColor={skinShadow} />
              </linearGradient>
              <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={color} stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Hair back */}
            <ellipse cx="50" cy="22" rx="18" ry="18" fill={hair} />

            {/* Head */}
            <ellipse cx="50" cy="26" rx="15" ry="17" fill="url(#skinGrad)" />

            {/* Hair top / fringe */}
            <path d="M33 20 Q35 8 50 6 Q65 8 67 20 Q62 14 50 13 Q38 14 33 20 Z" fill={hair} />

            {/* Ears */}
            <ellipse cx="34.5" cy="27" rx="3" ry="4" fill={skinShadow} opacity="0.7" />
            <ellipse cx="65.5" cy="27" rx="3" ry="4" fill={skinShadow} opacity="0.7" />

            {/* Eyebrows */}
            <line
              x1="39" y1={22 - face.browAngle * 0.5}
              x2="45" y2={22 + face.browAngle * 0.3}
              stroke={hair} strokeWidth="1.3" strokeLinecap="round"
              style={{ transition: "all 0.4s ease" }}
            />
            <line
              x1="55" y1={22 + face.browAngle * 0.3}
              x2="61" y2={22 - face.browAngle * 0.5}
              stroke={hair} strokeWidth="1.3" strokeLinecap="round"
              style={{ transition: "all 0.4s ease" }}
            />

            {/* Eyes */}
            <ellipse cx="42" cy="27" rx="2.5" ry={face.eyeRy} fill="white"
              style={{ transition: "ry 0.4s ease" }} />
            <ellipse cx="58" cy="27" rx="2.5" ry={face.eyeRy} fill="white"
              style={{ transition: "ry 0.4s ease" }} />
            {/* Pupils */}
            <circle cx="42" cy="27.3" r={face.pupilR} fill="#2C1810"
              style={{ transition: "r 0.3s ease" }} />
            <circle cx="58" cy="27.3" r={face.pupilR} fill="#2C1810"
              style={{ transition: "r 0.3s ease" }} />
            {/* Eye shine */}
            <circle cx="43" cy="26.3" r="0.6" fill="white" opacity="0.8" />
            <circle cx="59" cy="26.3" r="0.6" fill="white" opacity="0.8" />

            {/* Nose */}
            <path d="M49 30 Q50 33 51 30" fill="none" stroke={skinShadow} strokeWidth="0.6" opacity="0.5" />

            {/* Cheek blush */}
            {face.blush > 0 && (
              <>
                <circle cx="38" cy="32" r="3" fill="#E88B8B" opacity={face.blush} />
                <circle cx="62" cy="32" r="3" fill="#E88B8B" opacity={face.blush} />
              </>
            )}

            {/* Mouth */}
            <path
              d={face.mouthCurve >= 0
                ? `M44 35 Q50 ${35 + face.mouthCurve} 56 35`
                : `M44 37 Q50 ${37 + face.mouthCurve} 56 37`
              }
              fill="none"
              stroke={face.mouthCurve >= 4 ? "#D4756B" : "#8B6F60"}
              strokeWidth={face.mouthCurve >= 4 ? "1.5" : "1.1"}
              strokeLinecap="round"
              style={{ transition: "all 0.4s ease" }}
            />
            {/* Show teeth when smiling wide */}
            {face.mouthCurve >= 5 && (
              <path
                d="M47 35.5 Q50 38 53 35.5"
                fill="white"
                opacity="0.85"
              />
            )}

            {/* Sweat drop when score is critical */}
            {face.showSweat && (
              <path
                d="M66 18 Q67 15 68 18 Q68 20 67 21 Q66 20 66 18 Z"
                fill="#7CB9E8"
                opacity="0.7"
              >
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
              </path>
            )}

            {/* Neck */}
            <rect x="45" y="42" width="10" height="6" rx="3" fill={skinShadow} opacity="0.7" />

            {/* Torso / shirt */}
            <path d="M24 54 Q24 48 50 48 Q76 48 76 54 L73 96 Q70 102 50 102 Q30 102 27 96 Z" fill="url(#shirtGrad)" />

            {/* Collar */}
            <path d="M42 48 L50 55 L58 48" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />

            {/* Arms */}
            <path d="M25 56 Q18 66 20 82 Q21 87 26 86 Q30 85 30 80 L28 56" fill="url(#shirtGrad)" />
            <path d="M75 56 Q82 66 80 82 Q79 87 74 86 Q70 85 70 80 L72 56" fill="url(#shirtGrad)" />
            {/* Hands */}
            <circle cx="23" cy="86" r="4" fill={skin} />
            <circle cx="77" cy="86" r="4" fill={skin} />

            {/* Legs */}
            <rect x="32" y="100" width="15" height="28" rx="6" fill="#4A4A4A" opacity="0.65" />
            <rect x="53" y="100" width="15" height="28" rx="6" fill="#4A4A4A" opacity="0.65" />
            {/* Shoes */}
            <rect x="30" y="125" width="18" height="6" rx="3" fill="#3D3D3D" opacity="0.7" />
            <rect x="52" y="125" width="18" height="6" rx="3" fill="#3D3D3D" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Score + label */}
      <div className="text-center">
        <p className="text-2xl font-semibold tabular-nums" style={{ color, transition: "color 0.4s ease" }}>
          {score}
          <span className="text-sm font-normal ml-0.5" style={{ color: "var(--text-3)" }}>/100</span>
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color, transition: "color 0.4s ease" }}>
          {label}
        </p>
      </div>

      {/* Lifespan */}
      <div className="w-full text-center py-3 rounded-xl" style={{ background: "var(--bg-inset)" }}>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>Projected lifespan</p>
        <p className="text-lg font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
          {projectedAge} <span className="text-sm font-normal" style={{ color: "var(--text-3)" }}>years</span>
        </p>
      </div>
    </div>
  );
}
