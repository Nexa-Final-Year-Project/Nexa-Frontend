"use client";

import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/shared/Header/Header";
import { useActivityLogs } from "@/hooks/activityLogs/useActivityLogs";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetProjectsQuery } from "@/api/project/projectApi";
import { ActivityLog, ActionType, EntityType } from "@/types/activityLogs";
import { Project } from "@/types/project";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  Filter,
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Move,
  CheckSquare,
  FileText,
  Folder,
  User,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Loader2,
  Eye,
  UserPlus,
  UserMinus,
  ArrowRightLeft,
  RefreshCw,
  Download,
  LayoutGrid,
  List,
  TrendingUp,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useTheme } from "next-themes";

type ViewMode = "timeline" | "grouped";
type FilterEntity = "all" | "task" | "project" | "sprint" | "comment";
type FilterAction =
  | "all"
  | "created"
  | "updated"
  | "deleted"
  | "assigned"
  | "status_changed";

export default function ActivityPage() {
  const { activityLogs, fetchAllActivityLogs, isLoading, error } =
    useActivityLogs();
  const { user } = useAuthStore();
  const { data: projectsData } = useGetProjectsQuery({});
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [filterEntity, setFilterEntity] = useState<FilterEntity>("all");
  const [filterAction, setFilterAction] = useState<FilterAction>("all");
  const [dateRange, setDateRange] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  // Normalize projects
  const projects: Project[] = useMemo(() => {
    if (!projectsData) return [];
    if (Array.isArray(projectsData)) return projectsData;
    if (Array.isArray((projectsData as any).projects))
      return (projectsData as any).projects;
    return [];
  }, [projectsData]);

  useEffect(() => {
    fetchAllActivityLogs(user ? { userId: user.id } : {});
  }, [fetchAllActivityLogs, user]);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let result = [...activityLogs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((log) => {
        const taskTitle = (log as any).task?.title?.toLowerCase() || "";
        const projectName = (log as any).project?.name?.toLowerCase() || "";
        return (
          taskTitle.includes(query) ||
          projectName.includes(query) ||
          log.entityType.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query)
        );
      });
    }

    // Entity filter
    if (filterEntity !== "all") {
      result = result.filter(
        (log) => log.entityType.toLowerCase() === filterEntity
      );
    }

    // Action filter
    if (filterAction !== "all") {
      result = result.filter((log) => log.action === filterAction);
    }

    // Date range filter
    const now = new Date();
    switch (dateRange) {
      case "today":
        result = result.filter(
          (log) => new Date(log.timestamp).toDateString() === now.toDateString()
        );
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        result = result.filter((log) => new Date(log.timestamp) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        result = result.filter((log) => new Date(log.timestamp) >= monthAgo);
        break;
    }

    // Sort by timestamp descending
    return result.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [activityLogs, searchQuery, filterEntity, filterAction, dateRange]);

  // Group logs by date
  const groupedLogs = useMemo(() => {
    const groups: Record<string, ActivityLog[]> = {};
    filteredLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });
    return groups;
  }, [filteredLogs]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayLogs = activityLogs.filter(
      (log) => new Date(log.timestamp).toDateString() === today
    );

    return {
      total: activityLogs.length,
      today: todayLogs.length,
      created: activityLogs.filter((log) => log.action === "created").length,
      updated: activityLogs.filter((log) => log.action === "updated").length,
    };
  }, [activityLogs]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs((prev) => ({ ...prev, [logId]: !prev[logId] }));
  };

  const getActionIcon = (action: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      created: <Plus className="w-4 h-4" />,
      updated: <Edit3 className="w-4 h-4" />,
      deleted: <Trash2 className="w-4 h-4" />,
      assigned: <UserPlus className="w-4 h-4" />,
      unassigned: <UserMinus className="w-4 h-4" />,
      status_changed: <ArrowRightLeft className="w-4 h-4" />,
      commented: <MessageSquare className="w-4 h-4" />,
      viewed: <Eye className="w-4 h-4" />,
    };
    return iconMap[action] || <Activity className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      created: isDark
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        : "bg-emerald-50 text-emerald-600 border-emerald-200",
      updated: isDark
        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
        : "bg-blue-50 text-blue-600 border-blue-200",
      deleted: isDark
        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
        : "bg-rose-50 text-rose-600 border-rose-200",
      assigned: isDark
        ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
        : "bg-violet-50 text-violet-600 border-violet-200",
      unassigned: isDark
        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
        : "bg-amber-50 text-amber-600 border-amber-200",
      status_changed: isDark
        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
        : "bg-cyan-50 text-cyan-600 border-cyan-200",
      commented: isDark
        ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
        : "bg-pink-50 text-pink-600 border-pink-200",
    };
    return (
      colorMap[action] ||
      (isDark
        ? "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
        : "bg-neutral-100 text-neutral-600 border-neutral-200")
    );
  };

  const getEntityIcon = (entity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Task: <CheckSquare className="w-3.5 h-3.5" />,
      Project: <Folder className="w-3.5 h-3.5" />,
      Sprint: <Zap className="w-3.5 h-3.5" />,
      User: <User className="w-3.5 h-3.5" />,
      Comment: <MessageSquare className="w-3.5 h-3.5" />,
    };
    return iconMap[entity] || <FileText className="w-3.5 h-3.5" />;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const entityFilters: { key: FilterEntity; label: string }[] = [
    { key: "all", label: "All Types" },
    { key: "task", label: "Tasks" },
    { key: "project", label: "Projects" },
    { key: "sprint", label: "Sprints" },
    { key: "comment", label: "Comments" },
  ];

  const actionFilters: { key: FilterAction; label: string }[] = [
    { key: "all", label: "All Actions" },
    { key: "created", label: "Created" },
    { key: "updated", label: "Updated" },
    { key: "deleted", label: "Deleted" },
    { key: "assigned", label: "Assigned" },
    { key: "status_changed", label: "Status Changed" },
  ];

  const dateFilters: { key: typeof dateRange; label: string }[] = [
    { key: "all", label: "All Time" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  return (
    <div
      className={cn(
        "min-h-screen relative",
        isDark ? "bg-neutral-950" : "bg-neutral-50"
      )}
    >
      {/* Background */}
      {isDark && (
        <>
          <div className="fixed inset-0 -z-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
          <div
            className="fixed inset-0 -z-10 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
            }}
          />
        </>
      )}

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 backdrop-blur-md border-b",
          isDark
            ? "bg-neutral-900/80 border-white/5"
            : "bg-white/80 border-neutral-200"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href={user?.uid ? `/u/${user.uid}` : "/projects"}
          className={cn(
            "inline-flex items-center gap-2 text-sm transition-colors mb-6",
            isDark
              ? "text-white/50 hover:text-white"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border",
                  isDark
                    ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-white/10"
                    : "bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200"
                )}
              >
                <Activity
                  className={cn(
                    "w-7 h-7",
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  )}
                />
              </div>
              <div>
                <h1
                  className={cn(
                    "text-3xl md:text-4xl font-bold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}
                >
                  Activity Feed
                </h1>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  )}
                >
                  Track all changes across your workspace
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className={cn(
                  "transition-all",
                  isDark
                    ? "border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                    : "border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                )}
                onClick={() =>
                  fetchAllActivityLogs(user ? { userId: user.id } : {})
                }
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: "Total Activities",
              value: stats.total,
              icon: Activity,
              color: isDark ? "text-violet-400" : "text-violet-600",
              bg: isDark ? "bg-violet-500/10" : "bg-violet-50",
            },
            {
              label: "Today",
              value: stats.today,
              icon: Calendar,
              color: isDark ? "text-emerald-400" : "text-emerald-600",
              bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
            },
            {
              label: "Created",
              value: stats.created,
              icon: Plus,
              color: isDark ? "text-cyan-400" : "text-cyan-600",
              bg: isDark ? "bg-cyan-500/10" : "bg-cyan-50",
            },
            {
              label: "Updated",
              value: stats.updated,
              icon: Edit3,
              color: isDark ? "text-amber-400" : "text-amber-600",
              bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={cn(
                "p-5 rounded-2xl border transition-all",
                isDark
                  ? "bg-neutral-900/50 border-white/[0.06] hover:border-white/[0.1]"
                  : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
              )}
            >
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div
                className={cn(
                  "text-2xl font-bold mb-1",
                  isDark ? "text-white" : "text-neutral-900"
                )}
              >
                {stat.value}
              </div>
              <div
                className={cn(
                  "text-xs",
                  isDark ? "text-neutral-500" : "text-neutral-600"
                )}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )}
              />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2",
                  isDark
                    ? "bg-neutral-900/60 border-white/10 text-white placeholder-neutral-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("timeline")}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  viewMode === "timeline"
                    ? isDark
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : isDark
                    ? "bg-neutral-900/40 border-white/10 text-neutral-400 hover:text-white"
                    : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900"
                )}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  viewMode === "grouped"
                    ? isDark
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : isDark
                    ? "bg-neutral-900/40 border-white/10 text-neutral-400 hover:text-white"
                    : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900"
                )}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {/* Entity Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={cn(
                  "text-xs uppercase tracking-wider mr-2",
                  isDark ? "text-neutral-500" : "text-neutral-600"
                )}
              >
                Type:
              </span>
              {entityFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterEntity(filter.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    filterEntity === filter.key
                      ? isDark
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : isDark
                      ? "bg-neutral-900/40 text-neutral-400 border-white/5 hover:text-white hover:border-white/10"
                      : "bg-white text-neutral-500 border-neutral-200 hover:text-neutral-900 hover:border-neutral-300"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div
              className={cn(
                "w-px h-6 mx-2 hidden sm:block",
                isDark ? "bg-white/10" : "bg-neutral-200"
              )}
            />

            {/* Date Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={cn(
                  "text-xs uppercase tracking-wider mr-2",
                  isDark ? "text-neutral-500" : "text-neutral-600"
                )}
              >
                Time:
              </span>
              {dateFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setDateRange(filter.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    dateRange === filter.key
                      ? isDark
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : isDark
                      ? "bg-neutral-900/40 text-neutral-400 border-white/5 hover:text-white hover:border-white/10"
                      : "bg-white text-neutral-500 border-neutral-200 hover:text-neutral-900 hover:border-neutral-300"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              className={cn(
                "w-10 h-10 animate-spin mb-4",
                isDark ? "text-emerald-400" : "text-emerald-600"
              )}
            />
            <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Loading activity...
            </p>
          </div>
        ) : error ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-20 px-4 rounded-2xl border",
              isDark
                ? "bg-rose-500/10 border-rose-500/20"
                : "bg-rose-50 border-rose-200"
            )}
          >
            <Trash2
              className={cn(
                "w-10 h-10 mb-4",
                isDark ? "text-rose-400" : "text-rose-600"
              )}
            />
            <p
              className={cn(
                "text-center",
                isDark ? "text-rose-400" : "text-rose-600"
              )}
            >
              Failed to load activity. Please try again.
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex flex-col items-center justify-center py-20 px-4 rounded-2xl border",
              isDark
                ? "bg-neutral-900/30 border-white/5"
                : "bg-white border-neutral-200"
            )}
          >
            <div
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
                isDark ? "bg-emerald-500/10" : "bg-emerald-50"
              )}
            >
              <Activity
                className={cn(
                  "w-10 h-10",
                  isDark ? "text-emerald-400/50" : "text-emerald-600/50"
                )}
              />
            </div>
            <h3
              className={cn(
                "text-xl font-semibold mb-2",
                isDark ? "text-white/80" : "text-neutral-900"
              )}
            >
              No activity found
            </h3>
            <p
              className={cn(
                "text-center max-w-md",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}
            >
              {searchQuery
                ? `No activities match "${searchQuery}".`
                : "Your activity feed is empty. Actions you take will appear here."}
            </p>
          </motion.div>
        ) : viewMode === "timeline" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Timeline line */}
            <div
              className={cn(
                "absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b",
                isDark
                  ? "from-emerald-500/50 via-violet-500/30 to-transparent"
                  : "from-emerald-500/30 via-neutral-300 to-transparent"
              )}
            />

            <div className="space-y-4">
              {filteredLogs.map((log, index) => {
                const isExpanded = expandedLogs[log._id];
                const actionColor = getActionColor(log.action);

                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative pl-16 group"
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute left-3 top-4 w-6 h-6 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-110",
                        actionColor
                      )}
                    >
                      {getActionIcon(log.action)}
                    </div>

                    {/* Card */}
                    <div
                      className={cn(
                        "p-5 rounded-2xl border transition-all",
                        isDark
                          ? "bg-neutral-900/50 border-white/[0.06] hover:border-white/[0.1]"
                          : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <span
                              className={cn(
                                "text-sm font-semibold capitalize",
                                isDark ? "text-white" : "text-neutral-900"
                              )}
                            >
                              {log.action.replace("_", " ")}
                            </span>
                            <span
                              className={cn(
                                "text-sm",
                                isDark ? "text-neutral-500" : "text-neutral-500"
                              )}
                            >
                              {log.entityType.toLowerCase()}
                            </span>
                            {(log as any).task && (
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 px-2 py-0.5 rounded-lg",
                                  isDark ? "bg-white/[0.04]" : "bg-neutral-100"
                                )}
                              >
                                {getEntityIcon("Task")}
                                <span
                                  className={cn(
                                    "text-xs",
                                    isDark
                                      ? "text-neutral-400"
                                      : "text-neutral-600"
                                  )}
                                >
                                  {(log as any).task.title}
                                </span>
                              </div>
                            )}
                            {(log as any).project && (
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 px-2 py-0.5 rounded-lg",
                                  isDark ? "bg-white/[0.04]" : "bg-neutral-100"
                                )}
                              >
                                {getEntityIcon("Project")}
                                <span
                                  className={cn(
                                    "text-xs",
                                    isDark
                                      ? "text-neutral-400"
                                      : "text-neutral-600"
                                  )}
                                >
                                  {(log as any).project.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-2 text-xs",
                              isDark ? "text-neutral-500" : "text-neutral-500"
                            )}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(log.timestamp)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleExpand(log._id)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isDark
                              ? "text-neutral-500 hover:text-white hover:bg-white/5"
                              : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                          )}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                              "mt-4 pt-4 border-t",
                              isDark ? "border-white/5" : "border-neutral-200"
                            )}
                          >
                            <div
                              className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              )}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span
                                    className={
                                      isDark
                                        ? "text-neutral-500"
                                        : "text-neutral-500"
                                    }
                                  >
                                    Entity Type:
                                  </span>
                                  <span
                                    className={cn(
                                      "ml-2",
                                      isDark ? "text-white" : "text-neutral-900"
                                    )}
                                  >
                                    {log.entityType}
                                  </span>
                                </div>
                                <div>
                                  <span
                                    className={
                                      isDark
                                        ? "text-neutral-500"
                                        : "text-neutral-500"
                                    }
                                  >
                                    Timestamp:
                                  </span>
                                  <span
                                    className={cn(
                                      "ml-2",
                                      isDark ? "text-white" : "text-neutral-900"
                                    )}
                                  >
                                    {new Date(log.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              {log.details && (
                                <div
                                  className={cn(
                                    "mt-3 p-3 rounded-lg border",
                                    isDark
                                      ? "bg-white/[0.02] border-white/5"
                                      : "bg-neutral-50 border-neutral-200"
                                  )}
                                >
                                  <span
                                    className={
                                      isDark
                                        ? "text-neutral-500"
                                        : "text-neutral-500"
                                    }
                                  >
                                    Details:
                                  </span>
                                  <pre
                                    className={cn(
                                      "mt-1 whitespace-pre-wrap",
                                      isDark
                                        ? "text-white/70"
                                        : "text-neutral-700"
                                    )}
                                  >
                                    {typeof log.details === "string"
                                      ? log.details
                                      : JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Grouped View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {Object.entries(groupedLogs).map(([date, logs], groupIndex) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={cn(
                      "px-4 py-2 rounded-xl border",
                      isDark
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-emerald-50 border-emerald-200"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      )}
                    >
                      {formatGroupDate(date)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex-1 h-px bg-gradient-to-r",
                      isDark
                        ? "from-emerald-500/20 to-transparent"
                        : "from-emerald-200 to-transparent"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    )}
                  >
                    {logs.length}{" "}
                    {logs.length === 1 ? "activity" : "activities"}
                  </span>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {logs.map((log, index) => {
                    const actionColor = getActionColor(log.action);

                    return (
                      <motion.div
                        key={log._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all group",
                          isDark
                            ? "bg-neutral-900/40 border-white/[0.06] hover:border-white/[0.1]"
                            : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-110",
                              actionColor
                            )}
                          >
                            {getActionIcon(log.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={cn(
                                  "text-sm font-medium capitalize",
                                  isDark ? "text-white" : "text-neutral-900"
                                )}
                              >
                                {log.action.replace("_", " ")}
                              </span>
                              <span
                                className={cn(
                                  "text-xs",
                                  isDark
                                    ? "text-neutral-500"
                                    : "text-neutral-500"
                                )}
                              >
                                {log.entityType}
                              </span>
                            </div>
                            {((log as any).task || (log as any).project) && (
                              <p
                                className={cn(
                                  "text-xs truncate",
                                  isDark
                                    ? "text-neutral-400"
                                    : "text-neutral-600"
                                )}
                              >
                                {(log as any).task?.title ||
                                  (log as any).project?.name}
                              </p>
                            )}
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-2 text-xs",
                                isDark ? "text-neutral-500" : "text-neutral-500"
                              )}
                            >
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(log.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        {filteredLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "mt-12 p-6 rounded-2xl border text-center",
              isDark
                ? "bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-white/5"
                : "bg-gradient-to-br from-emerald-50 to-cyan-50 border-neutral-200"
            )}
          >
            <p
              className={
                isDark ? "text-neutral-400 text-sm" : "text-neutral-600 text-sm"
              }
            >
              Showing{" "}
              <span
                className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}
              >
                {filteredLogs.length}
              </span>{" "}
              of{" "}
              <span
                className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}
              >
                {activityLogs.length}
              </span>{" "}
              total activities
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
