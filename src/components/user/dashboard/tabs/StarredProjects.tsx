import DashboardProjectList from "@/components/projects/DashboardProjectList";
import { Project } from "@/types/project";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const StarredProjects = ({ projects }: { projects: Project[] }) => {
  const path = usePathname();
  const currentPath = path.split("/").pop();
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Starred Projects</h2>
        <Link href={`/${currentPath}/p`} className="hover:text-primary">
          <SquareArrowOutUpRight className="w-4 h-4" />
        </Link>
      </div>
      <DashboardProjectList projects={projects} showStarred={true} />
    </div>
  );
};

export default StarredProjects;
