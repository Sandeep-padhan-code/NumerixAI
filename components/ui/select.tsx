import * as React from "react";
import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-[#111722] px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
        props.className
      )}
    />
  );
}
