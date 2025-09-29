"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavItem } from "./nav-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    Component?: React.ComponentType<any>;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu className="!border-transparent">
        {items.map((item) => {
          const hasItems = item.items && item.items.length > 0;
          const hasComponent = item.Component;

          return (
            <SidebarMenuItem key={item.title}>
              {hasItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg"
                  >
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <DropdownMenuItem key={subItem.title}>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : hasComponent ? (
                // Render the component with the sidebar button as trigger
                <item.Component
                  trigger={
                    <div className="w-full">
                      {" "}
                      {/* Add wrapper to ensure same width */}
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="w-full"
                      >
                        {item.icon && <item.icon />}
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </div>
                  }
                />
              ) : (
                <NavItem
                  icon={item.icon}
                  label={item.title}
                  active={item.isActive}
                  href={item.url}
                />
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
