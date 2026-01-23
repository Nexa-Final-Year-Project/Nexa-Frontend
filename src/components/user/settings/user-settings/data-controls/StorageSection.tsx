"use client";

import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";

interface StorageSectionProps {
  storageUsed: string;
  storageLimit: string;
  onClearCache: () => void;
}

export const StorageSection = ({
  storageUsed,
  storageLimit,
  onClearCache,
}: StorageSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-900 dark:text-white">
          <HardDrive className="w-5 h-5 text-purple-500" /> Storage
        </h3>
        <p className="text-sm text-neutral-600 dark:text-white/60">
          {storageUsed} of {storageLimit} used.
        </p>
      </div>
      <Button variant="outline" onClick={onClearCache} className="w-full sm:w-auto">
        Clear Cache
      </Button>
    </div>
  );
};
