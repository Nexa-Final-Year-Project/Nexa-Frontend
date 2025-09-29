// stores/projectStore.ts
import { create } from "zustand";
import type { Task } from "@/types/task"; // Adjust import path as needed

type TaskState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  getTaskById: (id: string) => Task | undefined;
};
export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial empty array of tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((p) => p._id !== id),
    })),

  updateTask: (id, changes) =>
    set((state) => ({
      tasks: state.tasks.map((p) => (p._id === id ? { ...p, ...changes } : p)),
    })),

  getTaskById: (id) => get().tasks.find((p) => p._id === id),
}));

export const useTasks = () => useTaskStore((state) => state.tasks);

export const useTaskActions = () =>
  useTaskStore((state) => ({
    addTask: state.addTask,
    setTasks: state.setTasks,
    removeTask: state.removeTask,
    updateTask: state.updateTask,
  }));

export const useTask = (id: string) =>
  useTaskStore((state) => state.tasks.find((p) => p._id === id));
