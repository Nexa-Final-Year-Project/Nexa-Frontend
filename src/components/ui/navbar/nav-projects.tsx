"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Plus,
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
import { Project } from "@/types/project";
import { motion } from "framer-motion";

export function NavProjects({
  projects,
}: {
  projects: (Project & { url: string; icon: LucideIcon })[];
}) {
  const { isMobile } = useSidebar();
  const { openModal } = useModalStore();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between items-center">
        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Projects</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 flex items-center justify-center transition-colors"
          onClick={() => openModal("project.create")}
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </SidebarGroupLabel>
      <SidebarMenu className="max-h-[300px] overflow-y-auto scrollbar-none">
        {projects.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-white/30">No projects yet</p>
            <button
              onClick={() => openModal("project.create")}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create your first project
            </button>
          </div>
        ) : (
          projects.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="group/project hover:bg-white/[0.04] rounded-lg transition-all">
                  <a href={item.url} className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center">
                      <item.icon className="w-4.5 h-4.5 text-emerald-500 group-hover/project:text-emerald-400 transition-colors" />
                    </div>
                    <span className="truncate text-white/70 group-hover/project:text-white transition-colors">{item.name}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover className="text-white/30 hover:text-white hover:bg-white/[0.06]">
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-xl bg-neutral-900/95 backdrop-blur-xl border-white/[0.08] p-1"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.04] cursor-pointer">
                      <Link
                        href={item.url}
                        className="flex items-center w-full gap-2"
                      >
                        <Folder className="w-4 h-4 text-white/40" />
                        <span>View Project</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.04] cursor-pointer">
                      <Forward className="w-4 h-4 text-white/40" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
                    <DropdownMenuItem
                      onClick={() =>
                        openModal("project.delete", {
                          id: item._id,
                          name: item.name,
                        })
                      }
                      className="rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </motion.div>
          ))
        )}
        {projects?.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white/40 hover:text-white/60 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
              <span className="text-xs">View all projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
