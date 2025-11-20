"use client";

import React, { useState } from "react";
import { Trash2, CheckCheck, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useNotifications,
  useMarkAsRead,
  useDeleteNotification,
  useMarkAllAsRead,
} from "@/store/notifications/notificationStore";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar/avatar";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const notifications = useNotifications();
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();
  const markAllAsRead = useMarkAllAsRead();
  const router = useRouter();
  const [filterRead, setFilterRead] = useState(false);

  // Filter notifications based on filter state
  const displayedNotifications = filterRead
    ? notifications
    : notifications.filter((n) => !n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notificationDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Section - centered with glass */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Notifications
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with your activities and mentions
          </p>
        </div>

        {/* Centered Stats */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
            <div className="rounded-2xl p-4 backdrop-blur-sm bg-white/5 dark:bg-slate-900/40 border border-white/10 shadow-inner">
              <p className="text-sm text-muted-foreground font-medium">
                Unread
              </p>
              <p className="text-3xl font-bold text-blue-400 mt-2">
                {unreadCount}
              </p>
            </div>
            <div className="rounded-2xl p-4 backdrop-blur-sm bg-white/5 dark:bg-slate-900/30 border border-white/6">
              <p className="text-sm text-muted-foreground font-medium">Total</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        {/* Controls - centered */}
        <div className="flex justify-center items-center mb-7 gap-4">
          <div className="flex gap-2">
            <Button
              variant={!filterRead ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRead(false)}
              className={
                !filterRead
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                  : ""
              }
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filterRead ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRead(true)}
              className={
                filterRead
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                  : ""
              }
            >
              All ({notifications.length})
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              className="gap-2 hover:bg-muted transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List - centered column */}
        <div className="mx-auto max-w-3xl space-y-4">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground font-medium">
                {filterRead
                  ? "No notifications yet"
                  : "No unread notifications"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filterRead
                  ? "Your notifications will appear here"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group ${
                  !notification.read
                    ? "bg-gradient-to-r from-blue-50/80 to-blue-50/40 dark:from-blue-950/40 dark:to-blue-950/20 border-l-4 border-blue-500 shadow-md"
                    : "border border-muted hover:border-muted-foreground/20"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-4 items-start">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-blue-200 dark:border-blue-900/50 shadow-sm">
                      <AvatarImage
                        src={notification.avatarUrl}
                        alt={notification.senderName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {getInitials(notification.senderName)}
                      </AvatarFallback>
                    </Avatar>
                    {!notification.read && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2.5 font-medium">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
