"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Monitor, Bell } from "lucide-react";

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
  const themeOptions = [
    {
      label: "Light",
      value: "light",
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      description: "Bright and clean interface",
    },
    {
      label: "Dark",
      value: "dark",
      icon: <Moon className="w-5 h-5 text-gray-800" />,
      description: "Dark mode for low-light environments",
    },
    {
      label: "System",
      value: "system",
      icon: <Monitor className="w-5 h-5 text-blue-500" />,
      description: "Follows your device preference",
    },
  ];

  return (
    <Card className="!border-0 !shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold">Preferences</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Customize your app appearance and notifications.
        </p>
      </CardHeader>

      <CardContent className="space-y-10">
        {/* Theme Selector */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-yellow-500" /> Theme
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {themeOptions.map((option) => {
              const isActive = preferences.theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onThemeChange(option.value)}
                  className={`flex flex-col items-start gap-1 p-4 rounded-lg border transition cursor-pointer
                    ${
                      isActive
                        ? "border-blue-600 bg-blue-50 shadow"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="font-medium text-gray-900">
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-500" /> Notifications
          </h3>
          <div className="flex flex-col gap-3">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition shadow-sm"
              >
                <div>
                  <span className="capitalize font-medium text-gray-900">
                    {key} Notifications
                  </span>
                  <p className="text-xs text-gray-500">
                    {key === "email"
                      ? "Receive notifications via email"
                      : "Receive push notifications on your device"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onNotificationToggle(key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
