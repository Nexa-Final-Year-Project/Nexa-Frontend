"use client";

import { useTheme } from "next-themes";
import {
  Settings,
  Lock,
  Sun,
  Bell,
  Activity,
  Trash2,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setActiveCategory?: (category: string) => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  destructive?: boolean;
}

export const UserSettingsSidebar = ({
  activeSection,
  setActiveSection,
  setActiveCategory,
}: SidebarProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sidebarItems: SidebarItem[] = [
    {
      id: "general",
      label: "General",
      icon: <Settings className="w-4 h-4" />,
      category: "Account",
    },
    {
      id: "security",
      label: "Security & Login",
      icon: <Lock className="w-4 h-4" />,
      category: "Account",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Sun className="w-4 h-4" />,
      category: "Preferences",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      category: "Preferences",
    },
    {
      id: "data-controls",
      label: "Data Controls",
      icon: <Activity className="w-4 h-4" />,
      category: "Preferences",
    },
    {
      id: "delete-account",
      label: "Delete Account",
      icon: <Trash2 className="w-4 h-4" />,
      category: "Danger Zone",
      destructive: true,
    },
  ];

  const categorizedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <div className="w-full md:w-72 flex-shrink-0">
      <div className="md:sticky md:top-6">
        <div
          className={`rounded-2xl border p-4 backdrop-blur-sm ${
            isDark
              ? "bg-neutral-900/40 border-white/[0.06]"
              : "bg-neutral-50 border-neutral-300"
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
                        : category === "Preferences"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      isDark ? "text-white/40" : "text-neutral-600"
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
                          if (setActiveCategory)
                            setActiveCategory(item.category);
                        }}
                        className={`
                          group w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                          transition-all duration-200 cursor-pointer text-left border
                          ${
                            isActive
                              ? item.destructive
                                ? isDark
                                  ? "bg-rose-500/10 border-rose-500/20"
                                  : "bg-red-100 border-red-300"
                                : isDark
                                ? "bg-white/[0.08] border-white/[0.08]"
                                : "bg-neutral-100 border-neutral-300"
                              : isDark
                              ? "border-transparent hover:bg-white/[0.04]"
                              : "border-transparent hover:bg-neutral-100"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                            ${
                              isActive
                                ? item.destructive
                                  ? isDark
                                    ? "bg-rose-500/20 text-rose-400"
                                    : "bg-red-100 text-red-600"
                                  : isDark
                                  ? "bg-white/10 text-white"
                                  : "bg-neutral-200 text-neutral-900"
                                : item.destructive
                                ? isDark
                                  ? "bg-rose-500/10 text-rose-400/60 group-hover:text-rose-400"
                                  : "bg-red-100/50 text-red-600/60 group-hover:text-red-600"
                                : isDark
                                ? "bg-white/[0.04] text-white/50 group-hover:text-white/80"
                                : "bg-neutral-200/50 text-neutral-600 group-hover:text-neutral-900"
                            }
                          `}
                          >
                            {item.icon}
                          </div>
                          <span
                            className={`
                            text-sm font-medium transition-colors duration-200
                            ${
                              isActive
                                ? item.destructive
                                  ? isDark
                                    ? "text-rose-400"
                                    : "text-red-600"
                                  : isDark
                                  ? "text-white"
                                  : "text-neutral-900"
                                : item.destructive
                                ? isDark
                                  ? "text-rose-400/60 group-hover:text-rose-400"
                                  : "text-red-600/60 group-hover:text-red-600"
                                : isDark
                                ? "text-white/60 group-hover:text-white/90"
                                : "text-neutral-600 group-hover:text-neutral-900"
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
                            isActive
                              ? item.destructive
                                ? isDark
                                  ? "text-rose-400/60"
                                  : "text-red-600/60"
                                : isDark
                                ? "text-white/40"
                                : "text-neutral-400"
                              : isDark
                              ? "text-white/20 opacity-0 group-hover:opacity-100"
                              : "text-neutral-400/40 opacity-0 group-hover:opacity-100"
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
