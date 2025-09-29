import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, Edit, Trash2, UserPlus, RefreshCw } from "lucide-react";
import { PermissionItem } from "./PermissionItem";

interface TaskPermissionsProps {
  permissions: any;
  togglePermission: (key: string) => void;
}

export const TaskPermissions = ({
  permissions,
  togglePermission,
}: TaskPermissionsProps) => {
  return (
    <Card className="!bg-none !shadow-none !border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Task Permissions</CardTitle>
        <CardDescription>
          Control what members can do with tasks in this project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PermissionItem
          id="create-tasks"
          label="Create tasks"
          description="Create new tasks in the project"
          icon={ClipboardList}
          checked={permissions.createTasks}
          onChange={() => togglePermission("createTasks")}
        />
        <PermissionItem
          id="edit-tasks"
          label="Edit tasks"
          description="Modify existing task details"
          icon={Edit}
          checked={permissions.editTasks}
          onChange={() => togglePermission("editTasks")}
        />
        <PermissionItem
          id="delete-tasks"
          label="Delete tasks"
          description="Permanently remove tasks"
          icon={Trash2}
          checked={permissions.deleteTasks}
          onChange={() => togglePermission("deleteTasks")}
        />
        <PermissionItem
          id="assign-tasks"
          label="Assign tasks"
          description="Assign tasks to team members"
          icon={UserPlus}
          checked={permissions.assignTasks}
          onChange={() => togglePermission("assignTasks")}
        />
        <PermissionItem
          id="change-task-status"
          label="Change task status"
          description="Update task progress and status"
          icon={RefreshCw}
          checked={permissions.changeTaskStatus}
          onChange={() => togglePermission("changeTaskStatus")}
        />
      </CardContent>
    </Card>
  );
};
