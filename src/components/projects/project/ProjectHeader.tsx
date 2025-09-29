import { useAuthStore } from "@/store/auth/authStore";
import Link from "next/link";
import React from "react";

interface ProjectHeaderProps {
  name: string;
}

const ProjectHeader = ({ name }: ProjectHeaderProps) => {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col gap-1 mb-4">
      <Link className="text-sm text-muted-foreground" href={`/u/${user?.id}/p`}>
        Projects
      </Link>
      <h1 className="text-lg font-semibold">{name}</h1>
    </div>
  );
};

export default ProjectHeader;
