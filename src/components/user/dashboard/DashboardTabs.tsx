"use client";

import { Project } from "@/types/project";
import {
  HomeIcon,
  LayoutPanelTopIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  StarIcon,
  UsersIcon,
  LineChartIcon,
  SettingsIcon,
} from "lucide-react";

import { Tabs } from "@/components/ui/tabs";

import StarredProjects from "./tabs/StarredProjects";
import MyProjects from "./tabs/MyProjects";
import { TabsListReusable } from "@/components/tabs/TabsList";
import { TabItemReusable } from "@/components/tabs/TabsItem";
import AssignedTasks from "./tabs/AssignedTasks";
import OverviewTab from "./tabs/OverviewTab";

const dashboardTabs = (projects: Project[]) => [
  {
    id: "overview",
    label: "Overview",
    icon: HomeIcon,
    component: <OverviewTab />,
  },
  {
    id: "my-projects",
    label: "My Projects",
    icon: LayoutPanelTopIcon,
    badge: projects.length,
    content: "Projects you're currently working on",
    component: <MyProjects projects={projects} />,
  },
  {
    id: "assigned",
    label: "Assigned",
    icon: ClipboardListIcon,
    component: <AssignedTasks />,
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircleIcon,
    content: "Tasks you've finished recently",
  },
  {
    id: "starred",
    label: "Starred",
    icon: StarIcon,
    badge: "New",
    content: "Your bookmarked projects and tasks",
    component: <StarredProjects projects={projects} />,
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
  // {
  //   id: "settings",
  //   label: "Settings",
  //   icon: SettingsIcon,
  //   content: "Configure your dashboard preferences",
  // },
];

export function DashboardTabs({ projects }: { projects: Project[] }) {
  const tabs = dashboardTabs(projects);

  return (
    <Tabs defaultValue="overview">
      <TabsListReusable tabs={tabs} />
      <TabItemReusable tabs={tabs} />
    </Tabs>
  );
}
