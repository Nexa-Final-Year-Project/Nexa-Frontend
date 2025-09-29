// hooks/useActivityLogs.ts
import { useCallback, useState } from "react";
import {
  useLazyGetActivityLogsQuery,
  useLazyGetActivityLogByIdQuery,
  useCreateActivityLogMutation,
  useDeleteActivityLogMutation,
} from "@/api/activityLog/activityLogApi";
import { useActivityLogStore } from "@/store/activityLogs/activityLogStore";
import type { ActivityLog } from "@/types/activityLogs";
import toast from "@/lib/customToast";

export const useActivityLogs = () => {
  const [createActivityLogApi] = useCreateActivityLogMutation();
  const [deleteActivityLogApi] = useDeleteActivityLogMutation();
  const [fetchActivityLogs] = useLazyGetActivityLogsQuery();
  const [fetchActivityLogById] = useLazyGetActivityLogByIdQuery();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    activityLogs,
    setActivityLogs,
    addActivityLog,
    removeActivityLog,
    updateActivityLog,
  } = useActivityLogStore();

  const fetchAllActivityLogs = useCallback(
    async (params: Record<string, any>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchActivityLogs({ params }).unwrap();
        const activityLogsData = response.logs || response;
        setActivityLogs(activityLogsData || []);
        return activityLogsData;
      } catch (error) {
        console.error("Failed to fetch activityLogs:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchActivityLogs, setActivityLogs]
  );

  const getActivityLog = useCallback(
    async (activityLogId: string) => {
      try {
        const { data } = await fetchActivityLogById(activityLogId).unwrap();
        return data;
      } catch (error) {
        console.error("Failed to fetch activityLog:", error);
        throw error;
      }
    },
    [fetchActivityLogById]
  );

  const createActivityLog = useCallback(
    async (activityLogData: Omit<ActivityLog, "_id">) => {
      setLoading(true);
      setError(null);

      const tempId = `temp-${Date.now()}`;
      const optimisticActivityLog: ActivityLog = {
        ...activityLogData,
        _id: tempId,
      };
      addActivityLog(optimisticActivityLog);

      try {
        const response = await createActivityLogApi(activityLogData).unwrap();
        updateActivityLog(tempId, { _id: response._id });
        toast.success("ActivityLog created successfully");
        return response;
      } catch (err) {
        removeActivityLog(tempId);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to create activityLog");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createActivityLogApi, addActivityLog, updateActivityLog, removeActivityLog]
  );

  const deleteActivityLog = useCallback(
    async (activityLogId: string) => {
      try {
        await deleteActivityLogApi(activityLogId).unwrap();
        removeActivityLog(activityLogId);
        toast.success("ActivityLog deleted successfully");
      } catch (error) {
        console.error("Failed to delete activityLog:", error);
        toast.error("Failed to delete activityLog");
        throw error;
      }
    },
    [deleteActivityLogApi, removeActivityLog]
  );

  return {
    activityLogs,
    fetchAllActivityLogs,
    getActivityLog,
    createActivityLog,
    deleteActivityLog,
    isLoading: loading,
    error,
  };
};
