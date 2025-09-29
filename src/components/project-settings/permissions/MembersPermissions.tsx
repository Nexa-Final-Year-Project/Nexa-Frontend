import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionItem } from "./PermissionItem";
import { UserPlus, UserMinus, Users } from "lucide-react";

interface MemberPermissionsProps {
  permissions: any;
  togglePermission: (key: string) => void;
}

export const MemberPermissions = ({
  permissions,
  togglePermission,
}: MemberPermissionsProps) => {
  return (
    <Card className="!bg-none !shadow-none !border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Team Management</CardTitle>
        <CardDescription>
          Control team member management capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PermissionItem
          id="invite-members"
          label="Invite members"
          description="Add new members to the project"
          icon={UserPlus}
          checked={permissions.inviteMembers}
          onChange={() => togglePermission("inviteMembers")}
        />
        <PermissionItem
          id="remove-members"
          label="Remove members"
          description="Remove members from the project"
          icon={UserMinus}
          checked={permissions.removeMembers}
          onChange={() => togglePermission("removeMembers")}
        />
        <PermissionItem
          id="edit-member-roles"
          label="Edit member roles"
          description="Change roles and permissions of team members"
          icon={Users}
          checked={permissions.editMemberRoles}
          onChange={() => togglePermission("editMemberRoles")}
        />
      </CardContent>
    </Card>
  );
};
