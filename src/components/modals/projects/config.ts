// modals/projects/configs.ts
import { PROJECT_FIELDS } from "@/lib/constants/projectsConstants";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/api/project/projectApi";
import ArchiveProjectsModal from "@/components/user/settings/user-settings/data-controls/ArchiveProjectsModal";
import { ProjectDangerZoneModal } from "@/components/projects/ProjectDangerZone";
import { InviteMemberModal } from "@/components/project-settings/team/InviteMemberModal";

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
    "project.archive": (project: any) => ({
      title: "Archive Project",
      description: `Move ${project.name} to archived projects? It will disappear from active lists until restored.`,
      submitButtonText: "Archive Project",
      onSubmit: async () => {
        await updateProject({ id: project._id, status: "Archived" } as any);
        close();
      },
    }),
    "project.archived-list": (archivedProjects: any) => ({
      component: ArchiveProjectsModal,
      props: {
        archivedProjects,
        onRestore: async (id: string) => {
          await updateProject({ id, status: "Active" } as any);
          close();
        },
        onDelete: async (id: string) => {
          await deleteProject(id as any);
          close();
        },
        isOpen: true,
        onOpenChange: close,
      },
    }),
    "project.invite": (project: any) => ({
      component: InviteMemberModal,
      props: {
        projectId: project._id,
        projectName: project.name,
        isOpen: true,
        onOpenChange: close,
      },
    }),
  };
}
