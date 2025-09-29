"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Crown, MoreVertical } from "lucide-react";
import { ReusableDropdownMenu } from "@/components/ui/dropdown/ReusableDropdownMenu";
import { ProjectMember } from "@/types/project";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";

interface TeamMemberItemProps {
  member: ProjectMember;
  onRemove?: (memberId: string) => void;
}

export const TeamMemberItem = ({ member, onRemove }: TeamMemberItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition">
      {/* 🔹 Avatar + Info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.memberId.avatar} />
          <AvatarFallback>
            {member.memberId.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{member.memberId.name}</p>
            {member.role === "owner" && (
              <Crown className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {member.memberId.email}
          </p>
        </div>
      </div>

      {/* 🔹 Role + Actions */}
      <div className="flex items-center gap-4">
        <Badge
          variant={
            member.role === "owner"
              ? "default"
              : member.role === "admin"
              ? "secondary"
              : "outline"
          }
          className="capitalize"
        >
          {member.role}
        </Badge>

        <ReusableDropdownMenu
          items={[
            {
              label: "Send message",
              Icon: <Mail className="w-4 h-4 mr-2" />,
              value: "send-message",
              onClick: () => {
                console.log("Send message to", member.memberId.email);
              },
            },
            {
              label: "Remove member",
              Icon: <Trash2 className="w-4 h-4 mr-2 text-red-500" />,
              value: "remove-member",
              onClick: () => {
                setOpen(true);
              },
            },
          ]}
          trigger={
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
          position={{ side: "top", align: "end" }}
        />
      </div>
      {open && (
        <ConfirmDialog
          title="Remove Team Member"
          description={`Are you sure you want to remove ${member.memberId.name}? This action cannot be undone.`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          variant="destructive"
          onConfirm={() => onRemove?.(member.memberId._id)}
          open={open}
          onOpenChange={setOpen}
          hideTrigger={true} // because we're using custom trigger inside Dropdown
        />
      )}
    </li>
  );
};
