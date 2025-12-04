"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Light mode
        "data-[state=checked]:bg-neutral-900 data-[state=unchecked]:bg-neutral-200",
        "focus-visible:ring-neutral-300/50",
        // Dark mode
        "dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-white/[0.08]",
        "dark:focus-visible:ring-white/20",
        // Common
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all duration-300 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:data-[state=checked]:bg-neutral-900 pointer-events-none block size-4 rounded-full ring-0 transition-transform duration-300 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0.5 shadow-sm"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
