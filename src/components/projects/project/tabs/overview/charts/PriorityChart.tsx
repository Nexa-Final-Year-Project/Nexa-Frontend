"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, TrendingUp } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { BarChartLabel } from "@/components/ui/charts/BarChartLabel";
import OverviewCard from "../OverviewCard";
import { Task } from "@/types/task";
import { BarChartComponent } from "@/components/ui/charts/BarChartComponent";

const PriorityChart = ({ tasks }: { tasks: Task[] }) => {
  const [priorityData, setPriorityData] = useState<
    Array<{ type: string; count: number; fill: string }>
  >([]);

  const PRIORITY_COLORS = {
    Low: "#10B981", // green
    Medium: "#F59E0B", // orange
    High: "#EF4444", // red
  };

  useEffect(() => {
    // Calculate task counts by priority
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log("Priority Counts:", priorityCounts);
    // Transform to chart data format with colors
    const chartData = Object.entries(priorityCounts).map(
      ([priority, count]) => ({
        type: priority,
        count,
        fill:
          PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ||
          "#6B7280",
      })
    );

    // Sort by priority level (High -> Medium -> Low)
    const priorityOrder = ["High", "Medium", "Low"];
    chartData.sort(
      (a, b) => priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type)
    );

    setPriorityData(chartData);
  }, [tasks]);

  const priorityConfig = {
    count: {
      label: "Tasks",
    },
    Low: {
      label: "Low",
      color: PRIORITY_COLORS.Low,
    },
    Medium: {
      label: "Medium",
      color: PRIORITY_COLORS.Medium,
    },
    High: {
      label: "High",
      color: PRIORITY_COLORS.High,
    },
  } satisfies ChartConfig;

  const totalTasks = tasks.length;
  const highPriorityCount =
    priorityData.find((p) => p.type === "High")?.count || 0;
  const highPriorityPercentage =
    totalTasks > 0 ? Math.round((highPriorityCount / totalTasks) * 100) : 0;

  return (
    <OverviewCard
      title="Task Priority Distribution"
      description={`${totalTasks} total tasks`}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="w-full h-52 z-20">
          <BarChartComponent
            data={priorityData}
            config={priorityConfig}
            xAxisKey="type"
            yAxisKey="type"
            barDataKey="count"
            layout="horizontal"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className="space-y-2">
            {priorityData.map((item) => (
              <div key={item.type} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium dark:text-gray-300">
                  {item.type}:
                </span>
                <span className="ml-auto font-semibold dark:text-white">
                  {item.count} ({Math.round((item.count / totalTasks) * 100)}%)
                </span>
              </div>
            ))}
          </div>

          {totalTasks > 0 && (
            <div className="mt-4 pt-4 border-t">
              {highPriorityCount > 0 ? (
                <div className="flex items-center text-red-600 justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    {highPriorityCount} high priority tasks (
                    {highPriorityPercentage}%)
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    No high priority tasks
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Priority classification based on business impact and urgency</p>
      </div>
    </OverviewCard>
  );
};

export default PriorityChart;
