"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button/Button";
import { useGetProjectsQuery } from "@/api/project/projectApi";
import { Project } from "@/types/project";
import { useStarredProjectsStore } from "@/store/starredProjects/starredProjectsStore";
import { useAuthStore } from "@/store/auth/authStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Star,
  Search,
  Grid3X3,
  List,
  Plus,
  ArrowUpRight,
  Clock,
  Users,
  Filter,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type ViewMode = "grid" | "list";
type FilterType = "all" | "starred" | "recent" | "owned";

export default function ProjectsPage() {
  const { data: projectsData, isLoading, error } = useGetProjectsQuery({});
  const { user } = useAuthStore();
  const { isStarred, toggleStar, starredProjectIds } = useStarredProjectsStore();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Normalize projects data
  const projects: Project[] = useMemo(() => {
    if (!projectsData) return [];
    if (Array.isArray(projectsData)) return projectsData;
    if (Array.isArray((projectsData as any).projects)) return (projectsData as any).projects;
    if (Array.isArray((projectsData as any).data)) return (projectsData as any).data;
    return [];
  }, [projectsData]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case "starred":
        result = result.filter((p) => starredProjectIds.includes(p._id));
        break;
      case "recent":
        result = result
          .slice()
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 6);
        break;
      case "owned":
        result = result.filter((p) => p.owner === user?.id || p.owner === (user as any)?._id);
        break;
    }

    return result;
  }, [projects, searchQuery, activeFilter, starredProjectIds, user]);

  const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
    { key: "all", label: "All Projects", icon: Grid3X3 },
    { key: "starred", label: "Starred", icon: Star },
    { key: "recent", label: "Recent", icon: Clock },
    { key: "owned", label: "My Projects", icon: Users },
  ];

  // Get gradient based on project name
  const getProjectGradient = (name: string) => {
    const gradients = [
      { bg: "from-neutral-500/15 to-neutral-500/5", accent: "neutral" },
      { bg: "from-emerald-500/15 to-emerald-500/5", accent: "emerald" },
      { bg: "from-rose-500/15 to-rose-500/5", accent: "rose" },
      { bg: "from-blue-500/15 to-blue-500/5", accent: "blue" },
      { bg: "from-cyan-500/15 to-cyan-500/5", accent: "cyan" },
      { bg: "from-amber-500/15 to-amber-500/5", accent: "amber" },
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getAccentClass = (accent: string) => {
    const map: Record<string, string> = {
      neutral: "text-neutral-500 dark:text-neutral-400",
      emerald: "text-emerald-500 dark:text-emerald-400",
      rose: "text-rose-500 dark:text-rose-400",
      blue: "text-blue-500 dark:text-blue-400",
      cyan: "text-cyan-500 dark:text-cyan-400",
      amber: "text-amber-500 dark:text-amber-400",
    };
    return map[accent] || "text-neutral-500 dark:text-neutral-400";
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/u/projects/p/${projectId}`);
  };

  const handleStarClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    toggleStar(projectId);
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className={cn(
        "fixed inset-0 -z-20",
        isDark 
          ? "bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" 
          : "bg-gradient-to-b from-white via-neutral-50 to-white"
      )} />
      {isDark && (
        <div
          className="fixed inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 backdrop-blur-md border-b",
        isDark 
          ? "bg-neutral-900/80 border-white/5" 
          : "bg-white/80 border-neutral-200"
      )}>
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "w-12 h-12 rounded-2xl border flex items-center justify-center",
                  isDark 
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/10" 
                    : "bg-gradient-to-br from-neutral-100 to-neutral-50 border-neutral-200"
                )}>
                  <Folder className={isDark ? "w-6 h-6 text-white/70" : "w-6 h-6 text-neutral-600"} />
                </div>
                <div>
                  <h1 className={cn(
                    "text-3xl md:text-4xl font-bold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Projects
                  </h1>
                  <p className="text-neutral-500 text-sm">
                    {projects.length} total projects
                  </p>
                </div>
              </div>
            </div>
            <Link href="/u/projects">
              <Button
                variant="outline"
                className={cn(
                  "font-medium transition-all",
                  isDark 
                    ? "border-white/10 text-white hover:bg-white/[0.04] hover:border-white/20" 
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                )}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2",
                  isDark 
                    ? "bg-neutral-900/60 border-white/10 text-white placeholder-neutral-500 focus:border-white/20 focus:ring-white/10" 
                    : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-300 focus:ring-neutral-200/50"
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  viewMode === "grid"
                    ? isDark 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-neutral-900 border-neutral-800 text-white"
                    : isDark 
                      ? "bg-neutral-900/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-300"
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  viewMode === "list"
                    ? isDark 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-neutral-900 border-neutral-800 text-white"
                    : isDark 
                      ? "bg-neutral-900/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-300"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                  activeFilter === filter.key
                    ? isDark 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-neutral-900 border-neutral-800 text-white"
                    : isDark 
                      ? "bg-neutral-900/40 border-white/5 text-neutral-400 hover:text-white hover:border-white/10"
                      : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
                )}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
                {filter.key === "starred" && starredProjectIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-500 dark:text-amber-400 rounded-md">
                    {starredProjectIds.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className={cn(
              "w-10 h-10 animate-spin mb-4",
              isDark ? "text-white/60" : "text-neutral-400"
            )} />
            <p className="text-neutral-500">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-500 dark:text-red-400 text-center">
              Failed to load projects. Please try again later.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex flex-col items-center justify-center py-20 px-4 rounded-2xl border",
              isDark 
                ? "bg-neutral-900/30 border-white/5" 
                : "bg-neutral-50 border-neutral-200"
            )}
          >
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
              isDark ? "bg-white/5" : "bg-neutral-100"
            )}>
              {activeFilter === "starred" ? (
                <Star className="w-10 h-10 text-amber-400/50" />
              ) : (
                <Folder className={isDark ? "w-10 h-10 text-white/30" : "w-10 h-10 text-neutral-300"} />
              )}
            </div>
            <h3 className={cn(
              "text-xl font-semibold mb-2",
              isDark ? "text-white/80" : "text-neutral-700"
            )}>
              {searchQuery
                ? "No projects found"
                : activeFilter === "starred"
                ? "No starred projects"
                : "No projects yet"}
            </h3>
            <p className="text-neutral-500 text-center max-w-md mb-6">
              {searchQuery
                ? `No projects match "${searchQuery}". Try a different search.`
                : activeFilter === "starred"
                ? "Star your favorite projects to quickly access them here."
                : "Create your first project to get started with NEXA."}
            </p>
            {!searchQuery && activeFilter === "all" && (
              <Link href="/u/projects">
                <Button
                  variant="filled"
                  className={isDark ? "!bg-white !text-neutral-900 hover:!bg-white/90" : "!bg-neutral-900 !text-white hover:!bg-neutral-800"}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project, index) => {
                  const { bg, accent } = getProjectGradient(project.name);
                  const starred = isStarred(project._id);

                  return (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleProjectClick(project._id)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border",
                        isDark 
                          ? "bg-neutral-900/50 border-white/[0.06] hover:bg-neutral-900/70 hover:border-white/[0.1] hover:shadow-black/20" 
                          : "bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-neutral-200/50"
                      )}
                    >
                      {/* Top gradient accent */}
                      <div
                        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bg} opacity-60`}
                      />

                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg} border border-white/[0.06] flex items-center justify-center`}
                        >
                          <Folder className={`w-6 h-6 ${getAccentClass(accent)}`} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleStarClick(e, project._id)}
                            className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                              starred
                                ? "bg-amber-500/15 text-amber-400"
                                : isDark 
                                  ? "bg-transparent text-white/30 hover:text-amber-400 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100"
                                  : "bg-transparent text-neutral-300 hover:text-amber-500 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100"
                            )}
                          >
                            <Star
                              className="w-4 h-4"
                              fill={starred ? "currentColor" : "none"}
                            />
                          </button>
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-200",
                            isDark 
                              ? "text-white/30 hover:text-white hover:bg-white/5" 
                              : "text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100"
                          )}>
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className={cn(
                        "text-lg font-semibold mb-2 line-clamp-1",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {project.name}
                      </h3>
                      <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                        {project.description || "No description provided"}
                      </p>

                      {/* Footer */}
                      <div className={cn(
                        "flex items-center justify-between pt-4 border-t",
                        isDark ? "border-white/5" : "border-neutral-100"
                      )}>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Users className="w-3.5 h-3.5" />
                          <span>{project.members?.length || 0} members</span>
                        </div>
                        {project.createdAt && (
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                {filteredProjects.map((project, index) => {
                  const { bg, accent } = getProjectGradient(project.name);
                  const starred = isStarred(project._id);

                  return (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleProjectClick(project._id)}
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                        isDark 
                          ? "bg-neutral-900/50 border-white/[0.06] hover:bg-neutral-900/70 hover:border-white/[0.1]" 
                          : "bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                      )}
                    >
                      {/* Star */}
                      <button
                        onClick={(e) => handleStarClick(e, project._id)}
                        className={cn(
                          "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                          starred
                            ? "bg-amber-500/20 text-amber-400"
                            : isDark 
                              ? "bg-white/[0.04] text-white/30 hover:text-amber-400 hover:bg-amber-500/10"
                              : "bg-neutral-100 text-neutral-300 hover:text-amber-500 hover:bg-amber-500/10"
                        )}
                      >
                        <Star
                          className="w-4 h-4"
                          fill={starred ? "currentColor" : "none"}
                        />
                      </button>

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Folder className={`w-5 h-5 ${getAccentClass(accent)}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium truncate",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {project.name}
                        </h3>
                        <p className="text-sm text-neutral-500 truncate">
                          {project.description || "No description"}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="hidden sm:flex items-center gap-6 text-sm text-neutral-500">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{project.members?.length || 0}</span>
                        </div>
                        {project.createdAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight className={cn(
                        "w-5 h-5 transition-colors",
                        isDark 
                          ? "text-white/30 group-hover:text-white/60" 
                          : "text-neutral-300 group-hover:text-neutral-500"
                      )} />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Stats Footer */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "mt-12 p-6 rounded-2xl border",
              isDark 
                ? "bg-neutral-900/30 border-white/5" 
                : "bg-neutral-50 border-neutral-200"
            )}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Folder,
                  value: projects.length,
                  label: "Total Projects",
                  color: isDark ? "text-white/60" : "text-neutral-500",
                },
                {
                  icon: Star,
                  value: starredProjectIds.length,
                  label: "Starred",
                  color: "text-amber-500",
                },
                {
                  icon: Users,
                  value: projects.reduce((acc, p) => acc + (p.members?.length || 0), 0),
                  label: "Total Members",
                  color: "text-emerald-500",
                },
                {
                  icon: TrendingUp,
                  value: projects.filter(
                    (p) =>
                      new Date(p.createdAt || 0) >
                      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length,
                  label: "This Month",
                  color: "text-cyan-500",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <div className={cn(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>{stat.value}</div>
                  <div className="text-xs text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
