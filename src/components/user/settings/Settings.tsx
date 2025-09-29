"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
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

  if (!user) return <div>User not found</div>;

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
      // return <div className="p-6">Activity Logs Coming Soon...</div>;
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
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <span className="text-foreground font-bold text-2xl">Settings</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="hover:text-foreground cursor-pointer">
          {activeCategory}
        </span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium capitalize">
          {activeSection.replace(/-/g, " ")}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <UserSettingsSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          setActiveCategory={setActiveCategory}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-background rounded-lg border-l px-6">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
