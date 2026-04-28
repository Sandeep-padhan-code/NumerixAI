"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  BrainCircuit,
  Clock3,
  FileText,
  FunctionSquare,
  History,
  LogOut,
  Settings,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Sparkles },
  { href: "/dashboard/solver", label: "Solver", icon: BrainCircuit },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/formulas", label: "Formula Vault", icon: FunctionSquare },
  { href: "/dashboard/notes", label: "Revision Notes", icon: FileText },
  { href: "/dashboard/practice", label: "Practice", icon: BookOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="glass fixed inset-x-3 bottom-3 z-30 rounded-xl p-2 lg:sticky lg:top-4 lg:inset-x-auto lg:bottom-auto lg:h-[calc(100vh-2rem)] lg:w-72 lg:p-4">
      <div className="hidden items-center gap-3 px-2 pb-6 lg:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold">NumerixAI</p>
          <p className="text-xs text-muted-foreground">Private math console</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/8 hover:text-white lg:min-w-0",
                active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden pt-6 lg:block">
        <div className="rounded-xl border border-border bg-white/5 p-3 text-xs leading-5 text-muted-foreground">
          Default password is <span className="text-white">numerixai</span>. Change it by setting
          <span className="text-white"> APP_PASSWORD_HASH</span>.
        </div>
        <Button className="mt-3 w-full" variant="secondary" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Lock app
        </Button>
      </div>
    </aside>
  );
}
