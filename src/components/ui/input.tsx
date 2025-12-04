import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary/20 selection:text-foreground",
        "flex h-10 w-full min-w-0 rounded-xl border px-4 py-2 text-sm shadow-xs transition-all duration-300 outline-none",
        "bg-background border-border",
        "dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/30",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:bg-white",
        "dark:focus:border-white/20 dark:focus:ring-white/10 dark:focus:bg-white/[0.05]",
        "hover:border-neutral-300 hover:bg-neutral-50",
        "dark:hover:border-white/[0.12] dark:hover:bg-white/[0.04]",
        "aria-invalid:ring-rose-200 dark:aria-invalid:ring-rose-500/20 aria-invalid:border-rose-300 dark:aria-invalid:border-rose-500/50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
