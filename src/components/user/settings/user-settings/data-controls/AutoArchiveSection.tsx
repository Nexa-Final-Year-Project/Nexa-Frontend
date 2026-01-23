"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Archive } from "lucide-react";

interface AutoArchiveSectionProps {
  autoArchive: boolean;
  archiveDuration: "30" | "60" | "90";
  onToggle: (value: boolean) => void;
  onChangeDuration: (value: "30" | "60" | "90") => void;
}

export const AutoArchiveSection = ({
  autoArchive,
  archiveDuration,
  onToggle,
  onChangeDuration,
}: AutoArchiveSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-neutral-900 dark:text-white">
        <Archive className="w-5 h-5 text-orange-500" /> Auto-Archive
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border shadow-sm mb-4 bg-white dark:bg-white/5 border-neutral-200 dark:border-white/10">
        <div className="min-w-0">
          <span className="font-medium text-neutral-900 dark:text-white">
            Automatically Archive
          </span>
          <p className="text-xs text-neutral-600 dark:text-white/60">
            Auto-archive inactive items after the selected duration.
          </p>
        </div>
        <Switch checked={autoArchive} onCheckedChange={onToggle} />
      </div>

      {autoArchive && (
        <div className="flex flex-wrap gap-2">
          {["30", "60", "90"].map((days) => (
            <Button
              key={days}
              variant={archiveDuration === days ? "secondary" : "outline"}
              size="sm"
              onClick={() => onChangeDuration(days as "30" | "60" | "90")}
            >
              {days} days
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
