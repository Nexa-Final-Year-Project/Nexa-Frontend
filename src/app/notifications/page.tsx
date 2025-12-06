"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  ArrowLeft,
  Filter,
  Search,
  Clock,
  User,
  MessageSquare,
  AlertCircle,
  GitBranch,
  Zap,
  Settings,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  useNotifications,
  useMarkAsRead,
  useDeleteNotification,
  useMarkAllAsRead,
} from "@/store/notifications/notificationStore";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/shared/sidebar/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, scale: 0.95, x: -20, transition: { duration: 0.3 } },
};

// Notification type icons and colors
const typeIcons: Record<string, React.ElementType> = {
  task: CheckCheck,
  message: MessageSquare,
  alert: AlertCircle,
  update: GitBranch,
  mention: User,
  system: Zap,
  default: Bell,
};

const typeColors: Record<string, { dark: string; light: string }> = {
  task: {
    dark: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    light: "from-emerald-50 to-white border-emerald-200",
  },
  message: {
    dark: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    light: "from-cyan-50 to-white border-cyan-200",
  },
  alert: {
    dark: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    light: "from-amber-50 to-white border-amber-200",
  },
  update: {
    dark: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
    light: "from-violet-50 to-white border-violet-200",
  },
  mention: {
    dark: "from-pink-500/20 to-pink-500/5 border-pink-500/20",
    light: "from-pink-50 to-white border-pink-200",
  },
  system: {
    dark: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    light: "from-blue-50 to-white border-blue-200",
  },
  default: {
    dark: "from-white/10 to-white/5 border-white/10",
    light: "from-neutral-50 to-white border-neutral-200",
  },
};

const typeIconColors: Record<string, { dark: string; light: string }> = {
  task: { dark: "text-emerald-400", light: "text-emerald-600" },
  message: { dark: "text-cyan-400", light: "text-cyan-600" },
  alert: { dark: "text-amber-400", light: "text-amber-600" },
  update: { dark: "text-violet-400", light: "text-violet-600" },
  mention: { dark: "text-pink-400", light: "text-pink-600" },
  system: { dark: "text-blue-400", light: "text-blue-600" },
  default: { dark: "text-white/60", light: "text-neutral-500" },
};

