import { Modal } from "@/components/ui/modal/Modal";
import { FormField } from "@/types/form";
import React from "react";

interface TaskGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (data: { description: string }) => void;
}

const TaskGeneratorModal: React.FC<TaskGeneratorModalProps> = ({
  isOpen,
  onClose,
  handleSubmit,
}) => {
  const formFields: FormField[] = [
    {
      name: "description",
      label: "Project Description",
      type: "text",
      placeholder: "Describe your project in detail...",
      required: true,
    },
  ];
  return (
    <Modal
      title="Task Generator"
      open={isOpen}
      onOpenChange={onClose}
      formFields={formFields}
      onSubmit={handleSubmit}
      submitButtonText="Generate Tasks"
      size="md"
      hideTrigger
    >
      <div>TaskGeneratorModal</div>
    </Modal>
  );
};

export default TaskGeneratorModal;
