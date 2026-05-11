"use client";

import type { TemplateInfo } from "@/lib/api";

const TEMPLATE_ICONS: Record<string, string> = {
  Technical: "💻",
  Creative: "🎨",
  Executive: "👔",
  Academic: "🎓",
  General: "📋",
};

const TEMPLATE_KEYS: Record<string, string> = {
  Technical: "technical",
  Creative: "creative",
  Executive: "executive",
  Academic: "academic",
  General: "general",
};

const ALL_TEMPLATES: TemplateInfo[] = [
  { name: "Technical", description: "Clean, skills-first layout with prominent tech stack section. Preferred by engineering recruiters.", reason: "" },
  { name: "Creative", description: "Visually distinctive with subtle design elements. Balances personality with professionalism.", reason: "" },
  { name: "Executive", description: "Polished, achievement-focused layout with strong summary section and quantified impact.", reason: "" },
  { name: "Academic", description: "Publications, research, and education-first structure. Traditional CV-style format.", reason: "" },
  { name: "General", description: "Balanced, versatile layout that works across industries. Clean chronological format.", reason: "" },
];

interface Props {
  recommended: TemplateInfo;
  onDownload: (templateKey: string) => Promise<void>;
  isDownloading: string | null;
}

export default function TemplateGallery({ recommended, onDownload, isDownloading }: Props) {
  return (
    <div className="space-y-4">
      {/* AI Recommended */}
      <div className="rounded-xl border-2 border-brand-500 bg-brand-50 p-4">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">AI Recommended</p>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{TEMPLATE_ICONS[recommended.name] ?? "📄"}</span>
            <div>
              <h4 className="font-bold text-slate-800">{recommended.name} Template</h4>
              <p className="text-sm text-slate-600 mt-0.5">{recommended.description}</p>
              <p className="text-xs text-brand-600 mt-1 font-medium">Why: {recommended.reason}</p>
            </div>
          </div>
          <button
            onClick={() => onDownload(TEMPLATE_KEYS[recommended.name] ?? "general")}
            disabled={!!isDownloading}
            className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition whitespace-nowrap"
          >
            {isDownloading === (TEMPLATE_KEYS[recommended.name] ?? "general") ? "Generating…" : "↓ Download DOCX"}
          </button>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-600">All Templates</h4>
      <p className="text-xs text-slate-400 -mt-2">Your resume content and structure stays the same — only the styling changes.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ALL_TEMPLATES.map((t) => {
          const key = TEMPLATE_KEYS[t.name] ?? "general";
          const isRecommended = t.name === recommended.name;
          const isActive = isDownloading === key;
          return (
            <div
              key={t.name}
              onClick={() => !isDownloading && onDownload(key)}
              className={`rounded-xl border p-4 cursor-pointer transition group ${
                isRecommended ? "border-brand-300 bg-brand-50 hover:border-brand-400" : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
              } ${isDownloading && !isActive ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{TEMPLATE_ICONS[t.name] ?? "📄"}</span>
                <span className="font-semibold text-sm text-slate-800">{t.name}</span>
                {isRecommended && (
                  <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">Best Match</span>
                )}
                <span className="ml-auto text-xs text-brand-600 opacity-0 group-hover:opacity-100 transition">
                  {isActive ? "Generating…" : "↓ Download DOCX"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.description}</p>
              {isActive && <p className="text-xs text-brand-500 mt-2 font-medium animate-pulse">Generating your resume…</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
