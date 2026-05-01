// hooks/useProjects.ts
import { useCallback, useState } from "react";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useLazyGetProjectsQuery,
  useLazyGetProjectByIdQuery,
  useDeleteProjectMutation,
  useInviteMemberMutation,
  useAcceptInviteMutation,
} from "@/api/project/projectApi";
import { useProjectStore } from "@/store/projects/projectStore";
import type { Project } from "@/types/project";
import toast from "@/lib/customToast";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const typedError = error as {
      data?: { message?: string; error?: string };
      message?: string;
      error?: string;
    };

    return (
      typedError.data?.message ||
      typedError.data?.error ||
      typedError.message ||
      typedError.error ||
      "Something went wrong"
    );
  }

  return "Something went wrong";
};

export const useProjects = () => {
  const [createProjectApi] = useCreateProjectMutation();
  const [updateProjectApi] = useUpdateProjectMutation();
  const [deleteProjectApi] = useDeleteProjectMutation();
  const [fetchProjects] = useLazyGetProjectsQuery();
  const [fetchProjectById] = useLazyGetProjectByIdQuery();
  const [sendInvite] = useInviteMemberMutation();
  const [acceptInvite] = useAcceptInviteMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { projects, setProjects, addProject, removeProject, updateProject } =
    useProjectStore();

  const fetchAllProjects = useCallback(async () => {
    try {
      const response = await fetchProjects({}).unwrap();
      console.log("Full API response:", response);
      console.log("Response data:", response.data);
      console.log("Response keys:", Object.keys(response));

      // Check if data exists or if the response IS the data
      const projectsData = response.data || response;
      console.log("Projects data to set:", projectsData);

      setProjects(projectsData || []);
      return projectsData;
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  }, [fetchProjects, setProjects]);

  const getProject = useCallback(
    async (projectId: string) => {
      try {
        const { data } = await fetchProjectById(projectId).unwrap();
        return data;
      } catch (error) {
        console.error("Failed to fetch project:", error);
        throw error;
      }
    },
    [fetchProjectById]
  );

  const createProject = useCallback(
    async (projectData: Omit<Project, "_id">) => {
      setLoading(true);
      setError(null);

      const tempId = `temp-${Date.now()}`;
      const optimisticProject: Project = { ...projectData, _id: tempId };
      addProject(optimisticProject);

      try {
        const response = await createProjectApi(projectData).unwrap();
        updateProject(tempId, { _id: response._id });
        toast.success("Project created successfully");
        return response;
      } catch (err) {
        removeProject(tempId);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to create project");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createProjectApi, addProject, updateProject, removeProject]
  );

  const updateProjectById = useCallback(
    async (projectId: string, changes: Partial<Project>) => {
      try {
        const currentProject = projects.find((p) => p._id === projectId);
        if (!currentProject) throw new Error("Project not found");

        const updatedProject = { ...currentProject, ...changes };
        await updateProjectApi({ id: projectId, ...updatedProject }).unwrap();
        updateProject(projectId, changes);
        toast.success("Project updated successfully");
        return updatedProject;
      } catch (error) {
        console.error("Failed to update project:", error);
        toast.error("Failed to update project");
        throw error;
      }
    },
    [projects, updateProjectApi, updateProject]
  );
  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        await deleteProjectApi(projectId).unwrap();
        removeProject(projectId);
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error("Failed to delete project");
        throw error;
      }
    },
    [deleteProjectApi, removeProject]
  );

  const sendProjectInvite = useCallback(
    async (projectId: string, memberEmail: string, role: string) => {
      try {
        const response = await sendInvite({ projectId, memberEmail, role }).unwrap();

        if (response?.emailSent === false) {
          toast.warning(
            response.warning ||
              response.message ||
              "Invitation created, but email could not be sent."
          );
          if (response.inviteLink) {
            console.info("Invite link:", response.inviteLink);
          }
          return response;
        }

        toast.success("Invitation sent successfully");
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("Failed to send invitation:", message);
        toast.error(message);
        throw new Error(message);
      }
    },
    [sendInvite]
  );

 const acceptProjectInvite = useCallback(
  async (token: string) => {
    try {
      console.log("Accepting invite with token:", token);
      
      // ✅ Pass token directly, not as object
      const response = await acceptInvite(token).unwrap();
      
      console.log("Invite acceptance response:", response);
      
      // Handle response...
      toast.success(response.message || "Invitation accepted successfully");
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to accept invitation:", message);
      toast.error(message);
      throw new Error(message);
    }
  },
  [acceptInvite, addProject, fetchProjectById]
);

  return {
    projects,
    fetchAllProjects,
    getProject,
    createProject,
    updateProject: updateProjectById,
    deleteProject,
    sendProjectInvite,
    acceptProjectInvite,
    isLoading: loading,
    error,
  };
};
