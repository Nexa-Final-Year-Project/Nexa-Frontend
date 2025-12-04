"use client";
import {
  HomeIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  UsersIcon,
  LineChartIcon,
  SettingsIcon,
  SheetIcon,
  Calendar,
} from "lucide-react";

import { Tabs } from "@/components/ui/tabs";
import { TabsListReusable } from "@/components/tabs/TabsList";
import { TabItemReusable } from "@/components/tabs/TabsItem";
import Overview from "./tabs/overview/Overview";
import Board from "./tabs/board/Board";
import TaskGenerationReports from "./tabs/reports/TaskGenerationReports";
import { useLazyGetProjectByIdQuery } from "@/api/project/projectApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLazyGetTaskByProjectIdQuery } from "@/api/task/taskApi";
import { useTaskActions, useTaskStore } from "@/store/tasks/taskStore";
import { Task } from "@/types/task";
import { Project, ProjectMember } from "@/types/project";
import TasksCalendar from "./tabs/calendar/TasksCalendar";
import ProjectSettings from "./tabs/settings/ProjectSettings";
import { Sprints } from "./tabs/sprints/Sprints";
import { Sprint } from "@/types/sprint";
import { useLazyGetSprintByProjectIdQuery } from "@/api/sprint/sprintApi";
import { useSprintStore } from "@/store/sprints/sprintStore";

const projectTabs = (
  projectId: string,
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  members: ProjectMember[],
  project: Project | null,
  sprints: Sprint[]
) => {
  return [
    {
      id: "overview",
      label: "Overview",
      icon: HomeIcon,
      content: (
        <Overview
          tasks={tasks}
          projectId={projectId}
          project={project}
          members={members}
        />
      ),
    },
    {
      id: "sprints",
      label: "Sprints",
      icon: SheetIcon,
      content: <Sprints projectId={projectId} sprints={sprints} members={members} />,
    },
    {
      id: "board",
      label: "Board",
      icon: ClipboardListIcon,
      content: (
        <Board
          projectId={projectId}
          tasks={tasks}
          setTasks={setTasks}
          members={members}
        />
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      content: (
        <TasksCalendar earliestYear={2025} latestYear={2025} tasks={tasks} />
      ),
    },
    // {
    //   id: "team",
    //   label: "Team",
    //   icon: UsersIcon,
    //   content: "Your team members and collaborations",
    // },
    // {
    //   id: "analytics",
    //   label: "Analytics",
    //   icon: LineChartIcon,
    //   content: "Your productivity metrics and insights",
    // },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      content: <ProjectSettings project={project || null} members={members} />,
    },
    {
      id: "task-generation-reports",
      label: "Task Generation Reports",
      icon: LineChartIcon,
      content: (
        <TaskGenerationReports projectId={projectId} members={members} />
      ),
    },
  ];
};

export function ProjectTabs({
  projectId,
  members,
  project,
}: {
  projectId: string;
  members: ProjectMember[];
  project: Project | null;
}) {
  // Use Next's reactive search params so we can respond to router.push updates
  const searchParams = useSearchParams();
  const paramTab = (searchParams && searchParams.get("tab")) || "overview";

  const [fetchTasksByProjectId, { data }] = useLazyGetTaskByProjectIdQuery();
  const [fetchSprintsByProject, { data: sprintsData }] =
    useLazyGetSprintByProjectIdQuery();
  const { setTasks, tasks } = useTaskStore();
  const { setSprints, sprints } = useSprintStore();
  
  // Function to refresh tasks
  const refreshTasks = () => {
    if (projectId) {
      fetchTasksByProjectId(projectId);
    }
  };
  
  useEffect(() => {
    refreshTasks();
  }, [projectId, fetchTasksByProjectId]);
  
  // Listen for tasks:refresh event to update analytics in real-time
  useEffect(() => {
    const handleTasksRefresh = () => {
      console.log("[ProjectTabs] Received tasks:refresh event, refetching tasks...");
      refreshTasks();
    };
    
    window.addEventListener("tasks:refresh", handleTasksRefresh);
    return () => window.removeEventListener("tasks:refresh", handleTasksRefresh);
  }, [projectId]);

  // Update task store when data changes
  useEffect(() => {
    if (data) {
      setTasks(data?.tasks || []);
    }
  }, [data, setTasks]);

  useEffect(() => {
    if (projectId) {
      fetchSprintsByProject(projectId);
    }
  }, [projectId, fetchSprintsByProject]);

  // Update sprint store when data changes
  useEffect(() => {
    if (sprintsData) {
      console.log("Fetched sprints:", sprintsData);
      setSprints(sprintsData?.sprints || []);
    }
  }, [sprintsData, setSprints]);

  const tabs = projectTabs(
    projectId,
    tasks,
    setTasks,
    members,
    project,
    sprints
  );

  const [activeTab, setActiveTab] = useState<string>(paramTab);

  useEffect(() => {
    // whenever the URL changes the paramTab will update via useSearchParams
    setActiveTab(paramTab);
  }, [paramTab]);

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
      <TabsListReusable tabs={tabs} />
      <TabItemReusable tabs={tabs} />
    </Tabs>
  );
}
