import React, { useEffect, useState } from "react";
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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const { starredProjectIds, toggleStar, isStarred } = useStarredProjectsStore();

  // Normalize incoming projects to an array to avoid runtime errors when backend
  // or store returns an object shape.
  const projectList: Project[] = Array.isArray(projects)
    ? projects
    : projects && Array.isArray((projects as any).projects)
    ? (projects as any).projects
    : projects && Array.isArray((projects as any).data)
    ? (projects as any).data
    : [];

  useEffect(() => {
    if (showStarred) {
      setFilteredProjects(
        projectList.filter((project) => starredProjectIds.includes(project._id))
      );
    } else {
      setFilteredProjects(projectList);
    }
  }, [projectList, showStarred, starredProjectIds]);

  const path = usePathname();
  const currentPath = path.split("/").pop();

  const handleStarClick = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(projectId);
  };

  if (filteredProjects.length === 0 && showStarred) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-neutral-900/30 border border-white/[0.04]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-amber-400/50" />
        </div>
        <h3 className="text-lg font-medium text-white/70 mb-2">No Starred Projects</h3>
        <p className="text-sm text-white/40 text-center max-w-sm">
          Star your favorite projects by clicking the star icon on any project card to quickly access them here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredProjects
        .slice(0, showAll ? projectList.length : 4)
        .map((project) => {
          const starred = isStarred(project._id);
          
          return (
            <Link
              href={`${currentPath}/p/${project._id}`}
              key={project._id}
              className="
                group relative flex items-center gap-4 p-4 
                rounded-xl bg-neutral-900/40 border border-white/[0.06]
                hover:bg-neutral-900/60 hover:border-white/[0.1]
                transition-all duration-200 cursor-pointer
              "
            >
              {/* Star Button */}
              <button
                onClick={(e) => handleStarClick(e, project._id)}
                className={cn(
                  "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                  starred 
                    ? "bg-amber-500/20 text-amber-400" 
                    : "bg-white/[0.04] text-white/30 hover:text-amber-400 hover:bg-amber-500/10"
                )}
              >
                <Star 
                  className="w-4 h-4" 
                  fill={starred ? "currentColor" : "none"} 
                />
              </button>

              {/* Project Icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <LucideLayoutDashboard className="w-5 h-5 text-violet-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-white/90 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-white/40 truncate">
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
