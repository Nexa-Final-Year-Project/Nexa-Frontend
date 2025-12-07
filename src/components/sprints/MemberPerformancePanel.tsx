"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import { Users, BarChart3, TrendingUp, AlertCircle, Award } from "lucide-react";

interface MemberWorkload {
  memberId: string;
  taskCount: number;
  totalEstimatedHours: number;
  totalStoryPoints?: number;
}

interface FairnessReportItem {
  projectMemberId: string;
  fairnessScore: number;
  normalizedShare: number;
  fairShareHours: number;
  plannedHours: number;
  overloadFlag: boolean;
}

interface MemberPerformanceProps {
  memberWorkloadSummary?: MemberWorkload[];
  fairnessReport?: FairnessReportItem[];
  selectedTasks?: Array<{
    assignedTo: string;
    assignedMemberDetails?: {
      name: string;
      reliabilityScore: number;
      avatar?: string | null;
    };
  }>;
  capacity?: {
    totalCapacityHours: number;
    memberCapacities: Array<{
      projectMemberId: string;
      effectiveHours: number;
    }>;
  };
}

const MemberPerformancePanel: React.FC<MemberPerformanceProps> = ({
  memberWorkloadSummary = [],
  fairnessReport = [],
  selectedTasks = [],
  capacity,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = useMemo(() => {
    if (!memberWorkloadSummary.length) return null;

    const totalTasks = memberWorkloadSummary.reduce(
      (sum, m) => sum + m.taskCount,
      0
    );
    const totalHours = memberWorkloadSummary.reduce(
      (sum, m) => sum + m.totalEstimatedHours,
      0
    );
    const totalCapacity = capacity?.totalCapacityHours || totalHours;
    const membersCount = memberWorkloadSummary.length;

    const avgFairness =
      fairnessReport.length > 0
        ? fairnessReport.reduce((sum, m) => sum + m.fairnessScore, 0) /
          fairnessReport.length
        : 1;

    const overloadedMembers = fairnessReport.filter((m) => m.overloadFlag);

    return {
      totalTasks,
      totalHours,
      totalCapacity,
      avgFairness,
      overloadedMembers,
      membersCount,
    };
  }, [memberWorkloadSummary, fairnessReport, capacity]);

  if (!memberWorkloadSummary.length || !stats) {
    return (
      <div
        className={`p-6 rounded-lg border flex items-center justify-center ${
          isDark
            ? "bg-white/5 border-white/10 text-white/60"
            : "bg-neutral-100 border-neutral-200 text-neutral-600"
        }`}
      >
        <p className="text-sm">No team member data available</p>
      </div>
    );
  }

  const avgCapacityPerMember = stats.totalCapacity / stats.membersCount;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div
          className={`p-3 rounded-lg ${
            isDark
              ? "bg-blue-500/10 border border-blue-500/20"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-blue-300/70" : "text-blue-600"
                }`}
              >
                Team Members
              </p>
              <p
                className={`text-xl font-semibold ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}
              >
                {stats.membersCount}
              </p>
            </div>
            <Users
              className={`w-4 h-4 opacity-50 ${
                isDark ? "text-blue-400" : "text-blue-500"
              }`}
            />
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isDark
              ? "bg-purple-500/10 border border-purple-500/20"
              : "bg-purple-50 border border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-purple-300/70" : "text-purple-600"
                }`}
              >
                Total Tasks
              </p>
              <p
                className={`text-xl font-semibold ${
                  isDark ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {stats.totalTasks}
              </p>
            </div>
            <BarChart3
              className={`w-4 h-4 opacity-50 ${
                isDark ? "text-purple-400" : "text-purple-500"
              }`}
            />
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isDark
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-green-300/70" : "text-green-600"
                }`}
              >
                Team Capacity
              </p>
              <p
                className={`text-xl font-semibold ${
                  isDark ? "text-green-300" : "text-green-700"
                }`}
              >
                {stats.totalCapacity}h
              </p>
            </div>
            <Award
              className={`w-4 h-4 opacity-50 ${
                isDark ? "text-green-400" : "text-green-500"
              }`}
            />
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isDark
              ? "bg-orange-500/10 border border-orange-500/20"
              : "bg-orange-50 border border-orange-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-orange-300/70" : "text-orange-600"
                }`}
              >
                Avg Fairness
              </p>
              <p
                className={`text-xl font-semibold ${
                  isDark ? "text-orange-300" : "text-orange-700"
                }`}
              >
                {(stats.avgFairness * 100).toFixed(0)}%
              </p>
            </div>
            <TrendingUp
              className={`w-4 h-4 opacity-50 ${
                isDark ? "text-orange-400" : "text-orange-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Overload Alert */}
      {stats.overloadedMembers.length > 0 && (
        <div
          className={`p-3 rounded-lg border flex items-start gap-3 ${
            isDark
              ? "bg-red-500/10 border-red-500/20"
              : "bg-red-50 border-red-200"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-red-300" : "text-red-700"
              }`}
            >
              Workload Alert
            </p>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-red-300/70" : "text-red-600"
              }`}
            >
              {stats.overloadedMembers.length} member
              {stats.overloadedMembers.length !== 1 ? "s" : ""} have uneven
              workload distribution
            </p>
          </div>
        </div>
      )}

      {/* Member Cards */}
      <div className="space-y-3">
        {memberWorkloadSummary.map((member) => {
          const fairnessData = fairnessReport.find(
            (f) => f.projectMemberId === member.memberId
          );
          const utilizationRate =
            (member.totalEstimatedHours / avgCapacityPerMember) * 100;
          const isOverloaded =
            fairnessData?.overloadFlag || utilizationRate > 120;
          const isUnderutilized = utilizationRate < 60;

          return (
            <div
              key={member.memberId}
              className={`p-4 rounded-lg border transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-white/20"
                  : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* Member Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Member {member.memberId.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isOverloaded && (
                    <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      Overloaded
                    </span>
                  )}
                  {isUnderutilized && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      Underutilized
                    </span>
                  )}
                  {!isOverloaded && !isUnderutilized && (
                    <span className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-300 border border-green-500/30">
                      Balanced
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/50" : "text-neutral-600"
                    }`}
                  >
                    Tasks
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {member.taskCount}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/50" : "text-neutral-600"
                    }`}
                  >
                    Hours
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {member.totalEstimatedHours}h
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/50" : "text-neutral-600"
                    }`}
                  >
                    Story Points
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {member.totalStoryPoints || 0}
                  </p>
                </div>
                {fairnessData && (
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/50" : "text-neutral-600"
                      }`}
                    >
                      Fairness
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {(fairnessData.fairnessScore * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Utilization Bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/50" : "text-neutral-600"
                    }`}
                  >
                    Utilization
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      isOverloaded
                        ? isDark
                          ? "text-red-400"
                          : "text-red-600"
                        : isUnderutilized
                        ? isDark
                          ? "text-yellow-400"
                          : "text-yellow-600"
                        : isDark
                        ? "text-green-400"
                        : "text-green-600"
                    }`}
                  >
                    {utilizationRate.toFixed(0)}%
                  </p>
                </div>
                <div
                  className={`w-full h-2 rounded-full overflow-hidden ${
                    isDark ? "bg-white/10" : "bg-neutral-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverloaded
                        ? "bg-red-500"
                        : isUnderutilized
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Fairness Details */}
              {fairnessData && (
                <div
                  className={`mt-3 text-xs space-y-1 ${
                    isDark ? "text-white/50" : "text-neutral-600"
                  }`}
                >
                  <p>
                    Fair Share: {fairnessData.fairShareHours.toFixed(1)}h |
                    Planned: {fairnessData.plannedHours.toFixed(1)}h
                  </p>
                  <p>
                    Normalized Share:{" "}
                    {(fairnessData.normalizedShare * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fairness Summary */}
      {fairnessReport.length > 0 && (
        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <p
            className={`text-sm font-semibold mb-3 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Workload Fairness Summary
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p
                className={`text-xs ${
                  isDark ? "text-white/70" : "text-neutral-600"
                }`}
              >
                Overall Fairness
              </p>
              <p
                className={`text-sm font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {(stats.avgFairness * 100).toFixed(0)}%
              </p>
            </div>

            {stats.overloadedMembers.length > 0 && (
              <div
                className={`mt-3 p-2 rounded border ${
                  isDark
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-yellow-300" : "text-yellow-700"
                  }`}
                >
                  Uneven Workload Distribution
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-yellow-300/70" : "text-yellow-600"
                  }`}
                >
                  Consider rebalancing for better team fairness and morale
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPerformancePanel;
