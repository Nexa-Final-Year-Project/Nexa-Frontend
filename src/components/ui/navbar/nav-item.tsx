"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Sparkles } from "lucide-react";

const navItemVariants = cva(
  "group/navitem relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer",
  {
    variants: {
      variant: {
        default: [
          "dark:hover:bg-white/[0.06] dark:text-white/70 dark:hover:text-white",
          "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900",
        ],
        ghost: [
          "dark:hover:bg-transparent dark:hover:text-white",
          "hover:bg-transparent hover:text-neutral-900",
        ],
        premium:
          "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300",
      },
      active: {
        true: [
          "dark:bg-white/[0.08] dark:text-white dark:border dark:border-white/[0.1]",
          "bg-neutral-100 text-neutral-900 border border-neutral-200",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface NavItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navItemVariants> {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  badgeVariant?: "default" | "premium";
}

export function NavItem({
  className,
  icon: Icon,
  label,
  badge,
  badgeVariant = "default",
  variant,
  active,
  ...props
}: NavItemProps) {
  return (
    <div
      className={cn(
        navItemVariants({ variant, active, className }),
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      )}
      {...props}
    >
      {Icon && (
        <div className="relative flex items-center justify-center w-8 h-8 transition-all group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9">
          <Icon className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400 group-hover/navitem:text-emerald-600 dark:group-hover/navitem:text-emerald-300 transition-colors" />
        </div>
      )}
      <span className="group-data-[collapsible=icon]:hidden relative z-10">
        {label}
      </span>
      {badge && (
        <span
          className={cn(
            "ml-auto rounded-lg px-2.5 py-1 text-xs font-semibold",
            badgeVariant === "premium"
              ? "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
              : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 dark:text-white/50 border border-neutral-200 dark:border-white/[0.04]",
            "group-data-[collapsible=icon]:hidden"
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
