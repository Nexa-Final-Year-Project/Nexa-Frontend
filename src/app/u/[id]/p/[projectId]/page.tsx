"use client";
import Project from "@/components/projects/project/Project";
import { useParams } from "next/navigation";
import React from "react";

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <>
      <Project id={projectId} />
    </>
  );
};

export default ProjectPage;
