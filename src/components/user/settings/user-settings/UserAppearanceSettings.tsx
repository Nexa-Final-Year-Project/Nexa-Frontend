"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Check,
  Mail,
  Smartphone,
} from "lucide-react";

interface UserPreferencesSettingsProps {
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: { email: boolean; push: boolean };
  };
  onThemeChange: (theme: "light" | "dark" | "system") => void;
  onNotificationToggle: (field: string, value: boolean) => void;
}

export const UserPreferencesSettings = ({
  preferences,
  onThemeChange,
  onNotificationToggle,
}: UserPreferencesSettingsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeOptions = [
    {
      label: "Light",
      value: "light" as const,
      icon: <Sun className="w-5 h-5" />,
      description: "Bright & clean interface",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      label: "Dark",
      value: "dark" as const,
      icon: <Moon className="w-5 h-5" />,
      description: "Easy on the eyes",
      gradient: "from-indigo-400 to-purple-500",
    },
    {
      label: "System",
      value: "system" as const,
      icon: <Monitor className="w-5 h-5" />,
      description: "Follows device settings",
      gradient: "from-blue-400 to-cyan-500",
    },
  ];

  const notificationOptions = [
    {
      key: "email",
      label: "Email Notifications",
      description: "Receive updates via email",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      key: "push",
      label: "Push Notifications",
      description: "Get instant notifications",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ];

  return (
    <div className={`p-8 space-y-10 ${isDark ? "" : ""}`}>
      {/* Theme Selector Section */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-600" />
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Appearance
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-600"
          }`}
        >
          Customize how the app looks on your device
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const isActive = preferences.theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onThemeChange(option.value)}
                className={`
                  group relative p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer border-2
                  ${
                    isActive
                      ? isDark
                        ? "bg-white/[0.08] border-white/[0.15]"
                        : "bg-neutral-100 border-neutral-400"
                      : isDark
                      ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                      : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
                  }
                `}
              >
                {/* Check indicator */}
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
                  ${
                    isActive
                      ? `bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                      : isDark
                      ? "bg-white/[0.06] text-white/50 group-hover:text-white/70"
                      : "bg-neutral-200 text-neutral-600 group-hover:text-neutral-700"
                  }
                `}
                >
                  {option.icon}
                </div>

                <h3
                  className={`font-semibold mb-1 transition-colors ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-neutral-900"
                      : isDark
                      ? "text-white/70"
                      : "text-neutral-600"
                  }`}
                >
                  {option.label}
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-white/40" : "text-neutral-600"
                  }`}
                >
                  {option.description}
                </p>
              </button>
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

      {/* Notifications Section */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Notifications
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-600"
          }`}
        >
          Choose how you want to be notified
        </p>

        <div className="space-y-3">
          {notificationOptions.map((option) => {
            const value =
              preferences.notifications[
                option.key as keyof typeof preferences.notifications
              ];
            return (
              <div
                key={option.key}
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
                    {option.icon}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {option.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/40" : "text-neutral-600"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onNotificationToggle(option.key, v)}
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
