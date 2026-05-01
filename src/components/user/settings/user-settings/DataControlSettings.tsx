"use client";

import { Database } from "lucide-react";
import { useTheme } from "next-themes";
import {
  ArchivedProjectsSection,
  AutoArchiveSection,
  ExportDataSection,
  StorageSection,
} from "./data-controls";

interface DataControlsSettingsProps {
  storageUsed: string;
  storageLimit: string;
  autoArchive: boolean;
  archiveDuration: "30" | "60" | "90";
  archivedProjects: { id: string; name: string; archivedAt: string }[];
  onExportData: () => void;
  onToggleAutoArchive: (value: boolean) => void;
  onChangeArchiveDuration: (value: "30" | "60" | "90") => void;
  onClearCache: () => void;
}

export const DataControlsSettings = ({
  storageUsed = "0",
  storageLimit = "0",
  autoArchive = false,
  archiveDuration = "30",
  archivedProjects = [],
  onExportData = () => {},
  onToggleAutoArchive = () => {},
  onChangeArchiveDuration = () => {},
  onClearCache = () => {},
}: DataControlsSettingsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="p-6 sm:p-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-violet-600" />
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <Database
              className={`w-5 h-5 ${
                isDark ? "text-white/70" : "text-neutral-500"
              }`}
            />
            Data & Controls
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/45" : "text-neutral-600"
          }`}
        >
          Manage your account data, storage, and archived items
        </p>
      </div>

      {/* Export Data */}
      <div
        className={`rounded-xl p-5 border ${
          isDark
            ? "bg-white/[0.03] border-white/[0.08]"
            : "bg-white border-neutral-200"
        }`}
      >
        <ExportDataSection onExportData={onExportData} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Auto Archive */}
      <div
        className={`rounded-xl p-5 border ${
          isDark
            ? "bg-white/[0.03] border-white/[0.08]"
            : "bg-white border-neutral-200"
        }`}
      >
        <AutoArchiveSection
          autoArchive={autoArchive}
          archiveDuration={archiveDuration}
          onToggle={onToggleAutoArchive}
          onChangeDuration={onChangeArchiveDuration}
        />
      </div>

      {/* Archived Projects */}
      <div
        className={`rounded-xl p-5 border ${
          isDark
            ? "bg-white/[0.03] border-white/[0.08]"
            : "bg-white border-neutral-200"
        }`}
      >
        <ArchivedProjectsSection
          archivedProjectsCount={archivedProjects.length}
          archivedProjects={archivedProjects}
        />
      </div>

      {/* Storage */}
      <div
        className={`rounded-xl p-5 border ${
          isDark
            ? "bg-white/[0.03] border-white/[0.08]"
            : "bg-white border-neutral-200"
        }`}
      >
        <StorageSection
          storageUsed={storageUsed}
          storageLimit={storageLimit}
          onClearCache={onClearCache}
        />
      </div>
    </div>
  );
};
