"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Light mode
        !isDark && [
          "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400",
          "hover:bg-white hover:border-neutral-300",
          "focus:bg-white focus-visible:border-neutral-400 focus-visible:ring-neutral-200/50 focus-visible:ring-2",
        ],
        // Dark mode
        isDark && [
          "bg-neutral-900/40 border-white/[0.06] text-white placeholder:text-white/30",
          "hover:bg-neutral-900/50 hover:border-white/[0.1]",
          "focus:bg-neutral-900/60 focus-visible:border-white/20 focus-visible:ring-white/10 focus-visible:ring-2",
        ],
        // Common styles
        "aria-invalid:ring-rose-500/20 dark:aria-invalid:ring-rose-500/40 aria-invalid:border-rose-500/50",
        "flex field-sizing-content min-h-24 w-full rounded-xl border px-4 py-3 text-sm shadow-xs transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 whitespace-pre-wrap break-words resize-none",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
