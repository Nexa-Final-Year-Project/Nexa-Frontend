"use client";

import React, { useState } from "react";
import {
  Bell,
  ExternalLink,
  Trash2,
  Check,
  BellOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useDeleteNotification,
  useMarkAllAsRead,
} from "@/store/notifications/notificationStore";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar/avatar";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationsDropdown = () => {
  const notifications = useNotifications();
  const unreadCount = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();
  const markAllAsRead = useMarkAllAsRead();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Filter unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setOpen(false);
    }
  };

  const handleViewAll = () => {
    router.push("/notifications");
    setOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/[0.04] text-white/60 hover:text-white transition-all duration-200"
          title="Notifications"
        >
          <motion.div
            animate={
              unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}
            }
            transition={{
              duration: 0.5,
              delay: 1,
              repeat: Infinity,
              repeatDelay: 5,
            }}
          >
            <Bell className="h-5 w-5" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] p-0 mr-4 bg-neutral-900/95 backdrop-blur-xl border-white/[0.08] shadow-2xl shadow-black/40"
        align="end"
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col max-h-[480px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-white/40">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    onClick={() => markAllAsRead()}
                    title="Mark all as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  onClick={handleViewAll}
                  title="View all notifications"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {unreadNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                  <BellOff className="h-8 w-8 text-white/20" />
                </div>
                <p className="text-sm font-medium text-white/50 mb-1">
                  All caught up!
                </p>
                <p className="text-xs text-white/30">No unread notifications</p>
              </motion.div>
            ) : (
              <div className="py-2">
                <AnimatePresence>
                  {unreadNotifications.map((notification, index) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group px-3 py-0.5"
                    >
                      <div
                        className="flex gap-3 p-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-all duration-200 relative overflow-hidden"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Unread indicator */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-violet-600 rounded-r-full" />

                        {/* Avatar */}
                        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white/[0.06]">
                          <AvatarImage
                            src={notification.avatarUrl}
                            alt={notification.senderName}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-300 text-xs font-medium">
                            {getInitials(notification.senderName)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="font-medium text-sm text-white group-hover:text-violet-300 transition-colors">
                              {notification.title}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 flex items-center justify-center flex-shrink-0 rounded-md text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>
                          <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-white/30 mt-2 font-medium">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-white/[0.06]">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all"
              onClick={handleViewAll}
            >
              <Sparkles className="w-3.5 h-3.5" />
              View all notifications
            </motion.button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};
