import React, { useEffect, useMemo } from "react";
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
  // Provide default values to prevent controlled/uncontrolled input errors
  const defaultValues = useMemo(() => ({
    name: initialData?.name || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    goals: initialData?.goals || [],
  }), [initialData]);

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      hideTrigger
      size="md"
      title={mode === "edit" ? "Edit Sprint" : "Create Sprint"}
      initialValues={defaultValues}
      formFields={SPRINT_FORM_FIELDS}
      submitButtonText={mode === "edit" ? "Update Sprint" : "Create Sprint"}
      onSubmit={onSubmit}
    />
  );
};
