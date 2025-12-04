"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterPanelDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear?: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

export function FilterPanelDrawer({
  open,
  onClose,
  onApply,
  onClear,
  title = "Filters",
  children,
  side = "right",
}: FilterPanelDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={side}
        className="bg-neutral-900/95 backdrop-blur-xl border-white/[0.08] flex flex-col w-[360px]"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-white">{title}</SheetTitle>
        </SheetHeader>

        {/* scrollable filter area */}
        <div className="flex-1 overflow-y-auto space-y-6 p-4">{children}</div>

        {/* sticky footer */}
        <div className="p-4 border-t border-white/[0.06] flex justify-between gap-3">
          {onClear && (
            <Button 
              variant="outline" 
              onClick={onClear} 
              className="
                flex-1 rounded-xl border-white/[0.06] text-white/60 bg-white/[0.02]
                hover:bg-white/[0.06] hover:text-white hover:border-white/[0.1]
                transition-all duration-200
              "
            >
              Clear
            </Button>
          )}
          <Button 
            onClick={onApply} 
            className="
              flex-1 rounded-xl
              bg-gradient-to-r from-violet-500 to-violet-600 text-white
              hover:from-violet-600 hover:to-violet-700
              shadow-[0_0_20px_rgba(139,92,246,0.3)]
              transition-all duration-200
            "
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
