"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Settings, Lock, Sun, Bell, Activity, Trash2 } from "lucide-react";

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
    // Account
    {
      id: "general",
      label: "General",
      icon: <Settings className="w-4 h-4 mr-2" />,
      category: "Account",
    },
    {
      id: "security",
      label: "Security & Login",
      icon: <Lock className="w-4 h-4 mr-2" />,
      category: "Account",
    },

    // Preferences
    {
      id: "appearance",
      label: "Appearance",
      icon: <Sun className="w-4 h-4 mr-2" />,
      category: "Preferences",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4 mr-2" />,
      category: "Preferences",
    },
    {
      id: "data-controls",
      label: "Data Controls",
      icon: <Activity className="w-4 h-4 mr-2" />,
    },

    // Danger Zone
    {
      id: "delete-account",
      label: "Delete Account",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      category: "Danger Zone",
      destructive: true,
    },
  ];

  // Group items by category
  const categorizedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <div className="w-full md:w-72 flex-shrink-0">
      <div className="md:sticky md:top-6 !bg-transparent !border-none">
        <CardContent className="p-0 text-left">
          <nav className="space-y-8">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <div key={category}>
                <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </p>

                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start px-4 py-2 text-left rounded-lg transition-colors
                          ${
                            item.destructive
                              ? "text-destructive hover:text-destructive/90"
                              : isActive
                              ? "bg-blue-50 border-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                        onClick={() => {
                          setActiveSection(item.id);
                          if (setActiveCategory)
                            setActiveCategory(item.category);
                        }}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </CardContent>
      </div>
    </div>
  );
};
