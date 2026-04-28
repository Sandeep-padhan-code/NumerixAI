"use client";

import { useEffect, useState } from "react";
import { Pin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subjects, type RevisionNote, type Subject } from "@/types/solver";

export default function NotesPage() {
  const [notes, setNotes] = useState<RevisionNote[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("Engineering Mathematics");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  async function load() {
    const response = await fetch("/api/notes");
    const data = await response.json();
    setNotes(data.notes || []);
  }

  useEffect(() => {
    let active = true;

    fetch("/api/notes")
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setNotes(data.notes || []);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject, content, pinned })
    });
    setTitle("");
    setContent("");
    setPinned(false);
    await load();
  }

  async function remove(id: string) {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    await load();
  }

  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <p className="text-sm text-primary">Revision system</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">Revision Notes</h1>
      </section>

      <div className="grid gap-5 lg:grid-cols-[24rem_1fr]">
        <Card>
          <CardHeader><CardTitle>Add Note</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={add}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
              <Select value={subject} onChange={(event) => setSubject(event.target.value as Subject)}>
                {subjects.map((item) => <option key={item}>{item}</option>)}
              </Select>
              <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Revision note" required />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} />
                Pin this note
              </label>
              <Button className="w-full"><Plus className="h-4 w-4" />Add</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:grid-cols-2">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {note.pinned ? <Pin className="h-4 w-4 text-primary" /> : null}
                    {note.title}
                  </CardTitle>
                  <p className="text-xs text-primary">{note.subject}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => void remove(note.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{note.content}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
