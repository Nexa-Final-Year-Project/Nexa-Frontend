"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportDataSectionProps {
  onExportData: () => void;
}

export const ExportDataSection = ({ onExportData }: ExportDataSectionProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5 text-green-500" /> Export Data
        </h3>
        <p className="text-sm text-gray-500">
          Download a copy of your account data for backup or records.
        </p>
      </div>
      <Button onClick={onExportData}>Export Data</Button>
    </div>
  );
};
