"use client";

import * as React from "react";
import {
  AudioWaveform,
  Clock,
  Command,
  Frame,
  GalleryVerticalEnd,
  Rocket,
  Star,
} from "lucide-react";

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
import { useProjects } from "@/hooks/projects/useProjects"; // ✅ Import your hook
import { useAuthStore } from "@/store/auth/authStore";
import { Project } from "@/types/project";
import Logo from "../Logo";
import RecentActivityPanel from "../search/panels/RecentActivityPanel";
import Link from "next/link";

// This is sample data except projects (which now come from API)
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/logo.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
      icon: Rocket,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    // {
    //   title: "Teams",
    //   url: "#",
    //   icon: Users,
    //   items: [
    //     { title: "Introduction", url: "#" },
    //     { title: "Get Started", url: "#" },
    //     { title: "Tutorials", url: "#" },
    //     { title: "Changelog", url: "#" },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     { title: "General", url: "#" },
    //     { title: "Team", url: "#" },
    //     { title: "Billing", url: "#" },
    //     { title: "Limits", url: "#" },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects, isLoading } = useProjects(); // ✅ Fetch real projects
  const { user } = useAuthStore();
  // Normalize projects (API may return an object or array). Ensure we always pass an array into NavProjects.
  let projectList: Project[] = [];
  if (Array.isArray(projects)) {
    projectList = projects;
  } else if (projects && Array.isArray((projects as any).projects)) {
    projectList = (projects as any).projects;
  } else if (projects && Array.isArray((projects as any).data)) {
    // some endpoints return { data: [...] }
    projectList = (projects as any).data;
  } else if (projects) {
    // unexpected shape — log once for debugging and fall back to empty
    // eslint-disable-next-line no-console
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="p-4 pt-6 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:pt-4">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Link href={`/u/${user?.uid}`}>
          <NavItem label="For You" icon={Star} />
        </Link>
        <NavMain items={data.navMain} />
        <NavProjects
          projects={isLoading ? [] : formattedProjects} // show empty while loading
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
