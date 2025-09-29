import React, { useEffect, useState } from "react";
import ProjectHeader from "./ProjectHeader";
import { useLazyGetProjectByIdQuery } from "@/api/project/projectApi";
import { Project as ProjectType } from "@/types/project";
import { ProjectTabs } from "./ProjectTabs";

interface ProjectProps {
  id: string;
}

const Project = ({ id }: ProjectProps) => {
  const [fetchProject, { data, isLoading, error }] =
    useLazyGetProjectByIdQuery();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      setProject(data.project);
      setMembers(data.members || []);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading project</div>;

  return (
    <div>
      <ProjectHeader name={project?.name || ""} />
      <ProjectTabs
        projectId={project?._id || ""}
        members={members}
        project={project}
      />
    </div>
  );
};

export default Project;
