// DatePickerField.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";

export function DatePickerField({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      {/* 👇 Force popover into body so it's clickable inside Dialog */}
      <PopoverPortal container={document.body}>
        <PopoverContent className="w-auto p-0 z-[9999]">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(val) => {
              onChange(val);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
