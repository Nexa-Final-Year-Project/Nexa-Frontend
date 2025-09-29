"use client";

import { CardTitle, CardDescription } from "@/components/ui/card";

export const TeamSettingsHeader = () => {
  return (
    <div className="space-y-1 text-left">
      <CardTitle className="text-2xl font-bold">Team Management</CardTitle>
      <CardDescription>Manage who has access to this project</CardDescription>
    </div>
  );
};
