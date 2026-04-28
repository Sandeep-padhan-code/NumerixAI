"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subjects, type HistoryItem, type Subject } from "@/types/solver";

export default function PracticePage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [subject, setSubject] = useState<Subject>("Engineering Mathematics");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((response) => response.json())
      .then((data) => setHistory(data.history || []));
  }, []);

  const problem = useMemo(() => {
    const pool = history.filter((item) => item.subject === subject);
    return pool[0]?.practiceProblem || `Create and solve one ${subject} practice problem using the same pattern as your recent solves.`;
  }, [history, subject]);

  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <p className="text-sm text-primary">Active recall</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">Practice Mode</h1>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Generated Practice</CardTitle>
          <Select className="max-w-xs" value={subject} onChange={(event) => setSubject(event.target.value as Subject)}>
            {subjects.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border bg-white/5 p-4 text-sm leading-7 text-slate-200">{problem}</div>
          <Textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Attempt your solution here..." />
          <Button variant="secondary" onClick={() => setAnswer("")}>
            <RefreshCcw className="h-4 w-4" />
            Reset attempt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
