"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal/modalStore";
import { Archive } from "lucide-react";

interface ArchivedProjectsSectionProps {
  archivedProjectsCount: number;
}

export const ArchivedProjectsSection = ({
  archivedProjectsCount,
}: ArchivedProjectsSectionProps) => {
  const { openModal } = useModalStore();
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <Archive className="w-5 h-5 text-orange-500" /> Archived Projects
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          Manage your archived projects.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() =>
          openModal("project.archive", [
            {
              id: "1",
              name: "Project Alpha",
              archivedAt: "2024-01-15",
            },
            {
              id: "2",
              name: "Project Beta",
              archivedAt: "2024-01-16",
            },
          ])
        }
      >
        Manage Archived Projects ({archivedProjectsCount})
      </Button>
    </div>
  );
};
