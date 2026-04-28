"use client";

import { Copy, Download, Star } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MathRenderer } from "@/components/math-renderer";
import type { SolverResult } from "@/types/solver";

const sections: Array<[keyof SolverResult, string]> = [
  ["givenData", "Cleaned Input / Given Data"],
  ["requiredToFind", "Required To Find"],
  ["formulaUsed", "Formula Used"],
  ["stepwiseSolution", "Exam-Format Solution"],
  ["finalAnswer", "Final Answer"],
  ["shortcutMethod", "Shortcut Method"],
  ["practiceProblem", "Similar Practice Problem"]
];

export function SolutionCard({ result, onBookmark }: { result: SolverResult; onBookmark?: () => void }) {
  const plain = sections.map(([key, title]) => `${title}\n${result[key]}`).join("\n\n");

  function copySolution() {
    void navigator.clipboard.writeText(plain);
  }

  function exportPdf() {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(plain, 180);
    pdf.text(lines, 14, 18);
    pdf.save("numerixai-solution.pdf");
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Structured Solution</CardTitle>
          <p className="text-sm text-muted-foreground">Provider: {result.provider || "local fallback"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copySolution}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={exportPdf}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          {onBookmark ? (
            <Button variant="secondary" size="sm" onClick={onBookmark}>
              <Star className="h-4 w-4" />
              Save
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map(([key, title]) => (
          <section
            key={key}
            className={key === "finalAnswer" ? "rounded-xl border border-primary/40 bg-primary/10 p-4" : "rounded-xl border border-border bg-white/5 p-4"}
          >
            <h4 className="mb-2 text-sm font-semibold text-white">{title}</h4>
            <MathRenderer value={String(result[key] || "")} />
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
