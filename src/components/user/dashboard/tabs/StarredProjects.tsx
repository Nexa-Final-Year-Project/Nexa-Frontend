import DashboardProjectList from "@/components/projects/DashboardProjectList";
import { Project } from "@/types/project";
import { SquareArrowOutUpRight, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const StarredProjects = ({ projects }: { projects: Project[] }) => {
  const path = usePathname();
  const currentPath = path.split("/").pop();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 rounded-xl
            bg-gradient-to-br from-amber-500/20 to-orange-500/20
            border border-amber-500/30
            flex items-center justify-center
          ">
            <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Starred Projects</h2>
            <p className="text-xs text-white/40">Your favorite and pinned projects</p>
          </div>
        </div>
        <Link 
          href={`/${currentPath}/p`} 
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            text-sm font-medium text-white/60
            bg-white/[0.02] border border-white/[0.06]
            hover:bg-white/[0.05] hover:text-white/80 hover:border-white/[0.1]
            transition-all duration-300 cursor-pointer
            group
          "
        >
          View All
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>
      <DashboardProjectList projects={projects} showStarred={true} />
    </div>
  );
};

export default StarredProjects;
