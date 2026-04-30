import type { ATSResult } from "@/lib/api";

const TEMPLATE_ICONS: Record<string, string> = {
  technical: "💻",
  creative: "🎨",
  executive: "👔",
  academic: "🎓",
  general: "📋",
};

export default function ATSPanel({ ats }: { ats: ATSResult }) {
  const color =
    ats.score >= 70 ? "bg-emerald-500" :
    ats.score >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span>ATS Match Score</span>
            <span>{ats.score}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${color}`}
              style={{ width: `${ats.score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-emerald-700 mb-2">✅ Matched Keywords ({ats.matched.length})</h4>
          <div className="flex flex-wrap gap-2">
            {ats.matched.map((kw) => (
              <span key={kw} className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700">
                {kw}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-red-600 mb-2">❌ Missing Keywords ({ats.missing.length})</h4>
          <div className="flex flex-wrap gap-2">
            {ats.missing.map((kw) => (
              <span key={kw} className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs text-red-600">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
