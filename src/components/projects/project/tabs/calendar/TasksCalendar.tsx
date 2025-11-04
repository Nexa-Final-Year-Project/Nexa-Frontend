"use client";
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

// Types
interface Task {
  _id: string;
  title: string;
  description?: string;
  type: string;
  status: "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";
  project: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string; // ISO string
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

// Status colors mapping
const STATUS_COLORS = {
  Backlog: "#6B7280",
  Todo: "#3B82F6",
  "In Progress": "#F59E0B",
  Done: "#10B981",
  Cancelled: "#EF4444",
};

const PRIORITY_COLORS = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#EF4444",
  Urgent: "#8B1A1A",
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
    color: STATUS_COLORS[task.status] || "#6B7280",
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
  const formattedTasks = tasks.map(formatTaskForCalendar);
  const { earliestYear: calculatedEarliest, latestYear: calculatedLatest } =
    getYearRange(tasks);
  const earliestYear = propEarliestYear ?? calculatedEarliest;
  const latestYear = propLatestYear ?? calculatedLatest;

  // Debugging
  useEffect(() => {
    console.log("Formatted tasks for calendar:", formattedTasks);
  }, [formattedTasks]);

  return (
    <div className="tasks-calendar-container h-full">
      <CalendarProvider initialMonth={defaultMonth} initialYear={defaultYear}>
        <CalendarDate>
          <CalendarDatePicker>
            <CalendarMonthPicker className="justify-center" />
            <CalendarYearPicker
              className="justify-center"
              end={latestYear}
              start={earliestYear}
            />
          </CalendarDatePicker>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={formattedTasks}>
          {({ feature }) => (
            <CalendarItem
              feature={feature}
              key={feature.id}
              style={{
                backgroundColor: feature.status.color,
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.875rem",
                borderLeft: `4px solid ${feature.priority.color}`,
              }}
              title={`${feature.name}\nStatus: ${feature.status.name}\nPriority: ${feature.priority.name}`}
            />
          )}
        </CalendarBody>
      </CalendarProvider>
    </div>
  );
};

export default TasksCalendar;
