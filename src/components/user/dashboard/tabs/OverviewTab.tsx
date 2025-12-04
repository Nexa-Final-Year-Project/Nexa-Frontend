import ActivityLogs from "@/components/activityLogs/ActivityLogs";
import React, { useMemo, useEffect } from "react";
import { Clock, Activity, Zap, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { useActivityLogs } from "@/hooks/activityLogs/useActivityLogs";
import { useAuthStore } from "@/store/auth/authStore";
import { useProjects } from "@/hooks/projects/useProjects";
import Link from "next/link";
import { useTheme } from "next-themes";

const OverviewTab = () => {
  const { activityLogs, fetchAllActivityLogs, isLoading } = useActivityLogs();
  const { user } = useAuthStore();
  const { projects } = useProjects();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fetch activity logs on mount
  useEffect(() => {
    fetchAllActivityLogs(user ? { userId: user.id } : {});
  }, [fetchAllActivityLogs, user]);

  // Calculate real stats from activity logs
  const stats = useMemo(() => {
    if (!activityLogs || activityLogs.length === 0) {
      return {
        today: 0,
        thisWeek: 0,
        activeProjects: 0,
        trend: 0,
      };
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfLastWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Today's activities
    const todayCount = activityLogs.filter(
      (log) => new Date(log.timestamp) >= startOfToday
    ).length;

    // This week's activities
    const thisWeekCount = activityLogs.filter(
      (log) => new Date(log.timestamp) >= startOfWeek
    ).length;

    // Last week's activities (for trend calculation)
    const lastWeekCount = activityLogs.filter((log) => {
      const date = new Date(log.timestamp);
      return date >= startOfLastWeek && date < startOfWeek;
    }).length;

    // Calculate trend percentage
    const trend = lastWeekCount > 0 
      ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100) 
      : thisWeekCount > 0 ? 100 : 0;

    // Active projects (from projects hook)
    const activeProjects = Array.isArray(projects) ? projects.length : 0;

    return {
      today: todayCount,
      thisWeek: thisWeekCount,
      activeProjects,
      trend,
    };
  }, [activityLogs, projects]);

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="relative group">
            <div className={`
              w-12 h-12 rounded-xl
              ${isDark 
                ? "bg-white/[0.05] border border-white/[0.08]" 
                : "bg-neutral-100 border border-neutral-200"
              }
              flex items-center justify-center
            `}>
              <Activity className={isDark ? "w-5 h-5 text-white/60" : "w-5 h-5 text-neutral-500"} />
            </div>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"} tracking-tight`}>Worked on</h2>
            <p className={`text-sm ${isDark ? "text-white/40" : "text-neutral-500"} mt-0.5`}>
              Recent changes across your projects
            </p>
          </div>
        </div>
        <Link 
          href="/activity"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all group ${
            isDark 
              ? "bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1]" 
              : "bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 hover:border-neutral-300"
          }`}
        >
          View All Activity
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`
          relative overflow-hidden
          ${isDark 
            ? "bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1]" 
            : "bg-white border border-neutral-200 hover:border-neutral-300 shadow-sm"
          }
          rounded-xl p-4
          group
          transition-all duration-300
        `}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className={isDark ? "w-4 h-4 text-white/50" : "w-4 h-4 text-neutral-400"} />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-neutral-500"} font-medium`}>Today</span>
            </div>
            {isLoading ? (
              <Loader2 className={`w-5 h-5 ${isDark ? "text-white/30" : "text-neutral-300"} animate-spin`} />
            ) : (
              <>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>{stats.today}</p>
                <p className={`text-xs ${isDark ? "text-white/30" : "text-neutral-400"}`}>Activities</p>
              </>
            )}
          </div>
        </div>
        
        <div className={`
          relative overflow-hidden
          ${isDark 
            ? "bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1]" 
            : "bg-white border border-neutral-200 hover:border-neutral-300 shadow-sm"
          }
          rounded-xl p-4
          group
          transition-all duration-300
        `}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={isDark ? "w-4 h-4 text-white/50" : "w-4 h-4 text-neutral-400"} />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-neutral-500"} font-medium`}>This Week</span>
            </div>
            {isLoading ? (
              <Loader2 className={`w-5 h-5 ${isDark ? "text-white/30" : "text-neutral-300"} animate-spin`} />
            ) : (
              <>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>{stats.thisWeek}</p>
                <p className={`text-xs ${isDark ? "text-white/30" : "text-neutral-400"}`}>Activities</p>
              </>
            )}
          </div>
        </div>
        
        <div className={`
          relative overflow-hidden
          ${isDark 
            ? "bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1]" 
            : "bg-white border border-neutral-200 hover:border-neutral-300 shadow-sm"
          }
          rounded-xl p-4
          group
          transition-all duration-300
        `}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className={isDark ? "w-4 h-4 text-white/50" : "w-4 h-4 text-neutral-400"} />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-neutral-500"} font-medium`}>Active</span>
            </div>
            {isLoading ? (
              <Loader2 className={`w-5 h-5 ${isDark ? "text-white/30" : "text-neutral-300"} animate-spin`} />
            ) : (
              <>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>{stats.activeProjects}</p>
                <p className={`text-xs ${isDark ? "text-white/30" : "text-neutral-400"}`}>Projects</p>
              </>
            )}
          </div>
        </div>

        <div className={`
          relative overflow-hidden
          ${isDark 
            ? "bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1]" 
            : "bg-white border border-neutral-200 hover:border-neutral-300 shadow-sm"
          }
          rounded-xl p-4
          group
          transition-all duration-300
        `}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={isDark ? "w-4 h-4 text-white/50" : "w-4 h-4 text-neutral-400"} />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-neutral-500"} font-medium`}>Trend</span>
            </div>
            {isLoading ? (
              <Loader2 className={`w-5 h-5 ${isDark ? "text-white/30" : "text-neutral-300"} animate-spin`} />
            ) : (
              <>
                <p className={`text-2xl font-bold ${stats.trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stats.trend >= 0 ? '+' : ''}{stats.trend}%
                </p>
                <p className={`text-xs ${isDark ? "text-white/30" : "text-neutral-400"}`}>vs last week</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Activity Logs Container */}
      <div className={`
        relative overflow-hidden
        ${isDark 
          ? "bg-white/[0.02] border border-white/[0.06]" 
          : "bg-white border border-neutral-200 shadow-sm"
        }
        rounded-2xl p-5
        backdrop-blur-sm
      `}>
        <ActivityLogs />
      </div>
    </div>
  );
};

export default OverviewTab;
