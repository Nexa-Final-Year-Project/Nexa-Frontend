import TasksList from "@/components/tasks/TasksList";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useAuthStore } from "@/store/auth/authStore";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const AssignedTasks = () => {
  const { tasks, fetchUserTasks } = useTasks();
  const { user } = useAuthStore();
  useEffect(() => {
    fetchUserTasks(user?.id || "");
  }, [fetchUserTasks]);
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Link href="/projects" className="hover:text-primary">
          <SquareArrowOutUpRight className="w-4 h-4" />
        </Link>
      </div>
      <TasksList tasks={tasks} />
    </div>
  );
};

export default AssignedTasks;
