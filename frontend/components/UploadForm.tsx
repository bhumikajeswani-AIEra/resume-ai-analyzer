"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { analyzeResume } from "@/lib/api";

const FIELDS = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "Marketing",
  "Finance",
  "Design (UX/UI)",
  "General",
];

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [field, setField] = useState("");
  const [customField, setCustomField] = useState("");
  const [years, setYears] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = (e.target?.result as string).split(",")[1] ?? "";
      sessionStorage.setItem("resumeFileBase64", b64);
      sessionStorage.setItem("resumeFileType", f.name.toLowerCase().endsWith(".docx") ? "docx" : "pdf");
    };
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => setError("Invalid file. Please upload a PDF or DOCX under 5MB."),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please upload a resume file.");
    const targetField = field === "Other" ? customField : field;
    if (!targetField.trim()) return setError("Please specify a target field.");
    if (!years) return setError("Please enter your years of experience.");

    setLoading(true);
    setError("");
    try {
      const result = await analyzeResume(file, targetField, years ? Number(years) : undefined);
      sessionStorage.setItem("resumeResult", JSON.stringify(result));
      sessionStorage.setItem("resumeField", targetField);
      router.push("/results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-white hover:border-brand-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl">{file ? "✅" : "📄"}</span>
          {file ? (
            <div>
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB — click or drag to replace</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-slate-700">Drop your resume here or click to browse</p>
              <p className="text-sm text-slate-400 mt-1">PDF or DOCX — max 5 MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Target field */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Field *</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select a field...</option>
            {FIELDS.map((f) => <option key={f}>{f}</option>)}
            <option value="Other">Other (type below)</option>
          </select>
        </div>

        {field === "Other" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Specify Field *</label>
            <input
              type="text"
              value={customField}
              onChange={(e) => setCustomField(e.target.value)}
              placeholder="e.g. Cybersecurity, Operations..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
          <input
            type="number"
            min={0}
            max={50}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 3"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing your resume...
          </span>
        ) : "Analyze Resume"}
      </button>
    </form>
  );
}
