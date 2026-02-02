"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  format,
  parseISO,
  differenceInDays,
  isAfter,
  isBefore,
} from "date-fns";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar/avatar";
import { ProjectMember } from "@/types/project";
import BlockerHealthPill from "@/components/sprints/BlockerHealthPill";

// Sprint data from the AI planner response
interface SprintPlanData {
  _id?: string;
  sprintId?: string;
  name?: string;
  summary?: string;
  aiSummary?: string;
  status?: string;
  startDate: string;
  endDate: string;
  blockerSnapshot?: any;
  blockerHealthScore?: number | null;
  blockerStatus?: string | null;
  blockerUpdatedAt?: string | null;
  capacity?: {
    totalCapacityHours: number;
    memberCapacities: Array<{
      projectMemberId: string;
      effectiveHours: number;
    }>;
  };
  riskAnalysis?: {
    delayRiskPercent: number;
    overloadedMembers: string[];
    criticalDependencies: string[];
    deadlineThreats: string[];
  };
  selectedTasks?: Array<{
    taskId: string;
    estimatedHours: number;
    assignedTo: string;
    reason: string;
    assignedMemberDetails?: {
      projectMemberId: string;
      name: string;
      role: string;
      reliabilityScore: number;
      effectiveCapacity: number;
      currentLoad: number;
      avatar?: string | null;
    };
  }>;
  deferredTasks?: Array<{
    taskId: string;
    reason: string;
  }>;
  goals?: string[];
  totalEffort?: number;
  velocity?: number;
  predictedVelocity?: number;
  aiConfidence?: number;
  sprintRiskScore?: number;
  memberWorkloadSummary?: Array<{
    memberId: string;
    taskCount: number;
    totalEstimatedHours: number;
    totalStoryPoints: number;
  }>;
  fairnessReport?: Array<{
    projectMemberId: string;
    fairnessScore: number;
    normalizedShare: number;
    fairShareHours: number;
    plannedHours: number;
    overloadFlag: boolean;
  }>;
}

interface SprintPlanCardProps {
  sprint: SprintPlanData;
  members?: ProjectMember[];
  onClick: () => void;
}

