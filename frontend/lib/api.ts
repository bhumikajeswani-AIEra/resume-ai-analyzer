export interface Correction {
  section: string;
  issue: string;
  suggestion: string;
}

export interface ATSResult {
  score: number;
  matched: string[];
  missing: string[];
}

export interface TemplateInfo {
  name: string;
  description: string;
  reason: string;
}

export interface AnalysisResponse {
  overall_score: number;
  strengths: string[];
  corrections: Correction[];
  field_suggestions: string[];
  ats: ATSResult;
  missing_keywords: string[];
  template: TemplateInfo;
  resume_text: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeResume(
  file: File,
  targetField: string,
  yearsExperience?: number
): Promise<AnalysisResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("target_field", targetField);
  if (yearsExperience !== undefined) {
    form.append("years_experience", String(yearsExperience));
  }

  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Server error ${res.status}`);
  }

  return res.json();
}

async function _download(body: object): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Server error ${res.status}`);
  }
  return res.blob();
}

export function downloadWithCorrections(
  resumeText: string,
  corrections: Correction[],
  fileBase64: string,
  fileType: string
): Promise<Blob> {
  return _download({ resume_text: resumeText, corrections, file_base64: fileBase64, file_type: fileType });
}

export function downloadTemplate(resumeText: string, template: string): Promise<Blob> {
  return _download({ resume_text: resumeText, corrections: [], template });
}
