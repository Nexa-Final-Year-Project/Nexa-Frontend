import { Modal } from "@/components/ui/modal/Modal";
import { useProjects } from "@/hooks/projects/useProjects";
import { FormField } from "@/types/form";

export const InviteMemberModal = ({
  projectId,
  projectName,
  isOpen,
  onOpenChange,
}: {
  projectId: string;
  projectName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { sendProjectInvite } = useProjects();

  const handleInvite = async (values: { email: string }) => {
    await sendProjectInvite(projectId, values.email, "Member");
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
      description={
        projectName
          ? `Enter the email address of the person you want to invite to ${projectName}.`
          : "Enter the email address of the person you want to invite."
      }
      open={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleInvite}
      formFields={INVITE_MEMBER_FORM_FIELDS}
      submitButtonText="Send Invite"
    />
  );
};
