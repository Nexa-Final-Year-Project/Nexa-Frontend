"use client";

import { useState } from "react";
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
  const [activeSection, setActiveSection] = useState("general");
  const [activeCategory, setActiveCategory] = useState("Profile");
  const { updateUser } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white/40 text-lg">User not found</div>
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
            onThemeChange={(theme) => handleUpdateUser({ theme })}
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
              loginAlerts: true,
            }}
            onToggle={(field, value) => handleUpdateUser({ [field]: value })}
          />
        );
      case "notifications":
        return (
          <NotificationSettings
            notifications={{
              email: { marketing: true, product: true, security: true },
              push: { product: false, security: true },
            }}
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
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900/60 border border-white/[0.06] backdrop-blur-sm">
            <Settings className="w-6 h-6 text-white/80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="flex items-center text-sm text-white/40 mt-1">
              <span className="hover:text-white/60 cursor-pointer transition-colors">
                {activeCategory}
              </span>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-white/20" />
              <span className="text-white/60 capitalize">
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
          <div className="rounded-2xl bg-neutral-900/40 dark:bg-neutral-900/40 border border-white/[0.06] backdrop-blur-sm overflow-hidden">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
