import { DangerZoneModal } from "../ui/DangerZone/DangerZone";

export const ProjectDangerZoneModal: React.FC<{
  projectName: string;
  onDelete: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ projectName, onDelete, open, onOpenChange }) => {
  return (
    <DangerZoneModal
      title="Delete Project"
      description="Once deleted, this project and all its data will be permanently removed."
      actionLabel="Delete Project"
      confirmText={projectName}
      onConfirm={onDelete}
      open={open}
      onOpenChange={onOpenChange}
      warningMessage="Deleting this project will also remove all tasks associated with it. This action cannot be undone."
    />
  );
};
