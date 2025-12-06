"use client";
import { useTheme } from "next-themes";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/ui/kibo-ui/calendar";
import { useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Types
interface Task {
  _id: string;
  title: string;
  description?: string;
  type: string;
  status: "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";
  project: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  createdAt: string;
  __v?: number;
}

interface TasksCalendarProps {
  tasks?: Task[];
  earliestYear?: number;
  latestYear?: number;
  defaultMonth?: number;
  defaultYear?: number;
}

// Status colors mapping - dark theme optimized
const STATUS_COLORS = {
  Backlog: { bg: "rgba(107, 114, 128, 0.8)", border: "rgba(107, 114, 128, 1)" },
  Todo: { bg: "rgba(59, 130, 246, 0.8)", border: "rgba(59, 130, 246, 1)" },
  "In Progress": {
    bg: "rgba(245, 158, 11, 0.8)",
    border: "rgba(245, 158, 11, 1)",
  },
  Done: { bg: "rgba(16, 185, 129, 0.8)", border: "rgba(16, 185, 129, 1)" },
  Cancelled: { bg: "rgba(239, 68, 68, 0.6)", border: "rgba(239, 68, 68, 1)" },
};

const PRIORITY_COLORS = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#EF4444",
  Urgent: "#DC2626",
};

// Default tasks for demonstration
const DEFAULT_TASKS: Task[] = [
  {
    _id: "101",
    title: "Implement user authentication",
    type: "Feature",
    status: "In Progress",
    project: "project-1",
    priority: "High",
    dueDate: "2025-08-15T00:00:00.000Z",
    createdAt: "2025-08-01T00:00:00.000Z",
  },
  {
    _id: "102",
    title: "Fix login page UI",
    type: "Bug",
    status: "Todo",
    project: "project-1",
    priority: "Medium",
    dueDate: "2025-08-20T00:00:00.000Z",
    createdAt: "2025-08-05T00:00:00.000Z",
  },
  {
    _id: "103",
    title: "Database optimization",
    type: "Improvement",
    status: "Backlog",
    project: "project-1",
    priority: "Low",
    dueDate: "2025-09-01T00:00:00.000Z",
    createdAt: "2025-08-10T00:00:00.000Z",
  },
];

// Utility functions
const getYearRange = (tasks: Task[]) => {
  if (tasks.length === 0) {
    const currentYear = new Date().getFullYear();
    return { earliestYear: currentYear, latestYear: currentYear };
  }

  const years = tasks.flatMap((task) => [
    new Date(task.dueDate).getFullYear(),
    new Date(task.createdAt).getFullYear(),
  ]);

  return {
    earliestYear: Math.min(...years),
    latestYear: Math.max(...years),
  };
};

const formatTaskForCalendar = (task: Task) => ({
  id: task._id,
  name: task.title,
  startAt: new Date(task.createdAt),
  endAt: new Date(task.dueDate),
  status: {
    id: task.status,
    name: task.status,
    color: STATUS_COLORS[task.status]?.bg || "rgba(107, 114, 128, 0.8)",
    borderColor: STATUS_COLORS[task.status]?.border || "rgba(107, 114, 128, 1)",
  },
  priority: {
    id: task.priority,
    name: task.priority,
    color: PRIORITY_COLORS[task.priority] || "#6B7280",
  },
  originalTask: task,
});

