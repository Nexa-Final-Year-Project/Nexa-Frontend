"use client";

import * as React from "react";
import { Clock, Frame, Star, Keyboard, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";

import { NavMain } from "@/components/ui/navbar/nav-main";
import { NavProjects } from "@/components/ui/navbar/nav-projects";
import { NavUser } from "@/components/ui/navbar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavItem } from "@/components/ui/navbar/nav-item";
import { useProjects } from "@/hooks/projects/useProjects";
import { useAuthStore } from "@/store/auth/authStore";
import { Project } from "@/types/project";
import Logo from "../Logo";
import RecentActivityPanel from "../search/panels/RecentActivityPanel";
import StarredProjectsPanel from "../search/panels/StarredProjectsPanel";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Recent",
      url: "#",
      icon: Clock,
      isActive: false,
      Component: RecentActivityPanel,
    },
    {
      title: "Starred",
      url: "#",
      icon: Star,
      isActive: false,
      Component: StarredProjectsPanel,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects, isLoading } = useProjects();
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  let projectList: Project[] = [];
  if (Array.isArray(projects)) {
    projectList = projects;
  } else if (projects && Array.isArray((projects as any).projects)) {
    projectList = (projects as any).projects;
  } else if (projects && Array.isArray((projects as any).data)) {
    projectList = (projects as any).data;
  } else if (projects) {
    console.warn("AppSidebar: `projects` is not an array. Received:", projects);
    projectList = [];
  }

  const formattedProjects = projectList.map((project: Project) => ({
    name: project.name,
    _id: project._id,
    description: project.description || "",
    url: `/u/${user?.id}/p/${project?._id}`,
    icon: Frame,
  }));

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={`border-r ${
        isDark ? "border-white/[0.06]" : "border-neutral-200"
      }`}
    >
      {/* Clean background */}
      <div
        className={`absolute inset-0 ${
          isDark ? "bg-[#0c0c10]" : "bg-white"
        } pointer-events-none`}
      />

      <SidebarHeader className="relative z-10">
        <div className="p-4 pt-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          {/* Original Logo component - links to home "/" */}
          <Logo
            size={36}
            textSize="text-xl"
            gap="space-x-2.5"
            className="hover:opacity-90 transition-opacity"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="relative z-10 px-2 group-data-[collapsible=icon]:px-1">
        {/* For You - Dashboard Link */}
        <Link
          href={`/u/${user?.uid}`}
          className="block group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
        >
          <NavItem label="For You" icon={Star} className="mb-1" />
        </Link>

        {/* Main Navigation */}
        <NavMain items={data.navMain} />

        {/* Projects Section */}
        <NavProjects projects={isLoading ? [] : formattedProjects} />

        {/* Bottom Quick Links */}
        <div
          className={`mt-auto pt-4 border-t ${
            isDark ? "border-white/[0.06]" : "border-neutral-200"
          } mx-2 group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center`}
        >
          <Link
            href="/shortcuts"
            className="block group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
          >
            <NavItem label="Keyboard Shortcuts" icon={Keyboard} />
          </Link>
          <Link
            href="/help"
            className="block group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
          >
            <NavItem label="Help & Support" icon={HelpCircle} />
          </Link>
        </div>
      </SidebarContent>

      <SidebarFooter className="relative z-10">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
