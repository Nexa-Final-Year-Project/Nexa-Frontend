// stores/activityLogStore.ts
import { create } from "zustand";
import type { ActivityLog } from "@/types/activityLogs"; // Adjust import path as needed

type ActivityLogState = {
  activityLogs: ActivityLog[];
  setActivityLogs: (activityLogs: ActivityLog[]) => void;
  addActivityLog: (activityLog: ActivityLog) => void;
  removeActivityLog: (id: string) => void;
  updateActivityLog: (id: string, changes: Partial<ActivityLog>) => void;
  getActivityLogById: (id: string) => ActivityLog | undefined;
};
export const useActivityLogStore = create<ActivityLogState>((set, get) => ({
  // Initial empty array of activityLogs
  activityLogs: [],
  setActivityLogs: (activityLogs) => set({ activityLogs }),
  addActivityLog: (activityLog: ActivityLog) =>
    set((state) => ({
      activityLogs: [...state.activityLogs, activityLog],
    })),
  removeActivityLog: (id) =>
    set((state) => ({
      activityLogs: state.activityLogs.filter((p) => p._id !== id),
    })),

  updateActivityLog: (id, changes) =>
    set((state) => ({
      activityLogs: state.activityLogs.map((p) =>
        p._id === id ? { ...p, ...changes } : p
      ),
    })),

  getActivityLogById: (id) => get().activityLogs.find((p) => p._id === id),
}));

export const useActivityLogs = () =>
  useActivityLogStore((state) => state.activityLogs);

export const useActivityLogActions = () =>
  useActivityLogStore((state) => ({
    addActivityLog: state.addActivityLog,
    setActivityLogs: state.setActivityLogs,
    removeActivityLog: state.removeActivityLog,
    updateActivityLog: state.updateActivityLog,
  }));

export const useActivityLog = (id: string) =>
  useActivityLogStore((state) => state.activityLogs.find((p) => p._id === id));
