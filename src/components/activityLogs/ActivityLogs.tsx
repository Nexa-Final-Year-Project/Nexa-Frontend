import { useActivityLogs } from "@/hooks/activityLogs/useActivityLogs";
import { useAuthStore } from "@/store/auth/authStore";
import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Eye,
  Plus,
  Edit3,
  Trash2,
  Move,
  CheckSquare,
  FileText,
  Folder,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ActivityLog } from "@/types/activityLogs";

interface ActivityLogsProps {
  logs?: ActivityLog[]; // optional
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  const { activityLogs, fetchAllActivityLogs, isLoading, error } =
    useActivityLogs();
  const { user } = useAuthStore();
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  // only fetch if logs not passed
  useEffect(() => {
    if (!logs) {
      fetchAllActivityLogs(user ? { userId: user.id } : {});
    }
  }, [fetchAllActivityLogs, user, logs]);

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const data = logs || activityLogs;

  const sortedLogs = useMemo(() => {
    return [...data].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [data]);

  if (isLoading && !logs)
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start py-2 animate-pulse">
            <div className="h-5 w-5 rounded bg-gray-200 mr-3 mt-0.5"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (error && !logs)
    return (
      <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
        Error loading activity logs: {error.message}
      </div>
    );

  return (
    <div className="text-left">
      <div className="space-y-2">
        {sortedLogs.map((log) => {
          const isExpanded = expandedLogs[log._id];
          const changes = getChangedFields(log.details);
          const { actionText, actionIcon, actionColor } = getActionDetails(
            log.action
          );
          const entityIcon = getEntityIcon(log.entityType);

          return (
            <div
              key={log._id}
              className="border-b border-gray-100 pb-2 last:border-b-0"
            >
              <div className="flex items-start">
                {/* Action Icon */}
                <div className={`p-1.5 rounded-md mr-3 mt-0.5 ${actionColor}`}>
                  {actionIcon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-wrap">
                      <span className="text-sm font-medium text-gray-900 mr-1.5">
                        {actionText}
                      </span>
                      <span className="text-sm text-gray-700">
                        {log.entityType.toLowerCase()}
                      </span>
                      {log.task && (
                        <div className="flex items-center ml-1.5">
                          {getEntityIcon("task")}
                          <span className="text-sm text-gray-600 ml-1">
                            "{log.task.title}"
                          </span>
                        </div>
                      )}
                      {log.project && (
                        <div className="flex items-center ml-1.5">
                          {getEntityIcon("project")}
                          <span className="text-sm text-gray-600 ml-1">
                            "{log.project.name}"
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleLogExpansion(log._id)}
                      className="text-gray-400 hover:text-gray-600 ml-2 flex items-center text-xs"
                    >
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock size={12} className="mr-1" />
                    {formatDate(log.timestamp)}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium mb-1">Changes:</div>

                      {changes.length > 0 ? (
                        <div className="space-y-1.5">
                          {changes.map((change, i) => (
                            <div key={i} className="flex items-center">
                              <span className="font-medium text-gray-700 capitalize mr-1">
                                {change.field}:
                              </span>
                              <span className="line-through text-red-500 mr-1">
                                {String(change.oldVal) || "empty"}
                              </span>
                              <span className="text-gray-400 mx-1">→</span>
                              <span className="text-green-600 font-medium">
                                {String(change.newVal) || "empty"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">
                          No detailed changes recorded
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedLogs.length === 0 && (
        <div className="py-6 text-center">
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No activity yet</p>
        </div>
      )}
    </div>
  );
};

// Helper functions
function getChangedFields(details: any) {
  if (!details || !details.oldValue || !details.newValue) return [];
  const { oldValue, newValue } = details;
  const changes: { field: string; oldVal: any; newVal: any }[] = [];
  for (const key of Object.keys(newValue)) {
    if (oldValue[key] !== undefined && oldValue[key] !== newValue[key]) {
      changes.push({
        field: key,
        oldVal: oldValue[key],
        newVal: newValue[key],
      });
    }
  }
  return changes;
}

function getActionDetails(action: string) {
  const size = 14;

  switch (action) {
    case "created":
      return {
        actionText: "Created",
        actionIcon: <Plus size={size} className="text-white" />,
        actionColor: "bg-green-500",
      };
    case "updated":
      return {
        actionText: "Updated",
        actionIcon: <Edit3 size={size} className="text-white" />,
        actionColor: "bg-blue-500",
      };
    case "deleted":
      return {
        actionText: "Deleted",
        actionIcon: <Trash2 size={size} className="text-white" />,
        actionColor: "bg-red-500",
      };
    case "moved":
      return {
        actionText: "Moved",
        actionIcon: <Move size={size} className="text-white" />,
        actionColor: "bg-yellow-500",
      };
    case "completed":
      return {
        actionText: "Completed",
        actionIcon: <CheckSquare size={size} className="text-white" />,
        actionColor: "bg-purple-500",
      };
    default:
      return {
        actionText: action,
        actionIcon: <Edit3 size={size} className="text-white" />,
        actionColor: "bg-gray-500",
      };
  }
}

function getEntityIcon(entityType: string) {
  const size = 14;

  switch (entityType.toLowerCase()) {
    case "task":
      return <CheckSquare size={size} className="text-gray-500 mr-1" />;
    case "project":
      return <Folder size={size} className="text-gray-500 mr-1" />;
    case "document":
      return <FileText size={size} className="text-gray-500 mr-1" />;
    default:
      return <FileText size={size} className="text-gray-500 mr-1" />;
  }
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return (
      "Today at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else if (diffDays === 1) {
    return (
      "Yesterday at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else if (diffDays < 7) {
    return (
      date.toLocaleDateString("en-GB", { weekday: "long" }) +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: numericDateDiffers(now, date) ? "numeric" : undefined,
    });
  }
}

function numericDateDiffers(date1: Date, date2: Date) {
  return date1.getFullYear() !== date2.getFullYear();
}

export default ActivityLogs;
