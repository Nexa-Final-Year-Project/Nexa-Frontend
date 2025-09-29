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
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-purple-500" /> Storage
        </h3>
        <p className="text-sm text-gray-500">
          {storageUsed} of {storageLimit} used.
        </p>
      </div>
      <Button variant="outline" onClick={onClearCache}>
        Clear Cache
      </Button>
    </div>
  );
};