export default function SprintPlanCard({
  sprint,
  members = [],
  onClick,
}: SprintPlanCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate sprint duration and progress
  const startDate = parseISO(sprint.startDate);
  const endDate = parseISO(sprint.endDate);
  const today = new Date();
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = Math.max(0, differenceInDays(today, startDate));
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));
  const progressPercent = Math.min(
    100,
    Math.round((daysElapsed / totalDays) * 100)
  );

  // Status determination
  const isActive = isAfter(today, startDate) && isBefore(today, endDate);
  const isCompleted = isAfter(today, endDate);
  const isPlanned = isBefore(today, startDate);
  const statusOverride = sprint.status?.toLowerCase();

  const getStatusConfig = () => {
    if (statusOverride === "completed" || isCompleted) {
      return { label: "Completed", color: "emerald", icon: CheckCircle2 };
    }
    if (statusOverride === "active" || isActive) {
      return { label: "Active", color: "blue", icon: Zap };
    }
    return { label: "Planned", color: "neutral", icon: Calendar };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  // Get unique members from selected tasks
  const assignedMemberIds = new Set(
    (sprint.selectedTasks || [])
      .map((t) => t.assignedTo || t.assignedMemberDetails?.projectMemberId)
      .filter(Boolean)
  );

  // Get member details - try from task details first, then fall back to members prop
  const getMemberDetails = (memberId: string) => {
    // Check task assignedMemberDetails first
    const taskWithMember = sprint.selectedTasks?.find(
      (t) => t.assignedMemberDetails?.projectMemberId === memberId
    );
    if (taskWithMember?.assignedMemberDetails) {
      return taskWithMember.assignedMemberDetails;
    }
    // Fall back to members prop
    return members.find((m) => m._id === memberId);
  };

  const assignedMembers = Array.from(assignedMemberIds)
    .filter((id): id is string => !!id)
    .map((id) => getMemberDetails(id))
    .filter(Boolean)
    .slice(0, 4);

  const extraMemberCount = Math.max(0, assignedMemberIds.size - 4);

  // Risk level
  const riskPercent =
    sprint.riskAnalysis?.delayRiskPercent || sprint.sprintRiskScore || 0;
  const getRiskLevel = () => {
    if (riskPercent >= 50) return { label: "High Risk", color: "rose" };
    if (riskPercent >= 25) return { label: "Medium Risk", color: "amber" };
    return { label: "Low Risk", color: "emerald" };
  };
  const risk = getRiskLevel();

  // Task counts
  const selectedCount = sprint.selectedTasks?.length || 0;
  const deferredCount = sprint.deferredTasks?.length || 0;

  // Confidence score
  const confidence = sprint.aiConfidence
    ? Math.round(sprint.aiConfidence * 100)
    : null;

  // Blocker snapshot (best-effort; may arrive async after sprint creation)
  const blockerResult =
    (sprint as any)?.blockerSnapshot?.result || (sprint as any)?.blockerSnapshot;
  const blockerScore =
    (sprint as any)?.blockerHealthScore ??
    blockerResult?.sprintHealthScore ??
    null;
  const blockerStatus = (sprint as any)?.blockerStatus ?? blockerResult?.status;
  const blockerCount = Array.isArray(blockerResult?.blockers)
    ? blockerResult.blockers.length
    : Array.isArray((sprint as any)?.blockerSnapshot?.result?.blockers)
    ? (sprint as any)?.blockerSnapshot?.result?.blockers.length
    : null;
  const blockerUpdatedAt =
    (sprint as any)?.blockerUpdatedAt ??
    (sprint as any)?.blockerSnapshot?.computedAt ??
    null;

  return (
    <div
      onClick={onClick}
      className={`group relative backdrop-blur-sm rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
        isDark
          ? "bg-neutral-900/40 border border-white/[0.06] hover:bg-neutral-900/60 hover:border-white/[0.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            status.color === "emerald"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : status.color === "blue"
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
          }`}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3
          className={`text-base font-semibold pr-24 truncate ${
            isDark ? "text-white/90" : "text-neutral-900"
          }`}
        >
          {sprint.name || sprint.sprintId}
        </h3>
        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {format(startDate, "MMM d")} — {format(endDate, "MMM d, yyyy")}
        </p>
      </div>

      {/* Summary */}
      {(sprint.summary || sprint.aiSummary) && (
        <p
          className={`text-sm line-clamp-2 mb-4 leading-relaxed ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {sprint.summary || sprint.aiSummary}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Tasks */}
        <div
          className={`rounded-xl p-3 ${
            isDark
              ? "bg-white/[0.02] border border-white/[0.04]"
              : "bg-neutral-50 border border-neutral-100"
          }`}
        >
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
            <Target className="w-3 h-3" />
            Tasks
          </div>
          <div
            className={`text-lg font-semibold ${
              isDark ? "text-white/90" : "text-neutral-900"
            }`}
          >
            {selectedCount}
            {deferredCount > 0 && (
              <span className="text-xs text-neutral-500 font-normal ml-1">
                +{deferredCount} deferred
              </span>
            )}
          </div>
        </div>

        {/* Effort */}
        <div
          className={`rounded-xl p-3 ${
            isDark
              ? "bg-white/[0.02] border border-white/[0.04]"
              : "bg-neutral-50 border border-neutral-100"
          }`}
        >
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
            <Clock className="w-3 h-3" />
            Effort
          </div>
          <div
            className={`text-lg font-semibold ${
              isDark ? "text-white/90" : "text-neutral-900"
            }`}
          >
            {sprint.totalEffort || 0}
            <span className="text-xs text-neutral-500 font-normal ml-1">
              hrs
            </span>
          </div>
        </div>

        {/* Velocity */}
        <div
          className={`rounded-xl p-3 ${
            isDark
              ? "bg-white/[0.02] border border-white/[0.04]"
              : "bg-neutral-50 border border-neutral-100"
          }`}
        >
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            Velocity
          </div>
          <div
            className={`text-lg font-semibold ${
              isDark ? "text-white/90" : "text-neutral-900"
            }`}
          >
            {sprint.velocity || sprint.predictedVelocity || 0}
          </div>
        </div>
      </div>

      {/* Progress Bar (for active sprints) */}
      {isActive && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-500">Sprint Progress</span>
            <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              {daysRemaining} days left
            </span>
          </div>
          <div
            className={`h-1.5 rounded-full overflow-hidden ${
              isDark ? "bg-white/[0.05]" : "bg-neutral-200"
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div
        className={`flex items-center justify-between pt-3 ${
          isDark
            ? "border-t border-white/[0.04]"
            : "border-t border-neutral-100"
        }`}
      >
        {/* Team Avatars */}
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {assignedMembers.map((member: any, idx) => (
              <Avatar
                key={member?.projectMemberId || member?._id || idx}
                className={`w-7 h-7 ring-0 ${
                  isDark
                    ? "border-2 border-neutral-900"
                    : "border-2 border-white"
                }`}
              >
                <AvatarImage
                  src={member?.avatar || member?.photoURL}
                  alt={member?.name || "Member"}
                />
                <AvatarFallback
                  className={`text-xs ${
                    isDark
                      ? "bg-neutral-800 text-neutral-400"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {(member?.name || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {extraMemberCount > 0 && (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isDark
                    ? "bg-neutral-800 border-2 border-neutral-900"
                    : "bg-neutral-100 border-2 border-white"
                }`}
              >
                <span
                  className={`text-xs ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  +{extraMemberCount}
                </span>
              </div>
            )}
          </div>
          {assignedMembers.length === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Users className="w-3.5 h-3.5" />
              No assignments
            </div>
          )}
        </div>

        {/* Risk & Confidence Indicators */}
        <div className="flex items-center gap-3">
          {/* Risk Badge */}
          <div
            className={`flex items-center gap-1 text-xs ${
              risk.color === "rose"
                ? "text-rose-400"
                : risk.color === "amber"
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            {Math.round(riskPercent)}%
          </div>

          {/* Blocker Health */}
          {(blockerScore !== null || blockerStatus || typeof blockerCount === "number") && (
            <BlockerHealthPill
              compact
              blockerStatus={blockerStatus}
              blockerHealthScore={typeof blockerScore === "number" ? blockerScore : null}
              blockerCount={typeof blockerCount === "number" ? blockerCount : null}
              blockerUpdatedAt={typeof blockerUpdatedAt === "string" ? blockerUpdatedAt : null}
            />
          )}

          {/* AI Confidence */}
          {confidence !== null && (
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Zap className="w-3 h-3" />
              {confidence}%
            </div>
          )}

          {/* Arrow */}
          <ChevronRight
            className={`w-4 h-4 transition-all ${
              isDark
                ? "text-neutral-600 group-hover:text-neutral-400"
                : "text-neutral-400 group-hover:text-neutral-600"
            } group-hover:translate-x-0.5`}
          />
        </div>
      </div>
    </div>
  );
}
