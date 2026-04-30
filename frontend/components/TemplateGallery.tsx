import type { TemplateInfo } from "@/lib/api";

const TEMPLATE_ICONS: Record<string, string> = {
  Technical: "💻",
  Creative: "🎨",
  Executive: "👔",
  Academic: "🎓",
  General: "📋",
};

const ALL_TEMPLATES: TemplateInfo[] = [
  { name: "Technical", description: "Clean, skills-first layout with prominent tech stack section. Preferred by engineering recruiters.", reason: "" },
  { name: "Creative", description: "Visually distinctive with subtle design elements. Balances personality with professionalism.", reason: "" },
  { name: "Executive", description: "Polished, achievement-focused layout with strong summary section and quantified impact.", reason: "" },
  { name: "Academic", description: "Publications, research, and education-first structure. Traditional CV-style format.", reason: "" },
  { name: "General", description: "Balanced, versatile layout that works across industries. Clean chronological format.", reason: "" },
];

export default function TemplateGallery({ recommended }: { recommended: TemplateInfo }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-brand-500 bg-brand-50 p-4">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">AI Recommended</p>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{TEMPLATE_ICONS[recommended.name] ?? "📄"}</span>
          <div>
            <h4 className="font-bold text-slate-800">{recommended.name} Template</h4>
            <p className="text-sm text-slate-600 mt-0.5">{recommended.description}</p>
            <p className="text-xs text-brand-600 mt-1 font-medium">Why: {recommended.reason}</p>
          </div>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-600">All Templates</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {ALL_TEMPLATES.map((t) => (
          <div
            key={t.name}
            className={`rounded-xl border p-4 ${
              t.name === recommended.name
                ? "border-brand-300 bg-brand-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{TEMPLATE_ICONS[t.name] ?? "📄"}</span>
              <span className="font-semibold text-sm text-slate-800">{t.name}</span>
              {t.name === recommended.name && (
                <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">Best Match</span>
              )}
            </div>
            <p className="text-xs text-slate-500">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
