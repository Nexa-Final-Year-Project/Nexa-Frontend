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
import { useRouter } from "next/navigation";
import { useAddNotification } from "@/store/notifications/notificationStore";
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
  const addNotification = useAddNotification();
  const router = useRouter();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

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

        // Prepare report link and notification
        const reportId = (response && (response.reportId || response.data?.reportId || response?.reportId)) || null;
        const actionUrl = `${pathname}?tab=task-generation-reports${reportId ? `&open=${reportId}` : ""}`;

        // Persist report locally so the reports page can show it immediately even
        // if the backend reports listing isn't available yet.
        try {
          const existing = JSON.parse(localStorage.getItem("generationReports") || "[]");
          // Avoid duplicating same reportId
          const has = reportId ? existing.some((r: any) => r.reportId === reportId) : false;
          const payloadToSave = {
            ...response,
            displayTitle:
              response?.displayTitle ||
              `Auto Report • ${response?.meta?.backlogSummary?.split('.')?.[0] || projectId} • ${response?.suggestionsCreated || response?.meta?.suggestionsCreated || '?'} suggestions`,
          };
          if (!has) {
            localStorage.setItem("generationReports", JSON.stringify([payloadToSave, ...existing]));
          }
        } catch (e) {
          // noop
        }

        // Add in-app notification so user can access reports later
        try {
          addNotification({
            _id: `genreport-${Date.now()}`,
            title: "Tasks Generated Successfully (Pending Review)",
            message: response?.message || "AI run saved as GenerationReport (pending review by PM)",
            actionUrl,
            senderName: "AI",
            read: false,
            avatarUrl: "",
            type: "info",
          } as any);
        } catch (e) {
          // noop
        }

        // Show toast with one action (View Report).
        toast.success("Tasks Generated Successfully (Pending Review)", {
          action: {
            label: "View Report",
            onClick: () => {
              try {
                if (router && reportId) {
                  router.push(`${actionUrl}`);
                } else if (reportId) {
                  window.location.href = actionUrl;
                } else if (router) {
                  router.push(`${pathname}?tab=task-generation-reports`);
                } else {
                  window.location.href = `${pathname}?tab=task-generation-reports`;
                }
              } catch (e) {
                // noop
              }
            },
          },
          duration: 8000,
        });

        // Immediately navigate to reports tab and open the report if possible
        try {
          if (router && reportId) {
            router.push(`${actionUrl}`);
          } else if (reportId) {
            window.location.href = actionUrl;
          }
        } catch (e) {
          // noop
        }

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
