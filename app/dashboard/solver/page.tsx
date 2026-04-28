"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileImage, FileText, Loader2, SendHorizonal, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SolutionCard } from "@/components/solution-card";
import { extractImageText, extractPdfText } from "@/lib/client-file-extract";
import { examModes, subjects, type ExamMode, type SolverResult, type Subject } from "@/types/solver";

export default function SolverPage() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState<Subject>("Engineering Mathematics");
  const [mode, setMode] = useState<ExamMode>("GATE");
  const [result, setResult] = useState<SolverResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");

  async function solve() {
    if (!question.trim()) {
      setError("Enter or extract a question first.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, subject, mode, saveToHistory: true })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Solver failed.");
      return;
    }

    setResult(data.result);
  }

  async function handleFile(file?: File) {
    if (!file) {
      return;
    }

    setExtracting(true);
    setError("");

    try {
      const text = file.type === "application/pdf" ? await extractPdfText(file) : await extractImageText(file);
      setQuestion((current) => [current, text].filter(Boolean).join("\n\n"));
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Could not extract text from file.");
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <p className="text-sm text-primary">Core solver</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">AI Mathematics Solver</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Paste, type, upload an image, or extract a PDF question. NumerixAI saves each solve to local history.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Question Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Subject
                <Select value={subject} onChange={(event) => setSubject(event.target.value as Subject)}>
                  {subjects.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </Select>
              </label>
              <label className="space-y-2 text-sm font-medium">
                Exam Mode
                <Select value={mode} onChange={(event) => setMode(event.target.value as ExamMode)}>
                  {examModes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </Select>
              </label>
            </div>

            <Textarea
              className="min-h-72"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: Find the Laplace transform of t sin(at), then explain a shortcut method."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white/6 px-4 py-3 text-sm font-semibold transition hover:bg-white/10">
                <FileImage className="h-4 w-4" />
                Image OCR
                <input className="hidden" type="file" accept="image/*" onChange={(event) => void handleFile(event.target.files?.[0])} />
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white/6 px-4 py-3 text-sm font-semibold transition hover:bg-white/10">
                <FileText className="h-4 w-4" />
                PDF Extract
                <input className="hidden" type="file" accept="application/pdf" onChange={(event) => void handleFile(event.target.files?.[0])} />
              </label>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {extracting ? <p className="text-sm text-primary">Extracting text from file...</p> : null}

            <Button className="h-12 w-full" onClick={() => void solve()} disabled={loading || extracting}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
              {loading ? "Solving..." : "Solve and Save"}
            </Button>
          </CardContent>
        </Card>

        <div className="min-h-[32rem]">
          {loading ? (
            <Card className="flex min-h-[32rem] items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <WandSparkles className="h-8 w-8" />
                </div>
                <p className="font-semibold">Reasoning through formulas and steps...</p>
                <p className="max-w-sm text-sm text-muted-foreground">Provider fallback is automatic if a configured model fails.</p>
              </motion.div>
            </Card>
          ) : result ? (
            <SolutionCard result={result} />
          ) : (
            <Card className="flex min-h-[32rem] items-center justify-center p-8 text-center">
              <div>
                <WandSparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold">Your solution appears here</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  The answer will be split into data, formulas, steps, final answer, shortcut, and practice.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