// TasksCalendar Component
const TasksCalendar = ({
  tasks = DEFAULT_TASKS,
  earliestYear: propEarliestYear,
  latestYear: propLatestYear,
  defaultMonth = new Date().getMonth(),
  defaultYear = new Date().getFullYear(),
}: TasksCalendarProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const formattedTasks = tasks.map(formatTaskForCalendar);
  const { earliestYear: calculatedEarliest, latestYear: calculatedLatest } =
    getYearRange(tasks);
  const earliestYear = propEarliestYear ?? calculatedEarliest;
  const latestYear = propLatestYear ?? calculatedLatest;

  return (
    <div className="tasks-calendar-container h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-2xl border backdrop-blur-sm ${
              isDark
                ? "bg-neutral-900/60 border-white/[0.06]"
                : "bg-neutral-100 border-neutral-300"
            }`}
          >
            <CalendarIcon
              className={`w-6 h-6 ${
                isDark ? "text-white/80" : "text-neutral-700"
              }`}
            />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Calendar
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-white/40" : "text-neutral-600"
              }`}
            >
              View your tasks on a timeline
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div
        className={`rounded-2xl border backdrop-blur-sm overflow-hidden ${
          isDark
            ? "bg-neutral-900/40 border-white/[0.06]"
            : "bg-neutral-50 border-neutral-200"
        }`}
      >
        <CalendarProvider initialMonth={defaultMonth} initialYear={defaultYear}>
          {/* Calendar Controls */}
          <div
            className={`p-4 border-b ${
              isDark ? "border-white/[0.06]" : "border-neutral-200"
            }`}
          >
            <CalendarDate>
              <div className="flex items-center justify-between">
                <CalendarDatePicker>
                  <div className="flex items-center gap-3">
                    <CalendarMonthPicker
                      className={`
                        px-4 py-2 rounded-xl 
                        font-medium
                        transition-all duration-200 cursor-pointer
                        [&>button]:bg-transparent [&>button]:border-none
                        [&>button]:font-medium
                        ${
                          isDark
                            ? "bg-white/[0.04] border border-white/[0.06] text-white hover:bg-white/[0.08] hover:border-white/[0.1] [&>button]:text-white"
                            : "bg-neutral-100 border border-neutral-300 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-400 [&>button]:text-neutral-900"
                        }
                      `}
                    />
                    <CalendarYearPicker
                      className={`
                        px-4 py-2 rounded-xl 
                        font-medium
                        transition-all duration-200 cursor-pointer
                        [&>button]:bg-transparent [&>button]:border-none
                        [&>button]:font-medium
                        ${
                          isDark
                            ? "bg-white/[0.04] border border-white/[0.06] text-white hover:bg-white/[0.08] hover:border-white/[0.1] [&>button]:text-white"
                            : "bg-neutral-100 border border-neutral-300 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-400 [&>button]:text-neutral-900"
                        }
                      `}
                      end={latestYear + 1}
                      start={earliestYear}
                    />
                  </div>
                </CalendarDatePicker>
                <CalendarDatePagination
                  className={`
                    [&>button]:w-9 [&>button]:h-9 [&>button]:rounded-lg
                    [&>button]:border [&>button]:transition-all [&>button]:duration-200
                    ${
                      isDark
                        ? "[&>button]:bg-white/[0.04] [&>button]:border-white/[0.06] [&>button]:text-white/60 [&>button:hover]:bg-white/[0.08] [&>button:hover]:text-white"
                        : "[&>button]:bg-neutral-100 [&>button]:border-neutral-300 [&>button]:text-neutral-600 [&>button:hover]:bg-neutral-200 [&>button:hover]:text-neutral-900"
                    }
                  `}
                />
              </div>
            </CalendarDate>
          </div>

          {/* Calendar Header */}
          <CalendarHeader
            className={`
              border-b
              [&>div]:text-xs [&>div]:font-semibold [&>div]:uppercase [&>div]:tracking-wider
              [&>div]:py-3
              ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.06] [&>div]:text-white/40"
                  : "bg-neutral-50 border-neutral-200 [&>div]:text-neutral-600"
              }
            `}
          />

          {/* Calendar Body */}
          <CalendarBody
            features={formattedTasks}
            className={`
              min-h-[500px]
              ${
                isDark
                  ? "[&>div]:border-white/[0.04] [&_td]:border-white/[0.04] [&_th]:border-white/[0.04]"
                  : "[&>div]:border-neutral-200 [&_td]:border-neutral-200 [&_th]:border-neutral-200"
              }
            `}
          >
            {({ feature }) => (
              <CalendarItem
                feature={feature}
                key={feature.id}
                className="
                  group cursor-pointer transition-all duration-200
                  hover:scale-[1.02] hover:shadow-lg hover:z-10
                "
                style={{
                  backgroundColor: feature.status.color,
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderLeft: `3px solid ${feature.priority.color}`,
                  backdropFilter: "blur(4px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
                title={`${feature.name}\nStatus: ${feature.status.name}\nPriority: ${feature.priority.name}`}
              />
            )}
          </CalendarBody>
        </CalendarProvider>

        {/* Legend */}
        <div
          className={`p-4 border-t ${
            isDark
              ? "border-white/[0.06] bg-white/[0.01]"
              : "border-neutral-200 bg-neutral-50/50"
          }`}
        >
          <div className="flex flex-wrap items-center gap-6">
            <span
              className={`text-xs font-medium uppercase tracking-wider ${
                isDark ? "text-white/40" : "text-neutral-600"
              }`}
            >
              Status:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-white/60" : "text-neutral-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-3">
            <span
              className={`text-xs font-medium uppercase tracking-wider ${
                isDark ? "text-white/40" : "text-neutral-600"
              }`}
            >
              Priority:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              {Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
                <div key={priority} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-white/60" : "text-neutral-700"
                    }`}
                  >
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksCalendar;
