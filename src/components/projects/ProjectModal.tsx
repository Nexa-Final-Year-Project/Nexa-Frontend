import { PROJECT_FIELDS } from "@/lib/constants/projectsConstants";
import { Modal } from "../ui/modal/Modal";
import { useCreateProjectMutation } from "@/api/project/projectApi";

export function ProjectModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [createProject] = useCreateProjectMutation();
  return (
    <Modal
      title="Create Project"
      description="Set up a new project space with name, description, and defaults."
      formFields={PROJECT_FIELDS}
      onSubmit={async (values) => {
        await createProject(values);
      }}
      submitButtonText="Create Project"
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      hideTrigger={true}
    />
  );
}
