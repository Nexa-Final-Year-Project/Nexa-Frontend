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
  side?: "left" | "right" | "top" | "bottom"; // 🔹 control placement
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
        className="bg-white dark:bg-gray-900 flex flex-col w-[340px]"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
        </SheetHeader>

        {/* 🔹 scrollable filter area */}
        <div className="flex-1 overflow-y-auto space-y-6 p-4">{children}</div>

        {/* 🔹 sticky footer */}
        <div className="p-4 border-t flex justify-between gap-2">
          {onClear && (
            <Button variant="outline" onClick={onClear} className="flex-1">
              Clear
            </Button>
          )}
          <Button onClick={onApply} className="flex-1">
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
