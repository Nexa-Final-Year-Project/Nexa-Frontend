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
    async (projectId: string, memberEmail: string) => {
      try {
        await sendInvite({ projectId, memberEmail }).unwrap();
        toast.success("Invitation sent successfully");
      } catch (error) {
        console.error("Failed to send invitation:", error);
        toast.error("Failed to send invitation");
        throw error;
      }
    },
    [sendInvite]
  );

  const acceptProjectInvite = useCallback(
    async (token: string) => {
      try {
        const { data } = await acceptInvite({ token }).unwrap();
        addProject(data);
        toast.success("Invitation accepted successfully");
        return data;
      } catch (error) {
        console.error("Failed to accept invitation:", error);
        toast.error("Failed to accept invitation");
        throw error;
      }
    },
    [acceptInvite, addProject]
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
