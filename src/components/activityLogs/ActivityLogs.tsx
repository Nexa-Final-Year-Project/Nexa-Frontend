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
          <div
            key={i}
            className="flex items-start py-3 px-4 animate-pulse bg-neutral-100 dark:bg-white/[0.02] rounded-xl border border-neutral-200 dark:border-white/[0.04]"
          >
            <div className="h-10 w-10 rounded-xl bg-neutral-200 dark:bg-white/[0.05] mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-neutral-200 dark:bg-white/[0.05] rounded-lg w-3/4 mb-2"></div>
              <div className="h-3 bg-neutral-200 dark:bg-white/[0.05] rounded-lg w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (error && !logs)
    return (
      <div
        className="
        flex items-center gap-3
        text-rose-400 text-sm p-4
        bg-rose-500/10 border border-rose-500/20
        rounded-xl
      "
      >
        <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <Trash2 className="w-4 h-4" />
        </div>
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
              className="
                relative overflow-hidden
                border-b border-neutral-200 dark:border-white/[0.04] pb-3
                last:border-b-0
                group/log
              "
            >
              <div className="flex items-start">
                {/* Action Icon */}
                <div
                  className={`
                  p-2.5 rounded-xl mr-4 mt-0.5
                  ${actionColor}
                  border border-neutral-200 dark:border-white/[0.06]
                  transition-transform duration-300
                  group-hover/log:scale-105
                `}
                >
                  {actionIcon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-wrap">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white/90 mr-1.5">
                        {actionText}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-white/50 mr-1.5">
                        {log.entityType.toLowerCase()}
                      </span>
                      {log.task && (
                        <div className="flex items-center ml-1.5">
                          {getEntityIcon("task")}
                          <span className="text-sm text-neutral-600 dark:text-white/60 ml-1">
                            "{log.task.title}"
                          </span>
                        </div>
                      )}
                      {log.project && (
                        <div className="flex items-center ml-1.5">
                          {getEntityIcon("project")}
                          <span className="text-sm text-neutral-600 dark:text-white/60 ml-1">
                            "{log.project.name}"
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleLogExpansion(log._id)}
                      className="
                        text-neutral-400 dark:text-white/30 hover:text-neutral-600 dark:hover:text-white/60
                        ml-2 p-1.5 rounded-lg
                        hover:bg-neutral-100 dark:hover:bg-white/[0.05]
                        transition-all duration-200 cursor-pointer
                      "
                    >
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center text-xs text-neutral-500 dark:text-white/40 mt-1.5">
                    <Clock size={12} className="mr-1.5" />
                    {formatDate(log.timestamp)}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div
                      className="
                      mt-3 p-4 rounded-xl text-xs
                      bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06]
                      text-neutral-600 dark:text-white/70
                    "
                    >
                      <div className="font-medium mb-3 text-sm text-neutral-800 dark:text-white/80">
                        Changes:
                      </div>

                      {changes.length > 0 ? (
                        <div className="space-y-2">
                          {changes.map((change, i) => (
                            <div key={i} className="flex items-center">
                              <span className="font-medium text-neutral-500 dark:text-white/60 capitalize mr-2">
                                {change.field}:
                              </span>
                              <span className="line-through text-rose-500 dark:text-rose-400/70 mr-2">
                                {String(change.oldVal) || "empty"}
                              </span>
                              <span className="text-neutral-400 dark:text-white/30 mx-1">
                                →
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium ml-2">
                                {String(change.newVal) || "empty"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-neutral-500 dark:text-white/40 italic">
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
        <div className="py-8 text-center">
          <div
            className="
            w-12 h-12 rounded-xl
            bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06]
            flex items-center justify-center mx-auto mb-3
          "
          >
            <Calendar className="h-5 w-5 text-neutral-400 dark:text-white/30" />
          </div>
          <p className="text-sm text-neutral-500 dark:text-white/40">
            No activity yet
          </p>
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
        actionIcon: <Plus size={size} className="text-emerald-400" />,
        actionColor: "bg-emerald-500/20",
      };
    case "updated":
      return {
        actionText: "Updated",
        actionIcon: <Edit3 size={size} className="text-violet-400" />,
        actionColor: "bg-violet-500/20",
      };
    case "deleted":
      return {
        actionText: "Deleted",
        actionIcon: <Trash2 size={size} className="text-rose-400" />,
        actionColor: "bg-rose-500/20",
      };
    case "moved":
      return {
        actionText: "Moved",
        actionIcon: <Move size={size} className="text-amber-400" />,
        actionColor: "bg-amber-500/20",
      };
    case "completed":
      return {
        actionText: "Completed",
        actionIcon: <CheckSquare size={size} className="text-cyan-400" />,
        actionColor: "bg-cyan-500/20",
      };
    default:
      return {
        actionText: action,
        actionIcon: <Edit3 size={size} className="text-white/50" />,
        actionColor: "bg-white/[0.05]",
      };
  }
}

function getEntityIcon(entityType: string) {
  const size = 14;

  switch (entityType.toLowerCase()) {
    case "task":
      return <CheckSquare size={size} className="text-violet-400 mr-1" />;
    case "project":
      return <Folder size={size} className="text-emerald-400 mr-1" />;
    case "document":
      return <FileText size={size} className="text-cyan-400 mr-1" />;
    default:
      return <FileText size={size} className="text-white/40 mr-1" />;
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
