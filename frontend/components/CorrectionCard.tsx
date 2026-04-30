"use client";

import { useState } from "react";
import type { Correction } from "@/lib/api";

export default function CorrectionCard({ correction }: { correction: Correction }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            {correction.section}
          </span>
          <span className="text-sm text-slate-700 font-medium">{correction.issue}</span>
        </div>
        <span className="text-slate-400 text-lg">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 border-t bg-slate-50">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-brand-600">Suggestion: </span>
            {correction.suggestion}
          </p>
        </div>
      )}
    </div>
  );
}
