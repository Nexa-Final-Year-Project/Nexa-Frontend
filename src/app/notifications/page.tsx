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
    <div className="min-h-screen bg-slate-950/60 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header - compact */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
              <Bell className="h-5 w-5 text-slate-200" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Notifications</h1>
              <p className="text-xs text-slate-400">A concise activity feed — click to open</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-300">Unread: <span className="font-medium text-slate-100">{unreadCount}</span></div>
            <button onClick={() => setFilterRead(false)} className={`px-2 py-1 rounded-md text-sm ${!filterRead ? 'bg-slate-800 text-slate-100' : 'bg-transparent text-slate-300 border border-slate-700'}`}>Unread</button>
            <button onClick={() => setFilterRead(true)} className={`px-2 py-1 rounded-md text-sm ${filterRead ? 'bg-slate-800 text-slate-100' : 'bg-transparent text-slate-300 border border-slate-700'}`}>All</button>
            {unreadCount > 0 && (
              <button onClick={() => markAllAsRead()} className="px-2 py-1 rounded-md text-sm text-slate-300 border border-slate-700">Mark all</button>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <div className="p-3 bg-slate-900/40 rounded-full mb-3">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-lg font-medium">{filterRead ? 'No notifications yet' : 'No unread notifications'}</p>
              <p className="text-sm mt-1 text-slate-400">{filterRead ? 'Your notifications will appear here' : "You're all caught up!"}</p>
            </div>
          ) : (
            <div className="divide-y rounded-lg bg-slate-900/70 border border-slate-700 overflow-hidden">
              {displayedNotifications.map((notification) => (
                <div key={notification._id} onClick={() => handleNotificationClick(notification)} className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition ${!notification.read ? 'bg-slate-900/60 border-l-4 border-slate-400' : 'hover:bg-slate-900/50'}`}>
                  <div className="relative flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-200 text-sm font-semibold">{getInitials(notification.senderName)}</div>
                    {!notification.read && <div className="absolute -top-1 -right-1 h-2 w-2 bg-slate-200 rounded-full border-2 border-slate-900" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-slate-100' : 'text-slate-100'}`}>{notification.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{notification.message}</p>
                      </div>
                      <div className="text-xxs text-slate-500 ml-2">{formatTimeAgo(notification.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.read && <button onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }} className="px-2 py-1 text-xs rounded-md text-slate-100 bg-slate-800">Mark</button>}
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }} className="px-2 py-1 text-xs rounded-md text-slate-300 border border-slate-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
