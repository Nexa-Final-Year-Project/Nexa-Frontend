"use client";

import React, { useMemo } from "react";
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
      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
        <p className="text-sm">No team member data available</p>
      </div>
    );
  }

  const avgCapacityPerMember = stats.totalCapacity / stats.membersCount;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-300/70">Team Members</p>
              <p className="text-xl font-semibold text-blue-300">
                {stats.membersCount}
              </p>
            </div>
            <Users className="w-4 h-4 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-300/70">Total Tasks</p>
              <p className="text-xl font-semibold text-purple-300">
                {stats.totalTasks}
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-300/70">Team Capacity</p>
              <p className="text-xl font-semibold text-green-300">
                {stats.totalCapacity}h
              </p>
            </div>
            <Award className="w-4 h-4 text-green-400 opacity-50" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-300/70">Avg Fairness</p>
              <p className="text-xl font-semibold text-orange-300">
                {(stats.avgFairness * 100).toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-orange-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Overload Alert */}
      {stats.overloadedMembers.length > 0 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300">Workload Alert</p>
            <p className="text-xs text-red-300/70 mt-1">
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
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              {/* Member Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
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
                  <p className="text-xs text-white/50">Tasks</p>
                  <p className="text-lg font-semibold text-white">
                    {member.taskCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Hours</p>
                  <p className="text-lg font-semibold text-white">
                    {member.totalEstimatedHours}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Story Points</p>
                  <p className="text-lg font-semibold text-white">
                    {member.totalStoryPoints || 0}
                  </p>
                </div>
                {fairnessData && (
                  <div>
                    <p className="text-xs text-white/50">Fairness</p>
                    <p className="text-lg font-semibold text-white">
                      {(fairnessData.fairnessScore * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Utilization Bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-white/50">Utilization</p>
                  <p
                    className={`text-xs font-medium ${
                      isOverloaded
                        ? "text-red-400"
                        : isUnderutilized
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {utilizationRate.toFixed(0)}%
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
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
                <div className="mt-3 text-xs text-white/50 space-y-1">
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
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm font-semibold text-white mb-3">
            Workload Fairness Summary
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-white/70">Overall Fairness</p>
              <p className="text-sm font-semibold text-white">
                {(stats.avgFairness * 100).toFixed(0)}%
              </p>
            </div>

            {stats.overloadedMembers.length > 0 && (
              <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-300 font-medium">
                  Uneven Workload Distribution
                </p>
                <p className="text-xs text-yellow-300/70 mt-1">
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
