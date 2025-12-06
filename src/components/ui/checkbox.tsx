"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Light mode
        "peer border-neutral-300 bg-white",
        "hover:border-neutral-400 hover:bg-neutral-50",
        "focus-visible:border-neutral-400 focus-visible:ring-neutral-200/50",
        // Dark mode
        "dark:border-white/[0.1] dark:bg-white/[0.02]",
        "dark:hover:border-white/[0.2] dark:hover:bg-white/[0.04]",
        "dark:focus-visible:border-white/20 dark:focus-visible:ring-white/10",
        // Checked state
        "data-[state=checked]:bg-neutral-900 data-[state=checked]:text-white data-[state=checked]:border-neutral-900",
        "dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-neutral-900 dark:data-[state=checked]:border-white",
        // Error state
        "aria-invalid:ring-rose-500/20 dark:aria-invalid:ring-rose-500/40 aria-invalid:border-rose-500/50",
        // Common
        "size-4.5 shrink-0 rounded-md border shadow-xs transition-all duration-200 outline-none focus-visible:ring-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
