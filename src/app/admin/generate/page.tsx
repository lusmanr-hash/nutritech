"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface GenerationResult {
  total: number;
  success: number;
  failed: number;
  results: { employeeName: string; status: string; error?: string }[];
}

export default function GeneratePage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");

  async function generatePlans() {
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate-plan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate plans");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  async function sendEmails() {
    try {
      const res = await fetch("/api/send-emails", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`Emails queued: ${data.sent} sent, ${data.failed} failed`);
      } else {
        alert(data.error || "Failed to send emails");
      }
    } catch {
      alert("Something went wrong");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Generate Meal Plans</h1>
        <p className="mt-1 text-sm text-[#3A4A42]/60">
          Generate personalized weekly plans for all onboarded employees
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-[#27AE60]" />
              AI Plan Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#3A4A42]/70">
              This will use AI to generate personalized meal plans for every employee
              who has completed onboarding, based on the current week&apos;s menu and their
              profile.
            </p>
            <Button onClick={generatePlans} disabled={generating} size="lg" className="w-full">
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating plans...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate All Plans
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Send Emails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#3A4A42]/70">
              Send the generated meal plans to all employees via email. Plans must be generated first.
            </p>
            <Button onClick={sendEmails} variant="secondary" size="lg" className="w-full">
              Send Weekly Emails
            </Button>
            <p className="text-xs text-[#3A4A42]/50">
              Note: Email sending requires Resend API key configuration. For MVP, email HTML is generated but not sent.
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Generation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <div className="rounded-lg bg-[#27AE60]/10 px-4 py-2 text-center">
                <p className="text-2xl font-bold text-[#27AE60]">{result.success}</p>
                <p className="text-xs text-[#3A4A42]/60">Success</p>
              </div>
              {result.failed > 0 && (
                <div className="rounded-lg bg-red-50 px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-red-500">{result.failed}</p>
                  <p className="text-xs text-[#3A4A42]/60">Failed</p>
                </div>
              )}
              <div className="rounded-lg bg-gray-100 px-4 py-2 text-center">
                <p className="text-2xl font-bold text-[#1A1A2E]">{result.total}</p>
                <p className="text-xs text-[#3A4A42]/60">Total</p>
              </div>
            </div>
            <div className="space-y-2">
              {result.results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {r.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-[#27AE60]" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{r.employeeName}</span>
                  {r.error && <span className="text-red-500">— {r.error}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
