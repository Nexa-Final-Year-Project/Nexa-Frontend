"use client";

import { Database, Download, Archive, HardDrive } from "lucide-react";
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
  onOpenArchivedProjectsModal: () => void;
}

export const DataControlsSettings = ({
  storageUsed = "0",
  storageLimit = "0",
  autoArchive = false,
  archiveDuration = "30",
  archivedProjects = [
    {
      id: "1",
      name: "Project Alpha",
      archivedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Project Beta",
      archivedAt: new Date().toISOString(),
    },
  ],
  onExportData,
  onToggleAutoArchive,
  onChangeArchiveDuration,
  onClearCache,
}: DataControlsSettingsProps) => {
  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-violet-600" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-white/60" />
            Data & Controls
          </h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Manage your account data, storage, and archived items
        </p>
      </div>

      {/* Export Data */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
        <ExportDataSection onExportData={onExportData} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Auto Archive */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
        <AutoArchiveSection
          autoArchive={autoArchive}
          archiveDuration={archiveDuration}
          onToggle={onToggleAutoArchive}
          onChangeDuration={onChangeArchiveDuration}
        />
      </div>

      {/* Archived Projects */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
        <ArchivedProjectsSection
          archivedProjectsCount={archivedProjects.length}
        />
      </div>

      {/* Storage */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
        <StorageSection
          storageUsed={storageUsed}
          storageLimit={storageLimit}
          onClearCache={onClearCache}
        />
      </div>
    </div>
  );
};
