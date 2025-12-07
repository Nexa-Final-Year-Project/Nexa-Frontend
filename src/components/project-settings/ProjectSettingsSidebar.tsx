"use client";

import {
  Settings,
  Users,
  Trash2,
  Lock,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeCategory?: string;
  setActiveCategory?: (category: string) => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: string;
  nested?: boolean;
  destructive?: boolean;
}

export const ProjectSettingsSidebar = ({
  activeSection,
  setActiveSection,
  activeCategory,
  setActiveCategory,
}: SidebarProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sidebarItems: SidebarItem[] = [
    {
      id: "general",
      label: "General",
      icon: <Settings className="w-4 h-4" />,
      category: "Project",
    },
    {
      id: "members",
      label: "Members",
      icon: <Users className="w-4 h-4" />,
      category: "Team",
    },
    {
      id: "permissions-tasks",
      label: "Tasks",
      icon: <ClipboardList className="w-4 h-4" />,
      category: "Permissions",
    },
    {
      id: "permissions-project",
      label: "Project",
      icon: <ClipboardList className="w-4 h-4" />,
      category: "Permissions",
    },
    {
      id: "permissions-access",
      label: "Access Control",
      icon: <Lock className="w-4 h-4" />,
      category: "Permissions",
    },
    {
      id: "danger",
      label: "Delete Project",
      icon: <Trash2 className="w-4 h-4" />,
      category: "Danger Zone",
      destructive: true,
    },
  ];

  const categorizedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.category!]) {
      acc[item.category!] = [];
    }
    acc[item.category!].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <div className="w-full md:w-72 flex-shrink-0">
      <div className="md:sticky md:top-6">
        <div
          className={`rounded-2xl border p-4 backdrop-blur-sm ${
            isDark
              ? "bg-neutral-900/40 border-white/[0.06]"
              : "bg-white border-neutral-200 shadow-lg"
          }`}
        >
          <nav className="space-y-6">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 px-3 mb-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      category === "Danger Zone"
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      isDark ? "text-white/40" : "text-neutral-500"
                    }`}
                  >
                    {category}
                  </span>
                </div>

                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          if (
                            setActiveCategory &&
                            item.category !== undefined
                          ) {
                            setActiveCategory(item.category);
                          }
                        }}
                        className={`
                          group w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                          transition-all duration-200 cursor-pointer text-left border
                          ${
                            isDark
                              ? isActive
                                ? item.destructive
                                  ? "bg-rose-500/10 border-rose-500/20"
                                  : "bg-white/[0.08] border-white/[0.08]"
                                : "border-transparent hover:bg-white/[0.04]"
                              : isActive
                              ? item.destructive
                                ? "bg-rose-50 border-rose-200"
                                : "bg-violet-50 border-violet-200"
                              : "border-transparent hover:bg-neutral-50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                            ${
                              isDark
                                ? isActive
                                  ? item.destructive
                                    ? "bg-rose-500/20 text-rose-400"
                                    : "bg-white/10 text-white"
                                  : item.destructive
                                  ? "bg-rose-500/10 text-rose-400/60 group-hover:text-rose-400"
                                  : "bg-white/[0.04] text-white/50 group-hover:text-white/80"
                                : isActive
                                ? item.destructive
                                  ? "bg-rose-100 text-rose-600"
                                  : "bg-violet-100 text-violet-600"
                                : item.destructive
                                ? "bg-rose-50 text-rose-500 group-hover:text-rose-600"
                                : "bg-neutral-100 text-neutral-600 group-hover:text-neutral-900"
                            }
                          `}
                          >
                            {item.icon}
                          </div>
                          <span
                            className={`
                            text-sm font-medium transition-colors duration-200
                            ${
                              isDark
                                ? isActive
                                  ? item.destructive
                                    ? "text-rose-400"
                                    : "text-white"
                                  : item.destructive
                                  ? "text-rose-400/60 group-hover:text-rose-400"
                                  : "text-white/60 group-hover:text-white/90"
                                : isActive
                                ? item.destructive
                                  ? "text-rose-600"
                                  : "text-violet-700"
                                : item.destructive
                                ? "text-rose-500 group-hover:text-rose-600"
                                : "text-neutral-700 group-hover:text-neutral-900"
                            }
                          `}
                          >
                            {item.label}
                          </span>
                        </div>

                        <ChevronRight
                          className={`
                          w-4 h-4 transition-all duration-200
                          ${
                            isDark
                              ? isActive
                                ? item.destructive
                                  ? "text-rose-400/60"
                                  : "text-white/40"
                                : "text-white/20 opacity-0 group-hover:opacity-100"
                              : isActive
                              ? item.destructive
                                ? "text-rose-500"
                                : "text-violet-500"
                              : "text-neutral-400 opacity-0 group-hover:opacity-100"
                          }
                        `}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
