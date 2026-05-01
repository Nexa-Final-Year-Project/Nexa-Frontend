import React, { useMemo } from "react";
import { Project } from "@/types/project";
import { LucideLayoutDashboard, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStarredProjectsStore } from "@/store/starredProjects/starredProjectsStore";
import { cn } from "@/lib/utils";

const DashboardProjectList = ({
  projects,
  showAll = false,
  showStarred = false,
}: {
  projects: Project[];
  showAll?: boolean;
  showStarred?: boolean;
}) => {
  const { starredProjectIds, toggleStar, isStarred } =
    useStarredProjectsStore();

  // Normalize incoming projects to an array to avoid runtime errors when backend
  // or store returns an object shape.
  const projectList: Project[] = Array.isArray(projects)
    ? projects
    : projects && Array.isArray((projects as any).projects)
      ? (projects as any).projects
      : projects && Array.isArray((projects as any).data)
        ? (projects as any).data
        : [];
  const activeProjectList = useMemo(
    () => projectList.filter((project) => project.status !== "Archived"),
    [projectList],
  );

  const filteredProjects = useMemo(() => {
    if (showStarred) {
      return activeProjectList.filter((project) =>
        starredProjectIds.includes(project._id),
      );
    }

    return activeProjectList;
  }, [activeProjectList, showStarred, starredProjectIds]);

  const path = usePathname();
  const currentPath = path.split("/").pop();

  const handleStarClick = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(projectId);
  };

  if (filteredProjects.length === 0 && showStarred) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900/30 border border-neutral-200 dark:border-white/[0.04]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-amber-500/50 dark:text-amber-400/50" />
        </div>
        <h3 className="text-lg font-medium text-neutral-700 dark:text-white/70 mb-2">
          No Starred Projects
        </h3>
        <p className="text-sm text-neutral-500 dark:text-white/40 text-center max-w-sm">
          Star your favorite projects by clicking the star icon on any project
          card to quickly access them here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {filteredProjects
      .slice(0, showAll ? activeProjectList.length : 4)
        .map((project) => {
          const starred = isStarred(project._id);

          return (
            <Link
              href={`${currentPath}/p/${project._id}`}
              key={project._id}
              className="
                group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 
                rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/[0.06]
                hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-white/[0.1]
                transition-all duration-200 cursor-pointer shadow-sm dark:shadow-none
              "
            >
              {/* Star Button */}
              <button
                onClick={(e) => handleStarClick(e, project._id)}
                className={cn(
                  "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                  starred
                    ? "bg-amber-500/20 text-amber-500 dark:text-amber-400"
                    : "bg-neutral-100 dark:bg-white/[0.04] text-neutral-400 dark:text-white/30 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10",
                )}
              >
                <Star
                  className="w-4 h-4"
                  fill={starred ? "currentColor" : "none"}
                />
              </button>

              {/* Project Icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <LucideLayoutDashboard className="w-5 h-5 text-violet-500 dark:text-violet-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 w-full">
                <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-neutral-800 dark:group-hover:text-white/90 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-white/40 truncate">
                  {String(project.description || "No description").slice(0, 60)}
                  {String(project.description || "").length > 60 ? "..." : ""}
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default DashboardProjectList;
