import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI — Smart Resume Optimizer",
  description:
    "Upload your resume and get AI-powered corrections, ATS score, and field-specific suggestions instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
              <span className="text-2xl">📄</span> ResumeAI
            </a>
            <span className="text-sm text-slate-500">Powered by Claude</span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="mt-16 border-t py-6 text-center text-sm text-slate-400">
          Built with Next.js + FastAPI + Claude API
        </footer>
      </body>
    </html>
  );
}
