import TasksList from "@/components/tasks/TasksList";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useAuthStore } from "@/store/auth/authStore";
import {
  SquareArrowOutUpRight,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const AssignedTasks = () => {
  const { tasks, fetchUserTasks } = useTasks();
  const { user } = useAuthStore();
  useEffect(() => {
    fetchUserTasks(user?.id || "");
  }, [fetchUserTasks]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="
            w-10 h-10 rounded-xl
            bg-gradient-to-br from-cyan-500/20 to-blue-500/20
            border border-cyan-500/30
            flex items-center justify-center
          "
          >
            <ClipboardList className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Assigned Tasks
            </h2>
            <p className="text-xs text-neutral-500 dark:text-white/40">
              Tasks assigned to you across projects
            </p>
          </div>
        </div>
        <Link
          href="/projects"
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            text-sm font-medium text-neutral-600 dark:text-white/60
            bg-neutral-100 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06]
            hover:bg-neutral-200/70 dark:hover:bg-white/[0.05] hover:text-neutral-800 dark:hover:text-white/80 hover:border-neutral-300 dark:hover:border-white/[0.1]
            transition-all duration-300 cursor-pointer
            group
          "
        >
          View All
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>
      <TasksList tasks={tasks} />
    </div>
  );
};

export default AssignedTasks;
