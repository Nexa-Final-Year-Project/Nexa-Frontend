// hooks/useTasks.ts
import { useCallback, useState } from "react";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useLazyGetTaskByProjectIdQuery,
  useDeleteTaskMutation,
  useGenerateTasksByAIMutation,
  useLazyGetTasksByUserIdQuery,
  useAssignTaskMutation,
} from "@/api/task/taskApi";
import { useTaskStore } from "@/store/tasks/taskStore";
import type { Task } from "@/types/task";
import toast from "@/lib/customToast";

type TaskStatus = "Backlog" | "In Progress" | "Blocked" | "Done";

export const useTasks = (projectId?: string) => {
  const [createTaskApi] = useCreateTaskMutation();
  const [generateTasksByAIApi] = useGenerateTasksByAIMutation();
  const [updateTaskApi] = useUpdateTaskMutation();
  const [deleteTaskApi] = useDeleteTaskMutation();
  const [fetchTasksByProject] = useLazyGetTaskByProjectIdQuery();
  const [fetchTasksByUser] = useLazyGetTasksByUserIdQuery();
  const [assignTaskApi] = useAssignTaskMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { tasks, setTasks, addTask, removeTask, updateTask } = useTaskStore();

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await fetchTasksByProject(projectId).unwrap();
      setTasks(data || []);
      return data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  }, [projectId, fetchTasksByProject, setTasks]);

  const createTask = useCallback(
    async (taskData: Omit<Task, "_id">) => {
      setLoading(true);
      setError(null);

      const tempId = `temp-${Date.now()}`;
      const optimisticTask: Task = { ...taskData, _id: tempId };
      addTask(optimisticTask);

      try {
        const response = await createTaskApi(taskData).unwrap();
        updateTask(tempId, { _id: response._id });
        toast.success("Task created successfully");
        return response;
      } catch (err) {
        removeTask(tempId);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to create task");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createTaskApi, addTask, updateTask, removeTask]
  );

  // Generate tasks using AI
  const generateTasks = useCallback(
    async (
      projectDescription: string,
      projectId: string,
      config?: Record<string, any>,
      teamMembers?: any[]
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await generateTasksByAIApi({
          description: projectDescription,
          projectId,
          config,
          team: teamMembers || [],
        }).unwrap();
        // response.forEach((task: Task) => addTask(task));
        await fetchTasks(); // Refresh tasks after generation
        toast.success("Tasks generated successfully");

        return response;
      } catch (err) {
        toast.error("Failed to generate tasks");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [generateTasksByAIApi, addTask, fetchTasks]
  );

  // Update an existing task
  const updateTaskById = useCallback(
    async (taskId: string, changes: Partial<Task>) => {
      try {
        const currentTask = tasks.find((t) => t._id === taskId);
        if (!currentTask) throw new Error("Task not found");

        const updatedTask = { ...currentTask, ...changes };
        await updateTaskApi({ id: taskId, ...updatedTask }).unwrap();
        updateTask(taskId, changes);
        return updatedTask;
      } catch (error) {
        console.error("Failed to update task:", error);
        throw error;
      }
    },
    [tasks, updateTaskApi, updateTask]
  );

  // Delete a task
  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteTaskApi(taskId).unwrap();
        removeTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
        throw error;
      }
    },
    [removeTask]
  );

  const moveTask = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      return updateTaskById(taskId, { status: newStatus });
    },
    [updateTaskById]
  );

  const fetchUserTasks = useCallback(
    async (userId: string) => {
      try {
        const { data } = await fetchTasksByUser(userId).unwrap();
        setTasks(data || []);
        return data;
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        throw error;
      }
    },
    [fetchTasksByUser, setTasks]
  );

  const assignTask = useCallback(
    async (userId: string, taskId: string) => {
      try {
        await assignTaskApi({ userId, taskId }).unwrap();
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        throw error;
      }
    },
    [assignTaskApi, setTasks]
  );

  return {
    tasks,
    fetchTasks,
    createTask,
    generateTasks,
    updateTask: updateTaskById,
    deleteTask,
    moveTask,
    fetchUserTasks,
    assignTask,
    isLoading: false, // You might want to track loading state
    error: null, // And error state
  };
};
