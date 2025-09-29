"use client";

import React, { useMemo } from "react";
import TasksChart from "./charts/TasksChart";
import PriorityChart from "./charts/PriorityChart";
import { Task } from "@/types/task";
import { TaskTypes } from "./charts/TaskTypes";
import { TopStatCard } from "./cards/TopStatsCard";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  ListTodo,
  Star,
  Sparkle,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { useTasks } from "@/hooks/tasks/useTasks";
import TaskGeneratorModal from "@/components/shared/models/TaskGeneratorModal";

const Overview = ({
  tasks,
  projectId,
}: {
  tasks: Task[];
  projectId: string;
}) => {
  // Memoize to avoid recalculating on every render
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "High").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;

    return [
      {
        title: "Total Tasks",
        value: totalTasks,
        trend: 8,
        icon: <ListTodo />,
        color: "text-blue-600",
        chartData: tasks.slice(-6).map((_, idx) => ({ value: idx + 1 })),
      },
      {
        title: "Completed Tasks",
        value: completedTasks,
        trend: 12,
        icon: <CheckCircle />,
        color: "text-green-600",
        chartData: tasks
          .filter((t) => t.status === "Done")
          .slice(-6)
          .map((_, idx) => ({ value: idx + 1 })),
      },
      {
        title: "High Priority",
        value: highPriorityTasks,
        trend: -5,
        icon: <AlertTriangle />,
        color: "text-red-600",
        chartData: tasks
          .filter((t) => t.priority === "High")
          .slice(-6)
          .map((_, idx) => ({ value: idx + 1 })),
      },
      {
        title: "In Progress",
        value: inProgressTasks,
        trend: 3,
        icon: <TrendingUp />,
        color: "text-yellow-600",
        chartData: tasks
          .filter((t) => t.status === "In Progress")
          .slice(-6)
          .map((_, idx) => ({ value: idx + 1 })),
      },
    ];
  }, [tasks]);

  const { generateTasks } = useTasks();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className=" flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Overview</h1>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center !text-sm !p-2"
          onClick={() => setOpen(true)}
        >
          <Sparkle className="w-4 h-4 mr-2" />
          Generate Tasks
        </Button>
      </div>

      {/* Overview Card */}
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <TopStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="flex lg:flex-row flex-col gap-4 py-4">
        <div className="w-full lg:w-1/2">
          <TasksChart tasks={tasks} />
        </div>
        <div className="w-full lg:w-1/2">
          <PriorityChart tasks={tasks} />
        </div>
      </div>

      {/* Task Types */}
      <div className="w-full lg:w-1/2">
        <TaskTypes tasks={tasks} />
      </div>
      <TaskGeneratorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        handleSubmit={(data) => generateTasks(data.description, projectId)}
      />
    </div>
  );
};

export default Overview;
