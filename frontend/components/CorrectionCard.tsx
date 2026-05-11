"use client";

import { useState } from "react";
import type { Correction } from "@/lib/api";

interface Props {
  correction: Correction;
  applied: boolean;
  onApply: () => void;
}

export default function CorrectionCard({ correction, applied, onApply }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border overflow-hidden ${applied ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Section badge — fixed width, top-aligned */}
        <span className="shrink-0 mt-0.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 whitespace-nowrap">
          {correction.section}
        </span>

        {/* Issue text — takes remaining space, wraps freely */}
        <p className="flex-1 text-sm text-slate-700 font-medium leading-snug min-w-0">
          {correction.issue}
        </p>

        {/* Actions — top-aligned, shrink-proof */}
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <button
            onClick={onApply}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition whitespace-nowrap ${
              applied
                ? "bg-emerald-100 text-emerald-700 hover:bg-red-50 hover:text-red-600 hover:border hover:border-red-200"
                : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
            title={applied ? "Click to deselect" : "Apply this change"}
          >
            {applied ? "Applied ✓" : "Apply"}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-slate-400 hover:text-slate-600 text-xs w-5 text-center"
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-brand-600">Suggestion: </span>
            {correction.suggestion}
          </p>
        </div>
      )}
    </div>
  );
}
