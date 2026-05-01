"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal/modalStore";
import { Archive } from "lucide-react";

interface ArchivedProjectsSectionProps {
  archivedProjectsCount: number;
  archivedProjects?: { id: string; name: string; archivedAt: string }[];
}

export const ArchivedProjectsSection = ({
  archivedProjectsCount,
  archivedProjects = [],
}: ArchivedProjectsSectionProps) => {
  const { openModal } = useModalStore();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1 text-neutral-900 dark:text-white">
          <Archive className="w-5 h-5 text-orange-500" /> Archived Projects
        </h3>
        <p className="text-sm text-neutral-600 dark:text-white/60 mb-1">
          Manage your archived projects.
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => openModal("project.archived-list", archivedProjects)}
      >
        Manage Archived Projects ({archivedProjectsCount})
      </Button>
    </div>
  );
};
