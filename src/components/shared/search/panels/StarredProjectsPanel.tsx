"use client";

import React from "react";
import DropdownSearchPanel from "../DropdownSearchPanel";
import { useProjects } from "@/hooks/projects/useProjects";
import { useStarredProjectsStore } from "@/store/starredProjects/starredProjectsStore";
import { Project } from "@/types/project";
import { Star, FolderKanban, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth/authStore";
import { motion, AnimatePresence } from "framer-motion";

const StarredProjectsPanel = ({ trigger }: { trigger: React.ReactNode }) => {
  const { projects } = useProjects();
  const { starredProjectIds, toggleStar } = useStarredProjectsStore();
  const { user } = useAuthStore();

  // Normalize projects to array
  const projectList: Project[] = Array.isArray(projects)
    ? projects
    : projects && Array.isArray((projects as any).projects)
    ? (projects as any).projects
    : projects && Array.isArray((projects as any).data)
    ? (projects as any).data
    : [];

  // Get starred projects
  const starredProjects = projectList.filter((p) =>
    starredProjectIds.includes(p._id)
  );

  const handleUnstar = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(projectId);
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
          {/* Header */}
          <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
            <span className="text-sm font-medium text-white">Starred Projects</span>
            <span className="ml-auto text-xs text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-full">
              {starredProjects.length}
            </span>
          </div>

          {/* Project List */}
          <div className="p-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {starredProjects.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-amber-400/40" />
                </div>
                <p className="text-sm text-white/50 mb-1">No starred projects</p>
                <p className="text-xs text-white/30">
                  Click the star on any project to add it here
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {starredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/u/${user?.uid}/p/${project._id}`}
                      className="
                        group flex items-center gap-3 p-2.5 rounded-lg
                        hover:bg-white/[0.04] transition-all duration-200
                      "
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors">
                          {project.name}
                        </p>
                        <p className="text-xs text-white/40 truncate">
                          {project.description || "No description"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleUnstar(e, project._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white/[0.06] transition-all"
                        title="Remove from starred"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {starredProjects.length > 0 && (
            <div className="p-2 border-t border-white/[0.06]">
              <Link
                href={`/u/${user?.uid}`}
                className="
                  flex items-center justify-center gap-2 w-full p-2 rounded-lg
                  text-xs text-white/50 hover:text-white/70
                  hover:bg-white/[0.04] transition-colors
                "
              >
                View all starred
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </motion.div>
      }
    />
  );
};

export default StarredProjectsPanel;
