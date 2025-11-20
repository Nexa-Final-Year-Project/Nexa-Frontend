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
import { useLazyGetProjectByIdQuery } from "@/api/project/projectApi";
import { useEffect } from "react";
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
      content: <Sprints projectId={projectId} sprints={sprints} />,
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
  const [fetchTasksByProjectId, { data }] = useLazyGetTaskByProjectIdQuery();
  const [fetchSprintsByProject, { data: sprintsData }] =
    useLazyGetSprintByProjectIdQuery();
  const { setTasks, tasks } = useTaskStore();
  const { setSprints, sprints } = useSprintStore();
  useEffect(() => {
    if (projectId) {
      fetchTasksByProjectId(projectId);
    }
  }, [projectId, fetchTasksByProjectId]);

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

  return (
    <Tabs defaultValue="overview">
      <TabsListReusable tabs={tabs} />
      <TabItemReusable tabs={tabs} />
    </Tabs>
  );
}
