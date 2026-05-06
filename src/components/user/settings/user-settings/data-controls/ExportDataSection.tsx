"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useLazyExportDataQuery } from "@/api/auth/authApi";
import toast from "@/lib/customToast";

interface ExportDataSectionProps {
  onExportData?: () => void;
}

export const ExportDataSection = ({ onExportData }: ExportDataSectionProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [triggerExport] = useLazyExportDataQuery();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await triggerExport().unwrap();
      
      // Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: "application/json",
      });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nexa-data-export-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully!");
      onExportData?.();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

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
      <Button 
        onClick={handleExportData} 
        className="w-full sm:w-auto"
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </>
        )}
      </Button>
    </div>
  );
};
