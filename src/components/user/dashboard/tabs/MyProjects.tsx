import DashboardProjectList from "@/components/projects/DashboardProjectList";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { LucideArrowRight, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const MyProjects = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Link href="/projects" className="hover:text-primary">
          <SquareArrowOutUpRight className="w-4 h-4" />
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
