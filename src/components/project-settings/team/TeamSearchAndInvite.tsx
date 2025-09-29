"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeamSearchAndInviteProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onInviteClick: () => void;
}

export const TeamSearchAndInvite = ({
  searchQuery,
  setSearchQuery,
  onInviteClick,
}: TeamSearchAndInviteProps) => {
  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="relative flex-1 md:flex-none">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search team members..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button className="shrink-0" onClick={onInviteClick}>
        <Plus className="w-4 h-4 mr-2" />
        Invite
      </Button>
    </div>
  );
};
