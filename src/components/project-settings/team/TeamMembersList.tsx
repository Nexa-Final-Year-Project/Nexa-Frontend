"use client";

import { ProjectMember } from "@/types/project";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMemberItem } from "./TeamMemberItem";
import { useDeleteProjectMemberMutation } from "@/api/project/member/memberApi";

interface TeamMemberListProps {
  members: ProjectMember[];
  projectId: string;
  searchQuery: string;
  onInviteClick: () => void;
}

export const TeamMemberList = ({
  members,
  projectId,
  searchQuery,
  onInviteClick,
}: TeamMemberListProps) => {
  const [deleteProjectMember] = useDeleteProjectMemberMutation();
  if (!members.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="w-14 h-14 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg mb-2">
          No team members found
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {searchQuery
            ? "Try a different search term"
            : "Get started by inviting your first team member"}
        </p>
        <Button onClick={onInviteClick}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Team Members
        </Button>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {members.map((member: any) => (
        <TeamMemberItem
          key={member.memberId._id}
          member={member}
          onRemove={() => deleteProjectMember({ projectId, memberId: member.memberId._id })}
        />
      ))}
    </ul>
  );
};
