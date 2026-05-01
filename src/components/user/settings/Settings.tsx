"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ChevronRight, Settings } from "lucide-react";
import toast from "@/lib/customToast";

import {
  UserSettingsSidebar,
  UserGeneralSettings as GeneralSettings,
  UserAppearanceSettings as UserPreferencesSettings,
  UserSecuritySettings,
  NotificationSettings,
  DataControlsSettings,
} from "./user-settings";
import { User } from "@/types/auth";
import { useAuthStore } from "@/store/auth/authStore";
import DangerZoneSettings from "./user-settings/DangerZoneSettings";

interface UserSettingsProps {
  user: User | null;
}

const UserSettings = ({ user }: UserSettingsProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState("general");
  const [activeCategory, setActiveCategory] = useState("Profile");
  const { updateUser } = useAuthStore();
  const [notifications, setNotifications] = useState({
    email: { marketing: true, product: true, security: true },
    push: { product: false, security: true },
  });

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("userNotifications");
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (e) {
        // Use defaults if parsing fails
      }
    } else if (user?.notifications) {
      setNotifications(user.notifications);
    }
  }, [user?.notifications]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div
          className={`text-lg ${isDark ? "text-white/40" : "text-neutral-500"}`}
        >
          User not found
        </div>
      </div>
    );
  }

  const initialValues = {
    name: user.name,
    email: user.email,
    avatar: user.photoURL || "",
    theme: user.theme || "system",
    notifications: user.notifications || { email: true, push: false },
    twoFactorEnabled: user.twoFactorEnabled || false,
    loginAlerts: (user as any).loginAlerts || false,
  };

  const sectionCategories: Record<string, string> = {
    general: "Profile",
    appearance: "Profile",
    security: "Account",
    notifications: "Account",
    activity: "Account",
    "delete-account": "Danger Zone",
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setActiveCategory(sectionCategories[sectionId] || "Profile");
  };

  const handleUpdateUser = async (values: Record<string, any>) => {
    try {
      await updateUser(user.uid, values);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleThemeChange = async (nextTheme: "light" | "dark" | "system") => {
    setTheme(nextTheme);
    await handleUpdateUser({ theme: nextTheme });
  };

  const handleNotificationChange = async (
    updatedNotifications: typeof notifications,
  ) => {
    setNotifications(updatedNotifications);
    // Save to localStorage
    localStorage.setItem(
      "userNotifications",
      JSON.stringify(updatedNotifications),
    );
    // Save to user store
    try {
      await updateUser(user?.uid!, { notifications: updatedNotifications });
      toast.success("Notifications updated!");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            user={user}
            onSubmit={handleUpdateUser}
            initialValues={initialValues}
          />
        );
      case "appearance":
        return (
          <UserPreferencesSettings
            preferences={{
              theme: initialValues.theme,
              notifications: initialValues.notifications,
            }}
            onThemeChange={handleThemeChange}
            onNotificationToggle={(key, value) =>
              handleUpdateUser({
                notifications: { ...initialValues.notifications, [key]: value },
              })
            }
          />
        );
      case "security":
        return (
          <UserSecuritySettings
            security={{
              twoFactor: initialValues.twoFactorEnabled,
              loginAlerts: initialValues.loginAlerts,
            }}
            onToggle={(field, value) => handleUpdateUser({ [field]: value })}
          />
        );
      case "notifications":
        return (
          <NotificationSettings
            notifications={notifications}
            onNotificationsChange={handleNotificationChange}
          />
        );
      case "data-controls":
        return <DataControlsSettings />;
      case "delete-account":
        return <DangerZoneSettings />;
      default:
        return (
          <GeneralSettings
            user={user}
            onSubmit={handleUpdateUser}
            initialValues={initialValues}
          />
        );
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-2xl backdrop-blur-sm ${
              isDark
                ? "bg-neutral-900/60 border border-white/[0.06]"
                : "bg-neutral-100 border border-neutral-200"
            }`}
          >
            <Settings
              className={`w-6 h-6 ${
                isDark ? "text-white/80" : "text-neutral-700"
              }`}
            />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Settings
            </h1>
            <div
              className={`flex items-center text-sm mt-1 ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            >
              <span
                className={`cursor-pointer transition-colors ${
                  isDark ? "hover:text-white/60" : "hover:text-neutral-700"
                }`}
              >
                {activeCategory}
              </span>
              <ChevronRight
                className={`w-3.5 h-3.5 mx-1.5 ${
                  isDark ? "text-white/20" : "text-neutral-400"
                }`}
              />
              <span
                className={`capitalize ${
                  isDark ? "text-white/60" : "text-neutral-700"
                }`}
              >
                {activeSection.replace(/-/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <UserSettingsSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          setActiveCategory={setActiveCategory}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div
            className={`rounded-2xl backdrop-blur-sm overflow-hidden ${
              isDark
                ? "bg-neutral-900/40 border border-white/[0.06]"
                : "bg-white border border-neutral-200"
            }`}
          >
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
