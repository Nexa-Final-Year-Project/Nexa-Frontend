import RecentProjectList from "@/components/projects/RecentProjectList";
import React from "react";
import { DashboardTabs } from "./DashboardTabs";
import { useProjects } from "@/hooks/projects/useProjects";
import { Sparkles, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const { fetchAllProjects, projects } = useProjects();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  React.useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  if (!projects) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-2xl ${
                isDark
                  ? "bg-white/[0.05] border border-white/[0.08]"
                  : "bg-neutral-100 border border-neutral-200"
              } flex items-center justify-center`}
            >
              <Loader2
                className={`w-6 h-6 ${
                  isDark ? "text-white/60" : "text-neutral-500"
                } animate-spin`}
              />
            </div>
          </div>
          <p
            className={`${
              isDark ? "text-white/40" : "text-neutral-500"
            } text-sm`}
          >
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative w-full min-w-0">
      {/* Header Section */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative group">
            <div
              className={`
              w-10 h-10 rounded-xl
              ${
                isDark
                  ? "bg-white/[0.05] border border-white/[0.08]"
                  : "bg-neutral-100 border border-neutral-200"
              }
              flex items-center justify-center
              transition-all duration-300
            `}
            >
              <Sparkles
                className={
                  isDark ? "w-5 h-5 text-white/60" : "w-5 h-5 text-neutral-500"
                }
              />
            </div>
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              } tracking-tight`}
            >
              For You
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            >
              Your personalized workspace
            </p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="relative h-px">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent ${
              isDark ? "via-white/[0.08]" : "via-neutral-200"
            } to-transparent`}
          />
        </div>
      </div>

      {/* Recent Projects Section */}
      <RecentProjectList projects={projects} />

      {/* Tabs Section */}
      <div className="flex flex-col gap-4 mt-4">
        <DashboardTabs projects={projects || []} />
      </div>
    </div>
  );
};

export default Dashboard;
