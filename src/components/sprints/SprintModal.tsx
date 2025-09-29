import React, { useEffect } from "react";
import { Modal } from "../ui/modal/Modal";
import { Project } from "@/types/project";
import { SPRINT_FORM_FIELDS } from "@/lib/constants/sprints/sprints";

interface SprintModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export const SprintModal: React.FC<SprintModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      hideTrigger
      size="md"
      title={mode === "edit" ? "Edit Sprint" : "Create Sprint"}
      initialValues={initialData || {}}
      formFields={SPRINT_FORM_FIELDS} // Pass projects if needed
      submitButtonText={mode === "edit" ? "Update Sprint" : "Create Sprint"}
      onSubmit={onSubmit}
    />
  );
};
