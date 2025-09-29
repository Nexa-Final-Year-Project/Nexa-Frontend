import React, { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { LucideLayoutDashboard, LucideStar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  useEffect(() => {
    setFilteredProjects(
      projects.filter((project) => (showStarred ? project.starred : true))
    );
  }, [projects, showStarred]);
  const path = usePathname();
  const currentPath = path.split("/").pop();
  return (
    <div className="flex flex-col gap-4">
      {filteredProjects
        .slice(0, showAll ? projects.length : 4)
        .map((project) => (
          <Link
            href={`${currentPath}/p/${project._id}`}
            key={project._id}
            className="flex gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
          >
            {showStarred && (
              <LucideStar
                className="w-4 h-4 mt-1.5"
                color="yellow"
                fill="yellow"
              />
            )}
            {!showStarred && (
              <LucideLayoutDashboard
                className="w-4 h-4 mt-1.5"
                color="gray"
                fill="gray"
              />
            )}
            <div className="flex flex-col items-start">
              <h3>{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                {project.description.slice(0, 50)}...
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default DashboardProjectList;
