"use client";

import { BarChartComponent } from "@/components/ui/charts/BarChartComponent";
import { Task } from "@/types/task";
import { BookText, Bug, Code, FileQuestion, TrendingUp } from "lucide-react";
import OverviewCard from "../OverviewCard";
import { ChartConfig } from "@/components/ui/chart";

const TASK_TYPE_COLORS = {
  Feature: "#3B82F6", // blue
  Bug: "#EF4444", // red
  Improvement: "#10B981", // green
  Documentation: "#F59E0B", // orange
  Other: "#94A3B8", // slate-400
};

const TYPE_ICONS = {
  Feature: <Code className="w-3.5 h-3.5 text-blue-500" />,
  Bug: <Bug className="w-3.5 h-3.5 text-red-500" />,
  Improvement: <TrendingUp className="w-3.5 h-3.5 text-green-500" />,
  Documentation: <BookText className="w-3.5 h-3.5 text-amber-500" />,
  Other: <FileQuestion className="w-3.5 h-3.5 text-slate-400" />,
};

export const TaskTypes = ({ tasks }: { tasks: Task[] }) => {
  // Process task data to count by type
  const taskTypeData = tasks.reduce((acc, task) => {
    const type = task.type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format for chart
  const chartData = Object.entries(taskTypeData).map(([type, count]) => ({
    type,
    count,
    fill:
      TASK_TYPE_COLORS[type as keyof typeof TASK_TYPE_COLORS] ||
      TASK_TYPE_COLORS.Other,
  }));

  const totalTasks = tasks.length;
  const featureCount = taskTypeData["Feature"] || 0;
  const bugCount = taskTypeData["Bug"] || 0;
  const featurePercentage =
    totalTasks > 0 ? Math.round((featureCount / totalTasks) * 100) : 0;
  const bugPercentage =
    totalTasks > 0 ? Math.round((bugCount / totalTasks) * 100) : 0;

  const chartConfig = {
    count: {
      label: "Tasks",
    },
    Feature: {
      label: "Feature",
      color: TASK_TYPE_COLORS.Feature,
    },
    Bug: {
      label: "Bug",
      color: TASK_TYPE_COLORS.Bug,
    },
    Improvement: {
      label: "Improvement",
      color: TASK_TYPE_COLORS.Improvement,
    },
    Documentation: {
      label: "Documentation",
      color: TASK_TYPE_COLORS.Documentation,
    },
    Other: {
      label: "Other",
      color: TASK_TYPE_COLORS.Other,
    },
  } satisfies ChartConfig;

  return (
    <OverviewCard
      title="Task Types"
      description={`${totalTasks} tasks across ${chartData.length} categories`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart Section - 60% width */}
        <div className="lg:w-3/5 h-[220px]">
          <BarChartComponent
            data={chartData}
            config={chartConfig}
            xAxisKey="count"
            yAxisKey="type"
            barDataKey="count"
            layout="vertical"
          />
        </div>

        {/* Stats Section - 40% width */}
        <div className="lg:w-2/5 space-y-4">
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.type} className="flex items-center text-sm">
                <span className="mr-2">
                  {TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] ||
                    TYPE_ICONS.Other}
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300 w-24 truncate">
                  {item.type}
                </span>
                <div className="flex-1 mx-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.count / totalTasks) * 100}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {item.count} ({Math.round((item.count / totalTasks) * 100)}%)
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                Features
              </p>
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                {featurePercentage}%
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                Bugs
              </p>
              <p className="text-lg font-semibold text-red-800 dark:text-red-200">
                {bugPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
};
