"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportDataSectionProps {
  onExportData: () => void;
}

export const ExportDataSection = ({ onExportData }: ExportDataSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-900 dark:text-white">
          <Download className="w-5 h-5 text-green-500" /> Export Data
        </h3>
        <p className="text-sm text-neutral-600 dark:text-white/60">
          Download a copy of your account data for backup or records.
        </p>
      </div>
      <Button onClick={onExportData} className="w-full sm:w-auto">
        Export Data
      </Button>
    </div>
  );
};
