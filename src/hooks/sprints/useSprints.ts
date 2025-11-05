// hooks/useSprints.ts
import { useCallback, useState } from "react";
import {
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useLazyGetSprintByProjectIdQuery,
  useDeleteSprintMutation,
  usePlanSprintsByAIMutation,
} from "@/api/sprint/sprintApi";
import { useSprintStore } from "@/store/sprints/sprintStore";
import type { Sprint } from "@/types/sprint";
import toast from "@/lib/customToast";

type SprintStatus = "Backlog" | "In Progress" | "Blocked" | "Done";

export const useSprints = (projectId?: string) => {
  const [createSprintApi] = useCreateSprintMutation();
  const [generateSprintsByAIApi] = usePlanSprintsByAIMutation();
  const [updateSprintApi] = useUpdateSprintMutation();
  const [deleteSprintApi] = useDeleteSprintMutation();
  const [fetchSprintsByProject] = useLazyGetSprintByProjectIdQuery();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { sprints, setSprints, addSprint, removeSprint, updateSprint } =
    useSprintStore();

  const fetchSprints = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await fetchSprintsByProject(projectId).unwrap();
      console.log("Fetched sprints:", data);
      setSprints(data?.sprints || []);
      return data;
    } catch (error) {
      console.error("Failed to fetch sprints:", error);
      throw error;
    }
  }, [projectId, fetchSprintsByProject, setSprints]);

  const createSprint = useCallback(
    async (sprintData: Omit<Sprint, "_id">) => {
      setLoading(true);
      setError(null);

      const tempId = `temp-${Date.now()}`;
      const optimisticSprint: Sprint = { ...sprintData, _id: tempId };
      addSprint(optimisticSprint);

      try {
        const response = await createSprintApi(sprintData).unwrap();
        updateSprint(tempId, { _id: response._id });
        toast.success("Sprint created successfully");
        return response;
      } catch (err) {
        removeSprint(tempId);
        setError(err);
        toast.error("Failed to create sprint");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createSprintApi, addSprint, updateSprint, removeSprint]
  );

  // Generate sprints using AI for a given projectId
  const generateSprints = useCallback(
    async (projectId: string) => {
      setLoading(true);
      setError(null);

      try {
        // API expects projectId in the URL — pass the id string directly
        const response = await generateSprintsByAIApi(projectId).unwrap();
        // Refresh sprints after generation
        await fetchSprints();
        toast.success("Sprints generated successfully");

        return response;
      } catch (err) {
        toast.error("Failed to generate sprints");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [generateSprintsByAIApi, fetchSprints]
  );

  // Update an existing sprint
  const updateSprintById = useCallback(
    async (sprintId: string, changes: Partial<Sprint>) => {
      try {
        const currentSprint = sprints.find((t) => t._id === sprintId);
        if (!currentSprint) throw new Error("Sprint not found");

        const updatedSprint = { ...currentSprint, ...changes };
        await updateSprintApi({ id: sprintId, ...updatedSprint }).unwrap();
        updateSprint(sprintId, changes);
        return updatedSprint;
      } catch (error) {
        console.error("Failed to update sprint:", error);
        throw error;
      }
    },
    [sprints, updateSprintApi, updateSprint]
  );

  // Delete a sprint
  const deleteSprint = useCallback(
    async (sprintId: string) => {
      try {
        await deleteSprintApi(sprintId).unwrap();
        removeSprint(sprintId);
      } catch (error) {
        console.error("Failed to delete sprint:", error);
        throw error;
      }
    },
    [removeSprint]
  );

  const moveSprint = useCallback(
    async (sprintId: string, newStatus: SprintStatus) => {
      return updateSprintById(sprintId, { status: newStatus });
    },
    [updateSprintById]
  );

  return {
    sprints,
    fetchSprints,
    createSprint,
    generateSprints,
    updateSprint: updateSprintById,
    deleteSprint,
    moveSprint,
    isLoading: false, // You might want to track loading state
    error: null, // And error state
  };
};
