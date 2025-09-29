import { Modal } from "@/components/ui/modal/Modal";
import { FormField } from "@/types/form";
import { Sprint } from "@/types/sprint";
import React from "react";

interface SprintPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (data: { name: string; description: string }) => void;
  sprints: Sprint[];
}

const SprintPlannerModal: React.FC<SprintPlannerModalProps> = ({
  isOpen,
  onClose,
  handleSubmit,
  sprints,
}) => {
  const formFields = (sprints: Sprint[]): FormField[] => {
    return [
      {
        name: "name",
        label: "Sprint Name",
        type: "select",
        placeholder: "Enter sprint name",
        options: sprints.map((s) => ({ label: s.name, value: s._id })),
        required: true,
      },
      {
        name: "description",
        label: "Sprint Description",
        type: "text",
        placeholder: "Describe your sprint in detail...",
        required: true,
      },
    ];
  };
  return (
    <Modal
      title="Sprint Panner"
      open={isOpen}
      onOpenChange={onClose}
      formFields={formFields(sprints)}
      onSubmit={handleSubmit}
      submitButtonText="Plan Sprints"
      size="md"
      hideTrigger
    >
      <div>SprintPlannerModal</div>
    </Modal>
  );
};

export default SprintPlannerModal;
