import { Modal } from "@/components/ui/modal/Modal";
import { useProjects } from "@/hooks/projects/useProjects";
import { FormField } from "@/types/form";
import React from "react";

export const InviteMemberModal = ({
  projectId,
  open,
  onClose,
}: {
  projectId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { sendProjectInvite } = useProjects();

  const handleInvite = async (values: { projectId: string; email: string }) => {
    await sendProjectInvite(projectId, values.email);
  };

  const INVITE_MEMBER_FORM_FIELDS: FormField[] = [
    {
      label: "Email",
      type: "email",
      placeholder: "Enter member's email",
      required: true,
      name: "email",
    },
  ];

  return (
    <Modal
      title="Invite Member"
      description="Enter the email address of the member you want to invite."
      open={open}
      onOpenChange={onClose}
      onSubmit={handleInvite}
      formFields={INVITE_MEMBER_FORM_FIELDS}
      submitButtonText="Send Invite"
    />
  );
};
