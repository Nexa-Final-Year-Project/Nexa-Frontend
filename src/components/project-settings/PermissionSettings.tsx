"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save } from "lucide-react";
import {
  MemberPermissions,
  ProjectPermissions,
  TaskPermissions,
} from "./permissions";

type PermissionState = {
  createTasks: boolean;
  editTasks: boolean;
  deleteTasks: boolean;
  assignTasks: boolean;
  changeTaskStatus: boolean;
  editProjectDetails: boolean;
  manageSprints: boolean;
  inviteMembers: boolean;
  removeMembers: boolean;
  editMemberRoles: boolean;
};

const DEFAULT_PERMISSIONS: PermissionState = {
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
};

export const PermissionsSettings = ({
  tab,
  projectId,
}: {
  tab: string;
  projectId: string;
}) => {
  const storageKey = `nexa-project-permissions:${projectId}`;
  const [permissions, setPermissions] =
    useState<PermissionState>(DEFAULT_PERMISSIONS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPermissions({ ...DEFAULT_PERMISSIONS, ...JSON.parse(stored) });
      }
    } catch {
      setPermissions(DEFAULT_PERMISSIONS);
    }
  }, [storageKey]);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetPermissions = () => {
    setPermissions(DEFAULT_PERMISSIONS);
    localStorage.removeItem(storageKey);
  };

  const savePermissions = () => {
    localStorage.setItem(storageKey, JSON.stringify(permissions));
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
