"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save } from "lucide-react";
import {
  MemberPermissions,
  ProjectPermissions,
  TaskPermissions,
} from "./permissions";

export const PermissionsSettings = ({ tab }: { tab: string }) => {
  const [permissions, setPermissions] = useState({
    // Task permissions (most relevant)
    createTasks: true,
    editTasks: true,
    deleteTasks: false,
    assignTasks: true,
    changeTaskStatus: true,

    // Project permissions
    editProjectDetails: false,
    manageSprints: false,

    // Member permissions
    inviteMembers: false,
    removeMembers: false,
    editMemberRoles: false,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetPermissions = () => {
    setPermissions({
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      changeTaskStatus: true,
      editProjectDetails: false,
      manageSprints: false,
      inviteMembers: false,
      removeMembers: false,
      editMemberRoles: false,
    });
  };

  const savePermissions = () => {
    console.log("Saved permissions:", permissions);
    // API call to persist changes
  };

  return (
    <div className="space-y-6 text-left">
      {tab === "tasks" && (
        <TaskPermissions
          permissions={permissions}
          togglePermission={togglePermission}
        />
      )}
      {tab === "project" && (
        <ProjectPermissions
          permissions={permissions}
          togglePermission={togglePermission}
        />
      )}
      {tab === "access" && (
        <MemberPermissions
          permissions={permissions}
          togglePermission={togglePermission}
        />
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline" onClick={resetPermissions}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={savePermissions}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
