"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project, ProjectMember } from "@/types/project";
import {
  TeamSettingsHeader,
  TeamSearchAndInvite,
  TeamMemberList,
  InviteMemberModal,
} from "@/components/project-settings/team";

interface TeamSettingsProps {
  project: Project;
  members: ProjectMember[];
}

export const TeamSettings = ({ project, members }: TeamSettingsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false);

  const filteredMembers =
    members?.filter(
      (member: any) =>
        member.memberId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.memberId.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <>
      <Card className="!bg-none !shadow-none !border-0">
        <CardHeader className="space-y-1 border-b pb-6">
          <TeamSettingsHeader />
          <TeamSearchAndInvite
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onInviteClick={() => setInviteMemberModalOpen(true)}
          />
        </CardHeader>

        <CardContent className="p-0">
          <TeamMemberList
            members={filteredMembers}
            projectId={project._id}
            searchQuery={searchQuery}
            onInviteClick={() => setInviteMemberModalOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {inviteMemberModalOpen && (
        <InviteMemberModal
          projectId={project._id}
          open={inviteMemberModalOpen}
          onClose={() => setInviteMemberModalOpen(false)}
        />
      )}
    </>
  );
};
