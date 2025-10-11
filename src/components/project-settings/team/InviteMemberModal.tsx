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

  const handleInvite = async (values: { projectId: string; email: string; role?: string }) => {
    const role = values.role || "Member";
    await sendProjectInvite(projectId, values.email, role);
  };

  const INVITE_MEMBER_FORM_FIELDS: FormField[] = [
    {
      label: "Email",
      type: "email",
      placeholder: "Enter member's email",
      required: true,
      name: "email",
    },
    {
      label: "Role",
      type: "select",
      name: "role",
      required: true,
      options: [
        { value: "Project-Manager", label: "Project-Manager" },
        { value: "Member", label: "Member" },
        { value: "Lead", label: "Lead" },
        { value: "Viewer", label: "Viewer" },
        { value: "Guest", label: "Guest" },
        { value: "Frontend Developer", label: "Frontend Developer" },
        { value: "Backend Developer", label: "Backend Developer" },
        { value: "Fullstack Developer", label: "Fullstack Developer" },
        { value: "QA Engineer", label: "QA Engineer" },
        { value: "DevOps Engineer", label: "DevOps Engineer" },
        { value: "UI/UX Designer", label: "UI/UX Designer" },
        { value: "Product Manager", label: "Product Manager" },
        { value: "Scrum Master", label: "Scrum Master" },
        { value: "Business Analyst", label: "Business Analyst" },
        { value: "Intern", label: "Intern" },
        { value: "Other", label: "Other" },
      ],
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
