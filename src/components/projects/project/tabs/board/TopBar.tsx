"use client";

import React, { useState } from "react";
import { LucideSearch, Sliders } from "lucide-react";
import { TeamMemberAvatar } from "@/components/teams/TeamMemberAvatar";
import { ProjectMember } from "@/types/project";

interface TopBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  activeFilters: { label: string; value: string }[];
  onRemoveFilter: (value: string) => void;
  onClearFilters: () => void;
  members: ProjectMember[];
}

export const TopBar: React.FC<TopBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  members,
}) => {
  return (
    <div className="sticky top-0 z-50 flex flex-col !bg-transparent px-5 py-2 gap-3">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow max-w-lg">
            <LucideSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="Search tasks"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-primary py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>
          <div className="flex items-center gap-2">
            {members.map((member) => (
              <TeamMemberAvatar
                name={member?.memberId?.name}
                avatarUrl={member?.memberId?.avatar}
                key={member?.memberId?._id}
                role={member?.role}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onOpenFilters}
          aria-label="Open filters"
          className="relative flex cursor-pointer items-center gap-2 rounded-full border border-primary bg-transparent px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          <Sliders size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(({ label, value }) => (
            <div
              key={value}
              className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary"
            >
              <span>{label}</span>
              <button
                onClick={() => onRemoveFilter(value)}
                className="hover:text-primary-foreground focus:outline-none"
                aria-label={`Remove filter ${label}`}
              >
                &times;
              </button>
            </div>
          ))}

          <button
            onClick={onClearFilters}
            className="ml-auto rounded-md bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted/80"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
