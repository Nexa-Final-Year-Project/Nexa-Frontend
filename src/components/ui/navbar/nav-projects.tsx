"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useModalStore } from "@/store/modal/modalStore";
import Link from "next/link";
import { useAuthStore } from "@/store/auth/authStore";
import { Project } from "@/types/project";

export function NavProjects({
  projects,
}: {
  projects: (Project & { url: string; icon: LucideIcon })[];
}) {
  const { isMobile } = useSidebar();
  const { openModal } = useModalStore();
  const { user } = useAuthStore();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between">
        Projects
        <span
          className="text-2xl text-muted-foreground cursor-pointer hover:translate-1 hover:text-primary transition-all duration-300"
          onClick={() => openModal("project.create")}
        >
          +
        </span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Link
                    href={item.url}
                    className="flex items-center w-full gap-2"
                  >
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    openModal("project.delete", {
                      id: item._id,
                      name: item.name,
                    })
                  }
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {projects?.length === 3 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
