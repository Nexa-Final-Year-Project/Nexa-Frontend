"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const navItemVariants = cva(
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "",
        ghost: "hover:bg-transparent hover:underline",
        premium: "text-amber-600 dark:text-amber-400",
      },
      active: {
        true: "bg-accent text-accent-foreground",
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
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="group-data-[collapsible=icon]:hidden">{label}</span>
      {badge && (
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 text-xs",
            badgeVariant === "premium"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
            "group-data-[collapsible=icon]:hidden"
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
