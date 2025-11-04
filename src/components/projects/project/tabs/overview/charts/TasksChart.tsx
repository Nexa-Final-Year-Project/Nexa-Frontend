"use client";

import { TrendingUp } from "lucide-react";
import { DonutPieChart } from "@/components/ui/charts/DonutPieChart";
import { ChartConfig } from "@/components/ui/chart";
import OverviewCard from "../OverviewCard";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";

const STATUS_COLORS = {
  Backlog: "#6B7280", // gray
  "In Progress": "#F59E0B", // orange
  Done: "#10B981", // green
  Blocked: "#EF4444", // red
};

const taskStatusConfig = {
  value: {
    label: "Tasks",
  },
  Backlog: {
    label: "Backlog",
    color: STATUS_COLORS.Backlog,
  },
  "In Progress": {
    label: "In Progress",
    color: STATUS_COLORS["In Progress"],
  },
  Done: {
    label: "Done",
    color: STATUS_COLORS.Done,
  },
  Blocked: {
    label: "Blocked",
    color: STATUS_COLORS.Blocked,
  },
} satisfies ChartConfig;

export default function TasksChart({ tasks }: { tasks: Task[] }) {
  const [taskStatusData, setTaskStatusData] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);

  useEffect(() => {
    // Calculate task counts by status
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transform to chart data format
    const chartData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6B7280",
    }));

    setTaskStatusData(chartData);
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedPercentage =
    tasks.length > 0
      ? Math.round(
          ((taskStatusData.find((d) => d.name === "Done")?.value || 0) /
            totalTasks) *
            100
        )
      : 0;

  return (
    <OverviewCard
      title="Task Status Overview"
      description={`${totalTasks} total tasks`}
    >
      <div className="flex flex-col lg:flex-row  items-center gap-4">
        <div className="lg:w-[70%] w-full">
          <DonutPieChart
            title="Task Status Distribution"
            description={`Current status of ${totalTasks} tasks`}
            data={taskStatusData}
            config={taskStatusConfig}
            totalLabel="Total Tasks"
            totalValue={totalTasks}
            footerText={`${completedPercentage}% of tasks completed`}
          />
        </div>

        <div className="w-1/2 space-y-4">
          {taskStatusData.map((status) => (
            <div key={status.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: status.fill }}
              />
              <span className="text-sm font-medium dark:text-gray-300">
                {status.name}:
              </span>
              <span className="ml-auto font-semibold dark:text-white">
                {status.value} ({Math.round((status.value / totalTasks) * 100)}
                %)
              </span>
            </div>
          ))}

          {totalTasks > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  {completedPercentage}% completion rate
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </OverviewCard>
  );
}