export default function NotificationsPage() {
  const notifications = useNotifications();
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();
  const markAllAsRead = useMarkAllAsRead();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const getType = (notification: any) =>
    notification.type || notification.category || "default";

  const getTypeColor = (type: string) => {
    const colors = typeColors[type] || typeColors.default;
    return isDark ? colors.dark : colors.light;
  };

  const getTypeIconColor = (type: string) => {
    const colors = typeIconColors[type] || typeIconColors.default;
    return isDark ? colors.dark : colors.light;
  };

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];
    if (filter === "unread") result = result.filter((n) => !n.read);
    if (selectedType !== "all")
      result = result.filter((n) => getType(n) === selectedType);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(query) ||
          n.message?.toLowerCase().includes(query) ||
          n.senderName?.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [notifications, filter, selectedType, searchQuery, sortBy]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, typeof filteredNotifications> = {};
    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) key = "Today";
      else if (date.toDateString() === yesterday.toDateString())
        key = "Yesterday";
      else if (date > new Date(today.setDate(today.getDate() - 7)))
        key = "This Week";
      else key = "Earlier";

      if (!groups[key]) groups[key] = [];
      groups[key].push(notification);
    });
    return groups;
  }, [filteredNotifications]);

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return notificationDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) markAsRead(notification._id);
    if (notification.actionUrl) router.push(notification.actionUrl);
  };

  const notificationTypes = [
    "all",
    "task",
    "message",
    "alert",
    "update",
    "mention",
    "system",
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={cn(isDark ? "bg-[#0a0a0f]" : "bg-neutral-50")}>
        <div className="min-h-screen">
          {/* Background Effects */}
          {isDark && (
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
            </div>
          )}

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "sticky top-0 z-20 backdrop-blur-xl border-b",
              isDark
                ? "bg-[#0a0a0f]/80 border-white/[0.04]"
                : "bg-white/80 border-neutral-200"
            )}
          >
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.back()}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all",
                      isDark
                        ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]"
                        : "bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                    )}
                  >
                    <ArrowLeft
                      className={cn(
                        "h-5 w-5",
                        isDark ? "text-white/70" : "text-neutral-600"
                      )}
                    />
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={unreadCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn(
                        "relative p-3 rounded-2xl bg-gradient-to-br border",
                        isDark
                          ? "from-emerald-500/20 to-cyan-500/10 border-emerald-500/20"
                          : "from-emerald-50 to-cyan-50 border-emerald-200"
                      )}
                    >
                      <Bell
                        className={cn(
                          "h-6 w-6",
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        )}
                      />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold"
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </motion.span>
                      )}
                    </motion.div>
                    <div>
                      <h1
                        className={cn(
                          "text-2xl font-bold",
                          isDark ? "text-white" : "text-neutral-900"
                        )}
                      >
                        Notifications
                      </h1>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-white/40" : "text-neutral-500"
                        )}
                      >
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${
                              unreadCount > 1 ? "s" : ""
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => markAllAsRead()}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2",
                        isDark
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                      )}
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Mark all read</span>
                    </motion.button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "p-2.5 rounded-xl border transition-all",
                          isDark
                            ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                            : "bg-white border-neutral-200 hover:bg-neutral-50"
                        )}
                      >
                        <Settings
                          className={cn(
                            "w-4 h-4",
                            isDark ? "text-white/60" : "text-neutral-500"
                          )}
                        />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className={cn(
                        "w-48 backdrop-blur-xl",
                        isDark
                          ? "bg-neutral-900/95 border-white/[0.08]"
                          : "bg-white border-neutral-200"
                      )}
                    >
                      <DropdownMenuItem
                        className={cn(
                          "cursor-pointer",
                          isDark
                            ? "text-white/70 hover:text-white hover:bg-white/[0.06]"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                        )}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notification Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator
                        className={
                          isDark ? "bg-white/[0.06]" : "bg-neutral-200"
                        }
                      />
                      <DropdownMenuItem
                        className={cn(
                          "cursor-pointer",
                          isDark
                            ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        )}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                      isDark ? "text-white/30" : "text-neutral-400"
                    )}
                  />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none",
                      isDark
                        ? "bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/30 focus:border-emerald-500/50"
                        : "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500"
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "flex rounded-xl border p-1",
                    isDark
                      ? "bg-white/[0.03] border-white/[0.06]"
                      : "bg-white border-neutral-200"
                  )}
                >
                  <button
                    onClick={() => setFilter("all")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      filter === "all"
                        ? isDark
                          ? "bg-white/[0.08] text-white"
                          : "bg-neutral-100 text-neutral-900"
                        : isDark
                        ? "text-white/50 hover:text-white/70"
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      filter === "unread"
                        ? isDark
                          ? "bg-white/[0.08] text-white"
                          : "bg-neutral-100 text-neutral-900"
                        : isDark
                        ? "text-white/50 hover:text-white/70"
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-xs rounded-md",
                          isDark
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-emerald-100 text-emerald-600"
                        )}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all",
                        isDark
                          ? "bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06]"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      <Filter className="w-4 h-4" />
                      <span className="capitalize">
                        {selectedType === "all" ? "All Types" : selectedType}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className={cn(
                      "backdrop-blur-xl",
                      isDark
                        ? "bg-neutral-900/95 border-white/[0.08]"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    {notificationTypes.map((type) => {
                      const IconComponent =
                        type === "all" ? Sparkles : typeIcons[type] || Bell;
                      return (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={cn(
                            "cursor-pointer",
                            selectedType === type
                              ? isDark
                                ? "text-white bg-white/[0.06]"
                                : "text-neutral-900 bg-neutral-100"
                              : isDark
                              ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                          )}
                        >
                          <IconComponent
                            className={`w-4 h-4 mr-2 ${
                              type !== "all" ? getTypeIconColor(type) : ""
                            }`}
                          />
                          <span className="capitalize">
                            {type === "all" ? "All Types" : type}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all",
                        isDark
                          ? "bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06]"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{sortBy === "newest" ? "Newest" : "Oldest"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className={cn(
                      "backdrop-blur-xl",
                      isDark
                        ? "bg-neutral-900/95 border-white/[0.08]"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    <DropdownMenuItem
                      onClick={() => setSortBy("newest")}
                      className={cn(
                        "cursor-pointer",
                        sortBy === "newest"
                          ? isDark
                            ? "text-white bg-white/[0.06]"
                            : "text-neutral-900 bg-neutral-100"
                          : isDark
                          ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                      )}
                    >
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("oldest")}
                      className={cn(
                        "cursor-pointer",
                        sortBy === "oldest"
                          ? isDark
                            ? "text-white bg-white/[0.06]"
                            : "text-neutral-900 bg-neutral-100"
                          : isDark
                          ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                      )}
                    >
                      Oldest First
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative mb-6"
                  >
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full blur-2xl",
                        isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
                      )}
                    />
                    <div
                      className={cn(
                        "relative p-6 rounded-3xl border bg-gradient-to-br",
                        isDark
                          ? "from-white/[0.06] to-white/[0.02] border-white/[0.08]"
                          : "from-neutral-100 to-white border-neutral-200"
                      )}
                    >
                      <Bell
                        className={cn(
                          "h-12 w-12",
                          isDark ? "text-white/20" : "text-neutral-300"
                        )}
                      />
                    </div>
                  </motion.div>
                  <h3
                    className={cn(
                      "text-xl font-semibold mb-2",
                      isDark ? "text-white/80" : "text-neutral-900"
                    )}
                  >
                    {filter === "unread"
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </h3>
                  <p
                    className={cn(
                      "text-sm text-center max-w-sm",
                      isDark ? "text-white/40" : "text-neutral-500"
                    )}
                  >
                    {filter === "unread"
                      ? "You've read all your notifications. Great job!"
                      : "When you get notifications, they'll show up here."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  {Object.entries(groupedNotifications).map(
                    ([group, groupNotifications]) => (
                      <div key={group}>
                        <motion.div
                          variants={itemVariants}
                          className="flex items-center gap-3 mb-4"
                        >
                          <h2
                            className={cn(
                              "text-sm font-semibold uppercase tracking-wider",
                              isDark ? "text-white/50" : "text-neutral-500"
                            )}
                          >
                            {group}
                          </h2>
                          <div
                            className={cn(
                              "flex-1 h-px bg-gradient-to-r",
                              isDark
                                ? "from-white/[0.08] to-transparent"
                                : "from-neutral-200 to-transparent"
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs",
                              isDark ? "text-white/30" : "text-neutral-400"
                            )}
                          >
                            {groupNotifications.length}
                          </span>
                        </motion.div>

                        <div className="space-y-3">
                          <AnimatePresence mode="popLayout">
                            {groupNotifications.map((notification) => {
                              const type = getType(notification);
                              const IconComponent =
                                typeIcons[type] || typeIcons.default;
                              const colorClass = getTypeColor(type);
                              const iconColor = getTypeIconColor(type);

                              return (
                                <motion.div
                                  key={notification._id}
                                  variants={itemVariants}
                                  exit="exit"
                                  layout
                                  onClick={() =>
                                    handleNotificationClick(notification)
                                  }
                                  className={cn(
                                    "group relative rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden bg-gradient-to-r",
                                    !notification.read
                                      ? colorClass +
                                          (isDark
                                            ? " hover:border-emerald-500/40"
                                            : " hover:border-emerald-300")
                                      : isDark
                                      ? "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08]"
                                      : "bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                                  )}
                                >
                                  {!notification.read && (
                                    <motion.div
                                      layoutId={`unread-${notification._id}`}
                                      className={cn(
                                        "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
                                        isDark
                                          ? "from-emerald-400 to-cyan-400"
                                          : "from-emerald-500 to-cyan-500"
                                      )}
                                    />
                                  )}

                                  <div className="flex items-start gap-4 p-5">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      className={cn(
                                        "relative flex-shrink-0 p-3 rounded-xl bg-gradient-to-br",
                                        colorClass
                                      )}
                                    >
                                      <IconComponent
                                        className={`h-5 w-5 ${iconColor}`}
                                      />
                                    </motion.div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                          <p
                                            className={cn(
                                              "text-sm font-medium",
                                              !notification.read
                                                ? isDark
                                                  ? "text-white"
                                                  : "text-neutral-900"
                                                : isDark
                                                ? "text-white/80"
                                                : "text-neutral-700"
                                            )}
                                          >
                                            {notification.title}
                                          </p>
                                          <p
                                            className={cn(
                                              "text-sm mt-1 line-clamp-2",
                                              isDark
                                                ? "text-white/50"
                                                : "text-neutral-500"
                                            )}
                                          >
                                            {notification.message}
                                          </p>
                                          {notification.senderName && (
                                            <div className="flex items-center gap-2 mt-2">
                                              <div
                                                className={cn(
                                                  "w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br",
                                                  isDark
                                                    ? "from-emerald-500/30 to-cyan-500/20"
                                                    : "from-emerald-100 to-cyan-100"
                                                )}
                                              >
                                                <span
                                                  className={cn(
                                                    "text-[10px] font-medium",
                                                    isDark
                                                      ? "text-white/70"
                                                      : "text-neutral-700"
                                                  )}
                                                >
                                                  {getInitials(
                                                    notification.senderName
                                                  )}
                                                </span>
                                              </div>
                                              <span
                                                className={cn(
                                                  "text-xs",
                                                  isDark
                                                    ? "text-white/40"
                                                    : "text-neutral-500"
                                                )}
                                              >
                                                {notification.senderName}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                          <span
                                            className={cn(
                                              "text-xs flex items-center gap-1",
                                              isDark
                                                ? "text-white/30"
                                                : "text-neutral-400"
                                            )}
                                          >
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(
                                              notification.createdAt
                                            )}
                                          </span>

                                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.read && (
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  markAsRead(notification._id);
                                                }}
                                                className={cn(
                                                  "p-2 rounded-lg transition-all",
                                                  isDark
                                                    ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                                    : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                                                )}
                                              >
                                                <Check className="w-3.5 h-3.5" />
                                              </motion.button>
                                            )}
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(
                                                  notification._id
                                                );
                                              }}
                                              className={cn(
                                                "p-2 rounded-lg transition-all",
                                                isDark
                                                  ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                                                  : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                                              )}
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </motion.button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <motion.div
                                    className={cn(
                                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r",
                                      isDark
                                        ? "from-emerald-500/5 to-cyan-500/5"
                                        : "from-emerald-500/5 to-cyan-500/5"
                                    )}
                                  />
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {filteredNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={cn(
                  "mt-12 pt-6 border-t",
                  isDark ? "border-white/[0.04]" : "border-neutral-200"
                )}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={cn(
                      "p-4 rounded-xl border text-center",
                      isDark
                        ? "bg-white/[0.02] border-white/[0.04]"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        isDark ? "text-white" : "text-neutral-900"
                      )}
                    >
                      {notifications.length}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isDark ? "text-white/40" : "text-neutral-500"
                      )}
                    >
                      Total
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-4 rounded-xl border text-center",
                      isDark
                        ? "bg-white/[0.02] border-white/[0.04]"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      )}
                    >
                      {unreadCount}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isDark ? "text-white/40" : "text-neutral-500"
                      )}
                    >
                      Unread
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-4 rounded-xl border text-center",
                      isDark
                        ? "bg-white/[0.02] border-white/[0.04]"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        isDark ? "text-cyan-400" : "text-cyan-600"
                      )}
                    >
                      {notifications.length - unreadCount}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isDark ? "text-white/40" : "text-neutral-500"
                      )}
                    >
                      Read
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
