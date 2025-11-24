import React, { useState } from "react";
import RecentProjectCard from "./RecentProjectCard";
import { Project } from "@/types/project";
import { ProjectModal } from "./ProjectModal";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu/dropdown-menu";
import { DropdownMenuContent } from "../ui/dropdown-menu/dropdown-menu";
import { usePathAppender } from "@/hooks/usePathAppender";

const RecentProjectList = ({ projects }: { projects: Project[] | any }) => {
  const [open, setOpen] = useState(false);
  const appendToPath = usePathAppender();

  const handleViewAllProjects = () => {
    appendToPath("/p");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold dark:text-white">
          Recent Projects
        </h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <EllipsisVerticalIcon className="w-4 h-4 cursor-pointer" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="cursor-pointer">
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Create Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewAllProjects}>
                View All Projects
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ProjectModal open={open} onOpenChange={setOpen} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.isArray(projects)
          ? projects
              .slice(0, 4)
              .map((project) => (
                <RecentProjectCard
                  key={project._id}
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
