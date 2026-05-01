import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal/Modal";
import { useModalStore } from "@/store/modal/modalStore";
import React from "react";

export const ArchiveProjectsModal = ({
  archivedProjects,
  onRestore,
  onDelete,
  isOpen,
  onOpenChange,
}: {
  archivedProjects: { id: string; name: string; archivedAt: string }[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { openModal } = useModalStore();
  const archivedList = Array.isArray(archivedProjects)
    ? archivedProjects
    : archivedProjects
      ? [archivedProjects as any]
      : [];

  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Archived Projects"
      size="lg"
      showFooter={false}
      hideTrigger
    >
      {archivedList.map((project) => (
        <div
          key={project.id}
          className="flex items-center justify-between p-4 rounded-lg border shadow-sm"
        >
          <div>
            <span className="font-medium">{project.name}</span>
            <p className="text-xs text-gray-500">
              Archived on {new Date(project.archivedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRestore(project.id)}
            >
              Restore
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                openModal("project.delete", {
                  id: project.id,
                  name: project.name,
                })
              }
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default ArchiveProjectsModal;
