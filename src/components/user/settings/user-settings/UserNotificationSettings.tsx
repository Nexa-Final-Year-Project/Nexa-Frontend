"use client";

import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone, Megaphone, Package, ShieldCheck } from "lucide-react";

interface UserNotificationsSettingsProps {
  notifications: {
    email: { marketing: boolean; product: boolean; security: boolean };
    push: { product: boolean; security: boolean };
  };
}

const notificationDescriptions: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
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
}: UserNotificationsSettingsProps) => {
  const onToggle = (method: "email" | "push", type: string, value: boolean) => {
    if (method === "email") {
      notifications.email[type as keyof typeof notifications.email] = value;
    }
    if (method === "push") {
      notifications.push[type as keyof typeof notifications.push] = value;
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* Email Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-white/60" />
            Email Notifications
          </h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Choose which emails you'd like to receive
        </p>

        <div className="space-y-3">
          {Object.entries(notifications.email).map(([type, value]) => {
            const info = notificationDescriptions[type];
            return (
              <div
                key={type}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${value ? "bg-blue-500/20 text-blue-400" : "bg-white/[0.06] text-white/40"}
                  `}>
                    {info?.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{info?.title}</p>
                    <p className="text-xs text-white/40">{info?.description}</p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle("email", type, v)}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Push Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-white/60" />
            Push Notifications
          </h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Get notified on your device
        </p>

        <div className="space-y-3">
          {Object.entries(notifications.push).map(([type, value]) => {
            const info = notificationDescriptions[type];
            return (
              <div
                key={type}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${value ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.06] text-white/40"}
                  `}>
                    {info?.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{info?.title}</p>
                    <p className="text-xs text-white/40">{info?.description}</p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle("push", type, v)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
