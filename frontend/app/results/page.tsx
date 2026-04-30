"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResponse } from "@/lib/api";
import ScoreGauge from "@/components/ScoreGauge";
import CorrectionCard from "@/components/CorrectionCard";
import ATSPanel from "@/components/ATSPanel";
import TemplateGallery from "@/components/TemplateGallery";

type Tab = "corrections" | "ats" | "suggestions" | "templates";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [field, setField] = useState("");
  const [tab, setTab] = useState<Tab>("corrections");

  useEffect(() => {
    const raw = sessionStorage.getItem("resumeResult");
    const f = sessionStorage.getItem("resumeField");
    if (!raw) { router.push("/"); return; }
    setResult(JSON.parse(raw));
    setField(f || "");
  }, [router]);

  if (!result) return <p className="text-center text-slate-400 py-20">Loading results...</p>;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "corrections", label: "Corrections", count: result.corrections.length },
    { id: "ats", label: "ATS Score", count: result.ats.score },
    { id: "suggestions", label: "Suggestions", count: result.field_suggestions.length },
    { id: "templates", label: "Templates" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resume Analysis Results</h1>
          {field && <p className="text-slate-500 mt-1">Target field: <span className="font-medium text-slate-700">{field}</span></p>}
        </div>
        <button
          onClick={() => router.push("/")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          ← Analyze Another
        </button>
      </div>

      {/* Score + Strengths */}
      <div className="rounded-2xl bg-white border shadow-sm p-6 grid gap-6 sm:grid-cols-[auto_1fr]">
        <ScoreGauge score={result.overall_score} />
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Strengths</h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                tab === t.id
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  tab === t.id ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {t.count}{t.id === "ats" ? "%" : ""}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "corrections" && (
            <div className="space-y-3">
              {result.corrections.length === 0 ? (
                <p className="text-slate-400 text-sm">No corrections found — great job!</p>
              ) : (
                result.corrections.map((c, i) => <CorrectionCard key={i} correction={c} />)
              )}
            </div>
          )}

          {tab === "ats" && <ATSPanel ats={result.ats} />}

          {tab === "suggestions" && (
            <ul className="space-y-3">
              {result.field_suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 border px-4 py-3">
                  <span className="text-brand-500 font-bold text-sm mt-0.5">{i + 1}</span>
                  <p className="text-sm text-slate-700">{s}</p>
                </li>
              ))}
            </ul>
          )}

          {tab === "templates" && <TemplateGallery recommended={result.template} />}
        </div>
      </div>
    </div>
  );
}
