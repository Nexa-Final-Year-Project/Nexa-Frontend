import RecentProjectList from "@/components/projects/RecentProjectList";
import React from "react";
import { DashboardTabs } from "./DashboardTabs";
import { useProjects } from "@/hooks/projects/useProjects";
// import { PROJECTS } from "@/lib/constants/projectsConstants";

const Dashboard = () => {
  const { fetchAllProjects, projects } = useProjects();

  React.useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  if (!projects) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="section-heading dark:text-white">For You</h1>
      <hr />
      <RecentProjectList projects={projects} />
      <div className="flex flex-col gap-4 py-10">
        <DashboardTabs projects={projects || []} />
      </div>
    </div>
  );
};

export default Dashboard;
