"use client";

interface Props {
  score: number;
  label?: string;
}

export default function ScoreGauge({ score, label = "Overall Score" }: Props) {
  const color =
    score >= 75 ? "text-emerald-500" :
    score >= 50 ? "text-amber-500" : "text-red-500";

  const ring =
    score >= 75 ? "stroke-emerald-500" :
    score >= 50 ? "stroke-amber-500" : "stroke-red-500";

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            className={ring}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
