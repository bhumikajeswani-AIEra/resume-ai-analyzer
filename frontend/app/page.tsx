import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Get Your Resume <span className="text-brand-600">AI-Reviewed</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Upload your resume, pick your target field, and receive instant corrections,
          ATS keyword analysis, and field-specific suggestions — powered by Claude.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          "📊 ATS Score",
          "✏️ Corrections",
          "🎯 Field Suggestions",
          "🖼️ Template Picks",
        ].map((f) => (
          <span key={f} className="rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            {f}
          </span>
        ))}
      </div>

      {/* Upload card */}
      <div className="mx-auto max-w-2xl rounded-3xl bg-white shadow-sm border p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Upload Your Resume</h2>
        <UploadForm />
      </div>
    </div>
  );
}
