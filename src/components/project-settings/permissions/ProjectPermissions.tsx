import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionItem } from "./PermissionItem";
import { Settings, Calendar } from "lucide-react";

interface ProjectPermissionsProps {
  permissions: any;
  togglePermission: (key: string) => void;
}

export const ProjectPermissions = ({
  permissions,
  togglePermission,
}: ProjectPermissionsProps) => {
  return (
    <Card className="!bg-none !shadow-none !border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Project Permissions
        </CardTitle>
        <CardDescription>
          Manage project-level settings and features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PermissionItem
          id="edit-project-details"
          label="Edit project details"
          description="Modify project name, description, and settings"
          icon={Settings}
          checked={permissions.editProjectDetails}
          onChange={() => togglePermission("editProjectDetails")}
        />
        <PermissionItem
          id="manage-sprints"
          label="Manage sprints"
          description="Create, edit, and manage project sprints"
          icon={Calendar}
          checked={permissions.manageSprints}
          onChange={() => togglePermission("manageSprints")}
        />
      </CardContent>
    </Card>
  );
};
