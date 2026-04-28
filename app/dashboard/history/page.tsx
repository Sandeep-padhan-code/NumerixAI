"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SolutionCard } from "@/components/solution-card";
import { compactText, formatDate } from "@/lib/utils";
import { subjects, type HistoryItem, type Subject } from "@/types/solver";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  const query = useMemo(() => new URLSearchParams({ q, subject }).toString(), [q, subject]);

  async function load() {
    const response = await fetch(`/api/history?${query}`);
    const data = await response.json();
    setItems(data.history || []);
  }

  useEffect(() => {
    let active = true;

    fetch(`/api/history?${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setItems(data.history || []);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  async function remove(id: string) {
    await fetch("/api/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (selected?.id === id) {
      setSelected(null);
    }
    await load();
  }

  async function bookmark(item: HistoryItem) {
    await fetch("/api/history/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, bookmarked: !item.bookmarked })
    });
    await load();
  }

  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <p className="text-sm text-primary">Saved work</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">History</h1>
      </section>

      <Card>
        <CardContent className="grid gap-3 pt-5 md:grid-cols-[1fr_18rem]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search questions..." value={q} onChange={(event) => setQ(event.target.value)} />
          </label>
          <Select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">All subjects</option>
            {subjects.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="cursor-pointer transition hover:border-primary/40" onClick={() => setSelected(item)}>
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{compactText(item.question, 120)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.createdAt)} / {item.subject} / {item.mode}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); void bookmark(item); }}>
                      <Star className={item.bookmarked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); void remove(item.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-primary">{compactText(item.finalAnswer, 140)}</p>
              </CardContent>
            </Card>
          ))}
          {!items.length ? <p className="text-sm text-muted-foreground">No saved solves found.</p> : null}
        </div>

        {selected ? (
          <SolutionCard result={selected} />
        ) : (
          <Card className="flex min-h-96 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Select a solve to inspect, copy, or export.
          </Card>
        )}
      </div>
    </div>
  );
}
