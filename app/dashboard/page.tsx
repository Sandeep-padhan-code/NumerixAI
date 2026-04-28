import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Clock3, FunctionSquare } from "lucide-react";
import { prisma } from "@/lib/db";
import { compactText, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const [recent, total, formulas, notes] = await Promise.all([
    prisma.solveHistory.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.solveHistory.count(),
    prisma.formulaItem.count(),
    prisma.revisionNote.count()
  ]);

  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-primary">Personal AI engineering solver</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Solve, save, revise, export, and practice engineering mathematics from one private local workspace.
            </p>
          </div>
          <Button asChild className="h-11">
            <Link href="/dashboard/solver">
              New solve <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Solves", value: total, Icon: BrainCircuit },
          { label: "Formulas", value: formulas, Icon: FunctionSquare },
          { label: "Notes", value: notes, Icon: BookOpen },
          { label: "Recent", value: recent.length, Icon: Clock3 }
        ].map(({ label, value, Icon }) => (
          <Card key={String(label)}>
            <CardHeader>
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-black">{value}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Solves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length ? (
            recent.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium">{compactText(item.question, 100)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm text-primary">{item.subject} / {item.mode}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No solves yet. Start with the solver page.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
