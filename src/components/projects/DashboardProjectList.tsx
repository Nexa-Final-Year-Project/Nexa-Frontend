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
    setFilteredProjects(
      projectList.filter((project) => (showStarred ? project.starred : true))
    );
  }, [projectList, showStarred]);
  const path = usePathname();
  const currentPath = path.split("/").pop();
  return (
    <div className="flex flex-col gap-4">
      {filteredProjects
        .slice(0, showAll ? projectList.length : 4)
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
                {String(project.description || "").slice(0, 50)}...
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default DashboardProjectList;
