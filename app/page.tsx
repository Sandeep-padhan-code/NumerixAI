import Link from "next/link";
import { ArrowRight, BrainCircuit, FunctionSquare, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { icon: BrainCircuit, title: "AI solver", text: "Stepwise solutions, formulas, shortcuts, and final answers." },
  { icon: FunctionSquare, title: "Exam math", text: "GATE, IIT, engineering mathematics, numericals, and methods." },
  { icon: Lock, title: "Private local app", text: "SQLite storage and a personal password lock for long-term use." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">NumerixAI</span>
          </div>
          <Button asChild variant="secondary">
            <Link href="/login">Open App</Link>
          </Button>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-border bg-white/6 px-4 py-2 text-sm text-muted-foreground">
              Private AI engineering mathematics workspace
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black tracking-normal text-white sm:text-7xl">
                NumerixAI
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Solve engineering mathematics with clean steps, exam shortcuts, formula memory, OCR input,
                history, practice, and PDF export in one local-first dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="h-12 px-6" asChild>
                <Link href="/login">
                  Start solving <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button className="h-12 px-6" variant="outline" asChild>
                <Link href="/dashboard/solver">Go to solver</Link>
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="rounded-xl border border-border bg-[#0b1018] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <h2 className="text-xl font-bold">Laplace Transform</h2>
                </div>
                <div className="rounded-full bg-primary/15 px-3 py-1 text-sm text-primary">GATE Mode</div>
              </div>
              <div className="space-y-3">
                {["Given Data", "Formula Used", "Stepwise Solution", "Final Answer"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-border bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-semibold">{item}</h3>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10" />
                    <div className="mt-2 h-2 w-3/4 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 pb-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-5 w-5 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">{feature.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
