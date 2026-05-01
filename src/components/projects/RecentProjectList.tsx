import React from "react";
import RecentProjectCard from "./RecentProjectCard";
import { Project } from "@/types/project";
import {
  EllipsisVerticalIcon,
  FolderOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu/dropdown-menu";
import { DropdownMenuContent } from "../ui/dropdown-menu/dropdown-menu";
import { usePathAppender } from "@/hooks/usePathAppender";
import { useTheme } from "next-themes";
import { useModalStore } from "@/store/modal/modalStore";

const RecentProjectList = ({ projects }: { projects: Project[] | any }) => {
  const appendToPath = usePathAppender();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { openModal } = useModalStore();
  const activeProjects = Array.isArray(projects)
    ? projects.filter((project) => project.status !== "Archived")
    : [];

  const handleViewAllProjects = () => {
    appendToPath("/p");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-9 h-9 rounded-xl
            ${
              isDark
                ? "bg-white/[0.05] border border-white/[0.08]"
                : "bg-neutral-100 border border-neutral-200"
            }
            flex items-center justify-center
          `}
          >
            <FolderOpen
              className={
                isDark ? "w-4 h-4 text-white/60" : "w-4 h-4 text-neutral-500"
              }
            />
          </div>
          <div>
            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Recent Projects
            </h2>
            <p
              className={`text-xs ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            >
              Quick access to your latest work
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end flex-wrap">
          {/* View All Button */}
          <Button
            variant="ghost"
            onClick={handleViewAllProjects}
            className={`
              h-10 px-4 rounded-xl w-full sm:w-auto justify-center
              text-sm font-medium
              ${
                isDark
                  ? "text-white/60 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:text-white/80 hover:border-white/[0.1]"
                  : "text-neutral-600 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200/70 hover:text-neutral-800 hover:border-neutral-300"
              }
              transition-all duration-300 cursor-pointer
              group
            `}
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Button>

          {/* Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`
                  h-10 w-10 p-0 rounded-xl cursor-pointer
                  ${
                    isDark
                      ? "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
                      : "bg-neutral-100 border border-neutral-200 hover:bg-neutral-200/70 hover:border-neutral-300"
                  }
                  transition-all duration-300
                `}
              >
                <EllipsisVerticalIcon
                  className={
                    isDark
                      ? "w-4 h-4 text-white/60"
                      : "w-4 h-4 text-neutral-500"
                  }
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`
              ${
                isDark
                  ? "bg-[#0c0c10]/95 border border-white/[0.08]"
                  : "bg-white border border-neutral-200"
              }
              backdrop-blur-xl rounded-xl p-1 min-w-[160px]
              shadow-[0_10px_40px_rgba(0,0,0,0.15)]
            `}
            >
              <DropdownMenuItem
                onClick={() => openModal("project.create")}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  text-sm cursor-pointer
                  ${
                    isDark
                      ? "text-white/70 hover:bg-white/[0.05] hover:text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }
                  transition-all duration-200
                `}
              >
                <Sparkles
                  className={
                    isDark
                      ? "w-4 h-4 text-white/50"
                      : "w-4 h-4 text-neutral-400"
                  }
                />
                Create Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleViewAllProjects}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  text-sm cursor-pointer
                  ${
                    isDark
                      ? "text-white/70 hover:bg-white/[0.05] hover:text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }
                  transition-all duration-200
                `}
              >
                <FolderOpen
                  className={
                    isDark
                      ? "w-4 h-4 text-white/50"
                      : "w-4 h-4 text-neutral-400"
                  }
                />
                View All Projects
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.isArray(activeProjects)
          ? activeProjects
              .slice(0, 4)
              .map((project, index) => (
                <RecentProjectCard
                  key={project?._id || project?.id || `project-${index}`}
                  project={project}
                  members={project?.members || []}
                />
              ))
          : null}
      </div>
    </div>
  );
};

export default RecentProjectList;
