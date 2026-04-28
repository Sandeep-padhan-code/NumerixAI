"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MathRenderer } from "@/components/math-renderer";
import { subjects, type FormulaItem, type Subject } from "@/types/solver";

export default function FormulasPage() {
  const [items, setItems] = useState<FormulaItem[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("Engineering Mathematics");
  const [formula, setFormula] = useState("");
  const [notes, setNotes] = useState("");

  async function load() {
    const response = await fetch("/api/formulas");
    const data = await response.json();
    setItems(data.formulas || []);
  }

  useEffect(() => {
    let active = true;

    fetch("/api/formulas")
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setItems(data.formulas || []);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/formulas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject, formula, notes })
    });
    setTitle("");
    setFormula("");
    setNotes("");
    await load();
  }

  async function remove(id: string) {
    await fetch("/api/formulas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    await load();
  }

  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <p className="text-sm text-primary">Formula memory</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">Formula Vault</h1>
      </section>

      <div className="grid gap-5 lg:grid-cols-[24rem_1fr]">
        <Card>
          <CardHeader><CardTitle>Add Formula</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={add}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
              <Select value={subject} onChange={(event) => setSubject(event.target.value as Subject)}>
                {subjects.map((item) => <option key={item}>{item}</option>)}
              </Select>
              <Textarea value={formula} onChange={(event) => setFormula(event.target.value)} placeholder="Formula with $LaTeX$" required />
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes or use cases" />
              <Button className="w-full"><Plus className="h-4 w-4" />Add</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-xs text-primary">{item.subject}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => void remove(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <MathRenderer value={item.formula} />
                {item.notes ? <p className="text-sm text-muted-foreground">{item.notes}</p> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
