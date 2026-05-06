import { Modal } from "@/components/ui/modal/Modal";
import { useProjects } from "@/hooks/projects/useProjects";
import { FormField } from "@/types/form";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [pendingInvite, setPendingInvite] = useState<{
    email: string;
    role: string;
    emailExists?: boolean;
    existingUser?: { _id?: string; name?: string; email?: string } | null;
  } | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleInvite = async (values: { email: string; role?: string }) => {
    const role = values.role || "Member";
    try {
      const response = await sendProjectInvite(projectId, values.email, role, false);

      // If already a member
      if (response?.alreadyMember) {
        onOpenChange(false);
        return;
      }

      // If confirmation is required, show dialog with details
      if (response?.requiresConfirmation) {
        setPendingInvite({
          email: values.email,
          role,
          emailExists: response.emailExists,
          existingUser: response.existingUser || null,
        });
        setIsConfirmDialogOpen(true);
        return false; // signal Modal not to close
      }

      // If successful, close the modal
      if (response?.success || response?.emailSent !== false) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  const handleConfirmSendAnyway = async () => {
    if (!pendingInvite) return;

    try {
      const response = await sendProjectInvite(
        projectId,
        pendingInvite.email,
        pendingInvite.role,
        true
      );

      // If email couldn't be sent but invite link returned, copy to clipboard and notify
      if (response?.emailSent === false && response?.inviteLink) {
        try {
          await navigator.clipboard.writeText(response.inviteLink);
          // show a lightweight inline confirm (toasts handled in hook)
        } catch (e) {
          console.info('Invite link (copy failed):', response.inviteLink);
        }
      }

      setIsConfirmDialogOpen(false);
      setPendingInvite(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send invite:", error);
      setIsConfirmDialogOpen(false);
      setPendingInvite(null);
    }
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
      placeholder: "Choose a role",
      options: [
        { value: "Member", label: "Member" },
        { value: "Project-Manager", label: "Project Manager" },
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
        { value: "Viewer", label: "Viewer" },
        { value: "Guest", label: "Guest" },
        { value: "Other", label: "Other" },
      ],
    },
  ];

  return (
    <>
      <Modal
        title="Invite Member"
        description={
          projectName
            ? `Choose the email and role for the person you want to invite to ${projectName}.`
            : "Enter the email address of the person you want to invite."
        }
        open={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={handleInvite}
        formFields={INVITE_MEMBER_FORM_FIELDS}
        submitButtonText="Send Invite"
        initialValues={{ role: "Member" }}
      />

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Invitation</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <span className="block text-sm">Invite to project: <strong>{projectName}</strong></span>

                <span className="block text-sm">Email: <strong>{pendingInvite?.email}</strong></span>
                <span className="block text-sm">Role: <strong>{pendingInvite?.role}</strong></span>

                {pendingInvite?.emailExists ? (
                  <>
                    <span className="block text-sm">This email is registered on Nexa.</span>
                    {pendingInvite?.existingUser?.name && (
                      <span className="block text-sm">Name: {pendingInvite?.existingUser?.name}</span>
                    )}
                  </>
                ) : (
                  <span className="block text-sm">This email is not registered. The person will receive an invite link and can create an account to accept.</span>
                )}

                <span className="block text-sm">Proceed to send the invitation?</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel className="rounded-xl border border-white/10 bg-transparent text-neutral-300 hover:bg-white/5 hover:text-white">
              No, cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSendAnyway}
              className="rounded-xl bg-white text-neutral-900 hover:bg-neutral-100"
            >
              Yes, send invite
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
