"use client";
import UserSettings from "@/components/user/settings/Settings";
import { useAuthStore } from "@/store/auth/authStore";
import React from "react";

const SettingsPage = () => {
  const { user } = useAuthStore();
  return <UserSettings user={user} />;
};

export default SettingsPage;
