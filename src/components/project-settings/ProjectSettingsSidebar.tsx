import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Settings,
  Users,
  Shield,
  Trash2,
  Bell,
  Plug,
  Activity,
  Key,
  Lock,
  Eye,
  UserX,
  ClipboardList,
} from "lucide-react";

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
  // Define sidebar items in a structured array
  const sidebarItems: SidebarItem[] = [
    // Project category
    {
      id: "general",
      label: "General",
      icon: <Settings className="w-4 h-4 mr-2" />,
      category: "Project",
    },
    // {
    //   id: "appearance",
    //   label: "Appearance",
    //   icon: <Eye className="w-4 h-4 mr-2" />,
    //   category: "Project",
    // },

    // Team category
    {
      id: "members",
      label: "Members",
      icon: <Users className="w-4 h-4 mr-2" />,
      category: "Team",
    },
    // {
    //   id: "invitations",
    //   label: "Invitations",
    //   icon: <UserX className="w-4 h-4 mr-2" />,
    //   category: "Team",
    // },

    // Permissions category (with nested items)
    {
      id: "permissions-tasks",
      label: "Tasks",
      icon: <ClipboardList className="w-4 h-4 mr-2" />,
      category: "Permissions",
    },
    {
      id: "permissions-project",
      label: "Project",
      icon: <ClipboardList className="w-4 h-4 mr-2" />,
      category: "Permissions",
    },
    {
      id: "permissions-access",
      label: "Access Control",
      icon: <Lock className="w-4 h-4 mr-2" />,
      category: "Permissions",
    },

    // System category
    // {
    //   id: "integrations",
    //   label: "Integrations",
    //   icon: <Plug className="w-4 h-4 mr-2" />,
    //   category: "System",
    // },
    // {
    //   id: "notifications",
    //   label: "Notifications",
    //   icon: <Bell className="w-4 h-4 mr-2" />,
    //   category: "System",
    // },
    // {
    //   id: "activity",
    //   label: "Activity Logs",
    //   icon: <Activity className="w-4 h-4 mr-2" />,
    //   category: "System",
    // },

    // Danger Zone category
    {
      id: "danger",
      label: "Delete Project",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      category: "Danger Zone",
      destructive: true,
    },
  ];

  // Group items by category
  const categorizedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.category!]) {
      acc[item.category!] = [];
    }
    acc[item.category!].push(item);
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

                <div
                  className={
                    items.some((item) => item.nested)
                      ? "space-y-1 pl-2 border-l ml-2"
                      : "space-y-1"
                  }
                >
                  {items.map((item) => (
                    <Button
                      key={item.id}
                      variant={
                        activeSection === item.id ? "secondary" : "ghost"
                      }
                      className={`w-full justify-start px-4 py-2 cursor-pointer ${
                        item.destructive
                          ? "text-destructive hover:text-destructive"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveSection(item.id);
                        if (setActiveCategory && item.category !== undefined) {
                          setActiveCategory(item.category);
                        }
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </CardContent>
      </div>
    </div>
  );
};
