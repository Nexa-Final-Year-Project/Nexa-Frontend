import DashboardProjectList from "@/components/projects/DashboardProjectList";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import {
  LucideArrowRight,
  SquareArrowOutUpRight,
  FolderKanban,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const MyProjects = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              My Projects
            </h2>
            <p className="text-xs text-neutral-500 dark:text-white/40">
              Projects you're actively working on
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
            group w-full sm:w-auto justify-center
          "
        >
          View All
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>
      <DashboardProjectList
        projects={projects}
        showStarred={false}
        showAll={false}
      />
    </div>
  );
};

export default MyProjects;
