"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="!border-0 !shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold">Data & Controls</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account data, storage, and archived items.
        </p>
      </CardHeader>
      <CardContent className="space-y-10">
        <ExportDataSection onExportData={onExportData} />
        <AutoArchiveSection
          autoArchive={autoArchive}
          archiveDuration={archiveDuration}
          onToggle={onToggleAutoArchive}
          onChangeDuration={onChangeArchiveDuration}
        />
        <ArchivedProjectsSection
          archivedProjectsCount={archivedProjects.length}
        />
        <StorageSection
          storageUsed={storageUsed}
          storageLimit={storageLimit}
          onClearCache={onClearCache}
        />
      </CardContent>
    </Card>
  );
};
