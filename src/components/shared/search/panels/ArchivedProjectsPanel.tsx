"use client";

import React from "react";
import DropdownSearchPanel from "../DropdownSearchPanel";
import { useProjects } from "@/hooks/projects/useProjects";
import { Project } from "@/types/project";
import { Archive, FolderKanban, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth/authStore";
import { motion } from "framer-motion";

const ArchivedProjectsPanel = ({ trigger }: { trigger: React.ReactNode }) => {
  const { projects, updateProject } = useProjects();
  const { user } = useAuthStore();

  const projectList: Project[] = Array.isArray(projects)
    ? projects
    : projects && Array.isArray((projects as any).projects)
      ? (projects as any).projects
      : projects && Array.isArray((projects as any).data)
        ? (projects as any).data
        : [];

  const archivedProjects = projectList.filter(
    (project) => project.status === "Archived",
  );

  const handleRestore = async (projectId: string) => {
    await updateProject(projectId, { status: "Active" } as any);
  };

  return (
    <DropdownSearchPanel
      trigger={trigger}
      position={{ side: "right", align: "start" }}
      content={
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-72"
        >
          <div className="p-3 border-b border-neutral-200 dark:border-white/[0.06] flex items-center gap-2">
            <Archive className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Archived Projects
            </span>
            <span className="ml-auto text-xs text-neutral-500 dark:text-white/40 bg-neutral-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-full">
              {archivedProjects.length}
            </span>
          </div>

          <div className="p-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {archivedProjects.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                  <Archive className="w-6 h-6 text-orange-500/50" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-white/50 mb-1">
                  No archived projects
                </p>
                <p className="text-xs text-neutral-400 dark:text-white/30">
                  Archived projects will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {archivedProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <Link
                      href={`/u/${user?.uid}/p/${project._id}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-white/40 truncate">
                          {project.description || "No description"}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRestore(project._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-white/[0.06] transition-all"
                      title="Restore project"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      }
    />
  );
};

export default ArchivedProjectsPanel;
