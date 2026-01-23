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
  Sparkles,
  BarChart3,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { useTasks } from "@/hooks/tasks/useTasks";
import TaskGeneratorModal from "@/components/shared/models/TaskGeneratorModal";
import { useTheme } from "next-themes";
import { Project } from "@/types/project";

const Overview = ({
  tasks,
  projectId,
  project,
  members,
}: {
  tasks: Task[];
  projectId: string;
  project?: Project | null;
  members?: any[];
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // Memoize to avoid recalculating on every render
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "High").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "In Progress",
    ).length;

    return [
      {
        title: "Total Tasks",
        value: totalTasks,
        trend: 8,
        icon: <ListTodo className="w-5 h-5" />,
        color: "violet",
        chartData: tasks.slice(-6).map((_, idx) => ({ value: idx + 1 })),
      },
      {
        title: "Completed Tasks",
        value: completedTasks,
        trend: 12,
        icon: <CheckCircle className="w-5 h-5" />,
        color: "emerald",
        chartData: tasks
          .filter((t) => t.status === "Done")
          .slice(-6)
          .map((_, idx) => ({ value: idx + 1 })),
      },
      {
        title: "High Priority",
        value: highPriorityTasks,
        trend: -5,
        icon: <AlertTriangle className="w-5 h-5" />,
        color: "rose",
        chartData: tasks
          .filter((t) => t.priority === "High")
          .slice(-6)
          .map((_, idx) => ({ value: idx + 1 })),
      },
      {
        title: "In Progress",
        value: inProgressTasks,
        trend: 3,
        icon: <TrendingUp className="w-5 h-5" />,
        color: "amber",
        chartData: tasks
          .filter((t) => t.status === "In Progress")
          .slice(-6)
          .map((_, idx) => ({ value: idx + 1 })),
      },
    ];
  }, [tasks]);

  const { generateTasks } = useTasks();
  const [open, setOpen] = React.useState(false);

  const surfaceCard = isDark
    ? "bg-neutral-900/50 border-white/[0.07]"
    : "bg-white border-neutral-200 shadow-sm";
  const hoverBorder = isDark
    ? "hover:border-white/[0.12]"
    : "hover:border-neutral-300";

  return (
    <div className="relative">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`
            w-12 h-12 rounded-xl
            bg-gradient-to-br border flex items-center justify-center
            ${
              isDark
                ? "from-violet-500/20 to-cyan-500/20 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                : "from-violet-100 to-cyan-100 border-violet-300 shadow-lg"
            }
          `}
          >
            <BarChart3
              className={`w-6 h-6 ${
                isDark ? "text-violet-400" : "text-violet-600"
              }`}
            />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Project Overview
            </h1>
            <p
              className={`text-sm mt-0.5 ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            >
              Analytics and insights for your project
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className={`
            flex items-center gap-2
            px-5 py-2.5 h-auto
            text-sm font-medium
            bg-gradient-to-r border rounded-xl cursor-pointer
            transition-all duration-300
            group w-full sm:w-auto justify-center sm:justify-start
            ${
              isDark
                ? "from-emerald-600/20 to-cyan-600/10 border-emerald-500/30 text-white hover:from-emerald-600/30 hover:to-cyan-600/20 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                : "from-emerald-100 to-cyan-100 border-emerald-300 text-emerald-700 hover:from-emerald-200 hover:to-cyan-200 hover:border-emerald-400 hover:shadow-lg"
            }
          `}
        >
          <Sparkles
            className={`w-4 h-4 group-hover:animate-pulse ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
          Generate Tasks
        </Button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <TopStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <div
          className={`w-full rounded-2xl p-5 backdrop-blur-sm border transition-colors duration-300 ${surfaceCard} ${hoverBorder}`}
        >
          <TasksChart tasks={tasks} />
        </div>
        <div
          className={`w-full rounded-2xl p-5 backdrop-blur-sm border transition-colors duration-300 ${surfaceCard} ${hoverBorder}`}
        >
          <PriorityChart tasks={tasks} />
        </div>
      </div>

      {/* Task Types Section */}
      <div
        className={`w-full rounded-2xl p-5 backdrop-blur-sm border transition-colors duration-300 ${surfaceCard} ${hoverBorder}`}
      >
        <TaskTypes tasks={tasks} />
      </div>

      <TaskGeneratorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        projectName={project?.name}
        projectType="Web App"
        project={project}
        handleSubmit={async (data) => {
          await generateTasks(
            data.description,
            projectId,
            data.config,
            members || [],
          );
        }}
      />
    </div>
  );
};

export default Overview;
