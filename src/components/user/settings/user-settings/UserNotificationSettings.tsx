"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Mail,
  Smartphone,
  Megaphone,
  Package,
  ShieldCheck,
} from "lucide-react";

interface UserNotificationsSettingsProps {
  notifications: {
    email: { marketing: boolean; product: boolean; security: boolean };
    push: { product: boolean; security: boolean };
  };
  onNotificationsChange?: (
    notifications: UserNotificationsSettingsProps["notifications"],
  ) => Promise<void>;
}

const notificationDescriptions: Record<
  string,
  { title: string; description: string; icon: React.ReactNode }
> = {
  marketing: {
    title: "Marketing",
    description: "Promotions, newsletters, and updates",
    icon: <Megaphone className="w-5 h-5" />,
  },
  product: {
    title: "Product Updates",
    description: "New features and improvements",
    icon: <Package className="w-5 h-5" />,
  },
  security: {
    title: "Security",
    description: "Critical security alerts",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
};

export const UserNotificationSettings = ({
  notifications,
  onNotificationsChange,
}: UserNotificationsSettingsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentNotifications, setCurrentNotifications] =
    useState(notifications);

  useEffect(() => {
    setCurrentNotifications(notifications);
  }, [notifications]);

  const onToggle = async (
    method: "email" | "push",
    type: string,
    value: boolean,
  ) => {
    const next = {
      email: { ...currentNotifications.email },
      push: { ...currentNotifications.push },
    };

    if (method === "email") {
      next.email[type as keyof typeof next.email] = value;
    }
    if (method === "push") {
      next.push[type as keyof typeof next.push] = value;
    }

    setCurrentNotifications(next);
    // Call the callback if provided
    if (onNotificationsChange) {
      await onNotificationsChange(next);
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* Email Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <Mail
              className={`w-5 h-5 ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            />
            Email Notifications
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-600"
          }`}
        >
          Choose which emails you'd like to receive
        </p>

        <div className="space-y-3">
          {Object.entries(currentNotifications.email).map(([type, value]) => {
            const info = notificationDescriptions[type];
            return (
              <div
                key={type}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${
                      value
                        ? isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                        : isDark
                          ? "bg-white/[0.06] text-white/40"
                          : "bg-neutral-200 text-neutral-500"
                    }
                  `}
                  >
                    {info?.icon}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {info?.title}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/40" : "text-neutral-600"
                      }`}
                    >
                      {info?.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle("email", type, v)}
                  className={`data-[state=checked]:${
                    isDark ? "bg-blue-500" : "bg-blue-600"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div
        className={`h-px bg-gradient-to-r from-transparent via-${
          isDark ? "white/[0.08]" : "neutral-300"
        } to-transparent`}
      />

      {/* Push Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <Smartphone
              className={`w-5 h-5 ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            />
            Push Notifications
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-600"
          }`}
        >
          Get notified on your device
        </p>

        <div className="space-y-3">
          {Object.entries(currentNotifications.push).map(([type, value]) => {
            const info = notificationDescriptions[type];
            return (
              <div
                key={type}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${
                      value
                        ? isDark
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-emerald-100 text-emerald-600"
                        : isDark
                          ? "bg-white/[0.06] text-white/40"
                          : "bg-neutral-200 text-neutral-500"
                    }
                  `}
                  >
                    {info?.icon}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {info?.title}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/40" : "text-neutral-600"
                      }`}
                    >
                      {info?.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle("push", type, v)}
                  className={`data-[state=checked]:${
                    isDark ? "bg-emerald-500" : "bg-emerald-600"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
