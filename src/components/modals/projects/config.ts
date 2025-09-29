// modals/projects/configs.ts
import { PROJECT_FIELDS } from "@/lib/constants/projectsConstants";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/api/project/projectApi";
import ArchiveProjectsModal from "@/components/user/settings/user-settings/data-controls/ArchiveProjectsModal";
import { ProjectDangerZoneModal } from "@/components/projects/ProjectDangerZone";

export function useProjectConfigs(close: () => void) {
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  return {
    "project.create": {
      title: "Create Project",
      formFields: PROJECT_FIELDS,
      submitButtonText: "Create",
      onSubmit: async (values: any) => {
        await createProject(values);
        close();
      },
    },
    "project.edit": (project: any) => ({
      title: "Edit Project",
      formFields: PROJECT_FIELDS,
      initialValues: project,
      submitButtonText: "Save",
      onSubmit: async (values: any) => {
        await updateProject({ id: project._id, ...values });
        close();
      },
    }),
    "project.delete": (project: any) => ({
      component: ProjectDangerZoneModal,
      props: {
        project,
        projectName: project.name,
        onDelete: async () => {
          await deleteProject(project._id);
          close();
        },
        open: true,
        onOpenChange: close, // ✅ pass the function itself
      },
    }),

    "project.archive": (archivedProjects: any[]) => ({
      component: ArchiveProjectsModal, // directly pass the component
      props: {
        archivedProjects,
        onRestore: (id: string) => console.log("Restore", id),
        onDelete: (id: string) => console.log("Delete", id),
      },
    }),
  };
}
