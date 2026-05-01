"use client";

import React, { useState } from "react";
import { LucideSearch, Sliders, X, Sparkles } from "lucide-react";
import { TeamMemberAvatar } from "@/components/teams/TeamMemberAvatar";
import { ProjectMember } from "@/types/project";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="sticky top-0 z-50 flex flex-col px-2 sm:px-4 py-3 gap-4">
      {/* Main Controls Row */}
      <div
        className={`
        flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between
        border backdrop-blur-xl rounded-2xl px-3 sm:px-4 py-3
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        ${
          isDark
            ? "bg-neutral-900/60 border-white/[0.06]"
            : "bg-white border-neutral-200"
        }
      `}
      >
        {/* Search and Members */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-grow group">
            <LucideSearch
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                isDark
                  ? "text-white/40 group-focus-within:text-violet-400"
                  : "text-neutral-500 group-focus-within:text-violet-600"
              }`}
            />
            <input
              type="search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`
                w-full rounded-xl border
                py-2.5 pl-11 pr-4 text-sm
                transition-all duration-300 outline-none
                ${
                  isDark
                    ? "bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
                }
              `}
            />
            {/* Search Glow */}
            {isDark && (
              <div className="absolute inset-0 rounded-xl bg-violet-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
          </div>

          {/* Team Members - Hidden on small screens */}
          <div className="hidden md:flex items-center">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member, index) => (
                <div
                  key={`${member?._id || index}-${member?.memberId?._id || 'unknown'}`}
                  className="relative group/avatar"
                >
                  <div
                    className={`
                    ring-2 rounded-full
                    transition-transform duration-200
                    group-hover/avatar:scale-110 group-hover/avatar:z-10
                    cursor-pointer
                    ${isDark ? "ring-neutral-900" : "ring-white"}
                  `}
                  >
                    <TeamMemberAvatar
                      name={member?.memberId?.name}
                      avatarUrl={member?.memberId?.avatar}
                      role={member?.role}
                    />
                  </div>
                </div>
              ))}
              {members.length > 4 && (
                <div
                  className={`
                  w-8 h-8 rounded-full border-2
                  flex items-center justify-center
                  text-xs font-medium
                  cursor-pointer transition-colors duration-200
                  ${
                    isDark
                      ? "bg-white/[0.08] border-neutral-900 text-white/60 hover:bg-white/[0.12]"
                      : "bg-neutral-200 border-white text-neutral-600 hover:bg-neutral-300"
                  }
                `}
                >
                  +{members.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={onOpenFilters}
          aria-label="Open filters"
          className={`
            relative flex items-center justify-center sm:justify-start gap-2 cursor-pointer
            px-4 sm:px-5 py-2.5 rounded-xl
            border text-sm font-medium
            transition-all duration-300 group
            ${
              isDark
                ? "bg-gradient-to-r from-violet-600/20 to-cyan-600/10 border-violet-500/30 text-white hover:from-violet-600/30 hover:to-cyan-600/20 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                : "bg-gradient-to-r from-violet-100 to-cyan-50 border-violet-300 text-violet-700 hover:from-violet-200 hover:to-cyan-100 hover:border-violet-400"
            }
          `}
        >
          <Sliders
            size={16}
            className={`${
              isDark ? "text-violet-400" : "text-violet-600"
            } group-hover:rotate-180 transition-transform duration-500`}
          />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="
              absolute -right-2 -top-2
              flex h-5 w-5 items-center justify-center
              rounded-full text-[10px] font-bold
              bg-gradient-to-r from-rose-500 to-orange-500
              text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]
              animate-pulse
            "
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filters Row */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span
            className={`text-xs font-medium mr-1 ${
              isDark ? "text-white/40" : "text-neutral-500"
            }`}
          >
            Active:
          </span>
          {activeFilters.map(({ label, value }) => (
            <div
              key={value}
              className={`
                flex items-center gap-2
                border rounded-lg px-3 py-1.5
                text-xs font-medium
                group/filter cursor-pointer
                transition-all duration-200
                ${
                  isDark
                    ? "bg-gradient-to-r from-violet-500/15 to-cyan-500/10 border-violet-500/30 text-white/80 hover:border-violet-500/50"
                    : "bg-violet-50 border-violet-300 text-violet-700 hover:border-violet-400"
                }
              `}
            >
              <Sparkles
                className={`w-3 h-3 ${
                  isDark ? "text-violet-400" : "text-violet-600"
                }`}
              />
              <span>{label}</span>
              <button
                onClick={() => onRemoveFilter(value)}
                className={`
                  w-4 h-4 rounded-full
                  flex items-center justify-center
                  transition-colors duration-200 cursor-pointer
                  ${
                    isDark
                      ? "text-white/40 hover:text-white hover:bg-white/10"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200"
                  }
                `}
                aria-label={`Remove filter ${label}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <button
            onClick={onClearFilters}
            className={`
              ml-auto px-3 py-1.5 rounded-lg
              text-xs font-medium border
              transition-all duration-200 cursor-pointer
              ${
                isDark
                  ? "text-white/50 bg-white/[0.03] border-white/[0.06] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400"
                  : "text-neutral-600 bg-white border-neutral-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600"
              }
            `}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
