"use client";

import { Settings, Lock, Sun, Bell, Activity, Trash2, ChevronRight } from "lucide-react";

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
        <div className="rounded-2xl bg-neutral-900/40 dark:bg-neutral-900/40 border border-white/[0.06] p-4 backdrop-blur-sm">
          <nav className="space-y-6">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 px-3 mb-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    category === "Danger Zone" ? "bg-rose-500" : 
                    category === "Preferences" ? "bg-blue-500" : "bg-emerald-500"
                  }`} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
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
                          if (setActiveCategory) setActiveCategory(item.category);
                        }}
                        className={`
                          group w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                          transition-all duration-200 cursor-pointer text-left
                          ${isActive 
                            ? item.destructive
                              ? "bg-rose-500/10 border border-rose-500/20"
                              : "bg-white/[0.08] border border-white/[0.08]"
                            : "border border-transparent hover:bg-white/[0.04]"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                            ${isActive
                              ? item.destructive
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-white/10 text-white"
                              : item.destructive
                                ? "bg-rose-500/10 text-rose-400/60 group-hover:text-rose-400"
                                : "bg-white/[0.04] text-white/50 group-hover:text-white/80"
                            }
                          `}>
                            {item.icon}
                          </div>
                          <span className={`
                            text-sm font-medium transition-colors duration-200
                            ${isActive
                              ? item.destructive ? "text-rose-400" : "text-white"
                              : item.destructive
                                ? "text-rose-400/60 group-hover:text-rose-400"
                                : "text-white/60 group-hover:text-white/90"
                            }
                          `}>
                            {item.label}
                          </span>
                        </div>
                        
                        <ChevronRight className={`
                          w-4 h-4 transition-all duration-200
                          ${isActive
                            ? item.destructive ? "text-rose-400/60" : "text-white/40"
                            : "text-white/20 opacity-0 group-hover:opacity-100"
                          }
                        `} />
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
