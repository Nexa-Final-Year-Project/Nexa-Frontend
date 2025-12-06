import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-neutral-400 dark:focus-visible:border-white/20 focus-visible:ring-neutral-200/50 dark:focus-visible:ring-white/10 focus-visible:ring-2 transition-all duration-200 [&>svg]:shrink-0 leading-normal",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-200 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200 [a&]:hover:bg-neutral-300 dark:[a&]:hover:bg-neutral-600/50",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-600 dark:bg-white/[0.06] dark:text-white/70 [a&]:hover:bg-neutral-200 dark:[a&]:hover:bg-white/[0.1]",
        destructive:
          "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 [a&]:hover:bg-rose-200 dark:[a&]:hover:bg-rose-500/30 focus-visible:ring-rose-500/20 dark:focus-visible:ring-rose-500/40",
        outline:
          "border-neutral-200 text-neutral-600 bg-transparent dark:border-white/[0.1] dark:text-white/70 [a&]:hover:bg-neutral-100 dark:[a&]:hover:bg-white/[0.04] [a&]:hover:text-neutral-900 dark:[a&]:hover:text-white",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 [a&]:hover:bg-emerald-200 dark:[a&]:hover:bg-emerald-500/30",
        warning:
          "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 [a&]:hover:bg-amber-200 dark:[a&]:hover:bg-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
