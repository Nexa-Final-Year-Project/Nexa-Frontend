import { DangerZoneModal } from "../ui/DangerZone/DangerZone";

export const SprintDangerZoneModal: React.FC<{
  sprintName: string;
  onDelete: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ sprintName, onDelete, open, onOpenChange }) => {
  return (
    <DangerZoneModal
      title="Delete Sprint"
      description="Once deleted, this sprint and all its data will be permanently removed."
      actionLabel="Delete Sprint"
      confirmText={sprintName}
      onConfirm={onDelete}
      open={open}
      onOpenChange={onOpenChange}
      warningMessage="Deleting this sprint will also remove all tasks associated with it. This action cannot be undone."
    />
  );
};
