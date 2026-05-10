"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  format,
  parseISO,
  differenceInDays,
  isAfter,
  isBefore,
} from "date-fns";
import {
  X,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
  BarChart3,
  Shield,
  ListTodo,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  Flame,
  Award,
  Scale,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar/avatar";
import { ProjectMember } from "@/types/project";
import BurndownChart from "@/components/sprints/BurndownChart";
import RiskMitigationPanel from "@/components/sprints/RiskMitigationPanel";
import MemberPerformancePanel from "@/components/sprints/MemberPerformancePanel";
import BlockerHealthPill from "@/components/sprints/BlockerHealthPill";
import BlockerHistoryChart from "@/components/sprints/BlockerHistoryChart";
import { useAuthStore } from "@/store/auth/authStore";
import axios from "axios";
import toast from "@/lib/customToast";

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
  project?: string;
  plannedBy?: string;
  assignmentStrategy?: string;
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
  recommendations?: string[];
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
      fairShareHours?: number;
      fairnessScore?: number;
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
  blockerSnapshot?: any;
  blockerHealthScore?: number | null;
  blockerStatus?: string | null;
  blockerUpdatedAt?: string | null;
  burndownForecast?: Array<{
    date: string;
    remainingHours: number;
  }>;
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

interface SprintDetailModalProps {
  open: boolean;
  onClose: () => void;
  sprint: SprintPlanData | null;
  members?: ProjectMember[];
}

export default function SprintDetailModal({
  open,
  onClose,
  sprint,
  members = [],
}: SprintDetailModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview", "tasks", "team", "blockers"])
  );
  const [isRefreshingBlockers, setIsRefreshingBlockers] = useState(false);
  const [localBlockerData, setLocalBlockerData] = useState<any>(null);
  const autoScanCalledRef = useRef(false);

  // Auto-trigger blocker scan when modal opens and no snapshot exists yet
  useEffect(() => {
    if (!open || !sprint?._id) return;
    if (sprint.blockerSnapshot || localBlockerData) return;
    if (autoScanCalledRef.current) return;

    const currentMember = members.find((m: any) => {
      const email = m.email ?? m.memberId?.email;
      const userId = m.memberId?._id?.toString() ?? m.memberId?.toString();
      return (
        email === user?.email ||
        userId === (user as any)?._id?.toString()
      );
    });
    const isPM = (currentMember as any)?.role === "Project-Manager";
    if (!isPM) return;

    autoScanCalledRef.current = true;
    setIsRefreshingBlockers(true);

    const token = localStorage.getItem("authToken");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sprint/${sprint._id}/blockers/refresh`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      )
      .then((res) => {
        if (res.data.success) setLocalBlockerData(res.data.blocker);
      })
      .catch((err) => {
        console.error("Auto blocker scan failed:", err);
      })
      .finally(() => {
        setIsRefreshingBlockers(false);
      });
  }, [open, sprint?._id, sprint?.blockerSnapshot]);

  // Reset auto-scan flag when a different sprint is opened
  useEffect(() => {
    autoScanCalledRef.current = false;
    setLocalBlockerData(null);
  }, [sprint?._id]);

  if (!open || !sprint) return null;

  // Check if current user is a Project Manager.
  // The members array may come in two shapes depending on whether the backend
  // populates the nested memberId or flattens it, so we check both.
  const currentUserMember = members.find((m: any) => {
    const email = m.email ?? m.memberId?.email;
    const userId = m.memberId?._id?.toString() ?? m.memberId?.toString();
    return (
      email === user?.email ||
      userId === (user as any)?._id?.toString()
    );
  });
  const isProjectManager = (currentUserMember as any)?.role === "Project-Manager";

  // Handle manual blocker refresh
  const handleRefreshBlockers = async () => {
    if (!sprint._id || !isProjectManager) return;
    
    setIsRefreshingBlockers(true);
    toast("Blocker scan started", {
      description:
        "The blocker agent may take up to 90 s on a cold start — please wait…",
    });
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sprint/${sprint._id}/blockers/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Match the backend's 120 s socket timeout
          timeout: 120000,
        }
      );

      if (response.data.success) {
        setLocalBlockerData(response.data.blocker);
        toast.success("Blocker scan complete", {
          description: "Latest blocker analysis is now available",
        });
      }
    } catch (error: any) {
      console.error("Failed to refresh blocker scan:", error);
      toast.error("Blocker scan failed", {
        description:
          error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "The blocker agent timed out — it may still be starting up. Try again in a moment."
            : "Please try again later"),
      });
    } finally {
      setIsRefreshingBlockers(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Calculate sprint info
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

  const isActive = isAfter(today, startDate) && isBefore(today, endDate);
  const isCompleted = isAfter(today, endDate);
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

  // Risk calculations
  const riskPercent =
    sprint.riskAnalysis?.delayRiskPercent || sprint.sprintRiskScore || 0;
  const getRiskConfig = () => {
    if (riskPercent >= 50)
      return {
        label: "High Risk",
        color: "rose",
        bg: isDark ? "bg-rose-500/10" : "bg-red-50",
        border: isDark ? "border-rose-500/20" : "border-red-200",
        text: isDark ? "text-rose-400" : "text-red-600",
      };
    if (riskPercent >= 25)
      return {
        label: "Medium Risk",
        color: "amber",
        bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
        border: isDark ? "border-amber-500/20" : "border-amber-200",
        text: isDark ? "text-amber-400" : "text-amber-600",
      };
    return {
      label: "Low Risk",
      color: "emerald",
      bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
      border: isDark ? "border-emerald-500/20" : "border-emerald-200",
      text: isDark ? "text-emerald-400" : "text-emerald-600",
    };
  };
  const risk = getRiskConfig();

  // Task counts
  const selectedCount = sprint.selectedTasks?.length || 0;
  const deferredCount = sprint.deferredTasks?.length || 0;

  // Get member details
  const getMemberDetails = (memberId: string) => {
    const taskWithMember = sprint.selectedTasks?.find(
      (t) =>
        t.assignedMemberDetails?.projectMemberId === memberId ||
        t.assignedTo === memberId
    );
    if (taskWithMember?.assignedMemberDetails) {
      return taskWithMember.assignedMemberDetails;
    }
    const memberFromCapacity = sprint.capacity?.memberCapacities.find(
      (m) => m.projectMemberId === memberId
    );
    const memberFromFairness = sprint.fairnessReport?.find(
      (m) => m.projectMemberId === memberId
    );
    const memberFromWorkload = sprint.memberWorkloadSummary?.find(
      (m) => m.memberId === memberId
    );
    const memberFromProps = members.find((m) => m._id === memberId);

    return {
      projectMemberId: memberId,
      name: memberFromProps?.name || "Unknown",
      role: memberFromProps?.role || "member",
      avatar: memberFromProps?.avatar,
      effectiveCapacity: memberFromCapacity?.effectiveHours || 0,
      fairShareHours: memberFromFairness?.fairShareHours || 0,
      fairnessScore: memberFromFairness?.fairnessScore || 1,
      plannedHours:
        memberFromFairness?.plannedHours ||
        memberFromWorkload?.totalEstimatedHours ||
        0,
      taskCount: memberFromWorkload?.taskCount || 0,
      overloadFlag: memberFromFairness?.overloadFlag || false,
    };
  };

  // Collect all unique member IDs
  const allMemberIds = new Set<string>();
  sprint.capacity?.memberCapacities.forEach((m) =>
    allMemberIds.add(m.projectMemberId)
  );
  sprint.fairnessReport?.forEach((m) => allMemberIds.add(m.projectMemberId));
  sprint.memberWorkloadSummary?.forEach((m) => allMemberIds.add(m.memberId));
  sprint.selectedTasks?.forEach((t) => {
    if (t.assignedTo) allMemberIds.add(t.assignedTo);
    if (t.assignedMemberDetails?.projectMemberId)
      allMemberIds.add(t.assignedMemberDetails.projectMemberId);
  });

  const allMembers = Array.from(allMemberIds).map(getMemberDetails);

  // Confidence
  const confidence = sprint.aiConfidence
    ? Math.round(sprint.aiConfidence * 100)
    : null;

  // Blocker snapshot (best-effort; may arrive async after sprint creation)
  // Use local data if available (from manual refresh), otherwise use sprint data
  const blockerData = localBlockerData || sprint;
  const blockerResult =
    (blockerData as any)?.blockerSnapshot?.result || (blockerData as any)?.blockerSnapshot;
  const blockerScore =
    (blockerData as any)?.blockerHealthScore ??
    blockerResult?.sprintHealthScore ??
    null;
  const blockerStatus = (blockerData as any)?.blockerStatus ?? blockerResult?.status;
  const blockerUpdatedAt =
    (blockerData as any)?.blockerUpdatedAt ??
    (blockerData as any)?.blockerSnapshot?.computedAt ??
    null;
  const blockerCount = Array.isArray(blockerResult?.blockers)
    ? blockerResult.blockers.length
    : null;
  const blockerSummary: string | null =
    (blockerResult?.aiSummary as string) ||
    (blockerResult?.summary as string) ||
    null;
  const blockerActions: string[] = Array.isArray(blockerResult?.actionPlan)
    ? blockerResult.actionPlan
    : Array.isArray(blockerResult?.actions)
    ? blockerResult.actions
    : [];
  const blockersList: any[] = Array.isArray(blockerResult?.blockers)
    ? blockerResult.blockers
    : [];

  // Section Header Component
  const SectionHeader = ({
    id,
    icon: Icon,
    title,
    badge,
  }: {
    id: string;
    icon: any;
    title: string;
    badge?: React.ReactNode;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-3 px-1 text-left group"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-neutral-500" />
        <span
          className={`text-sm font-medium ${
            isDark ? "text-white/90" : "text-neutral-900"
          }`}
        >
          {title}
        </span>
        {badge}
      </div>
      {expandedSections.has(id) ? (
        <ChevronUp className="w-4 h-4 text-neutral-500" />
      ) : (
        <ChevronDown className="w-4 h-4 text-neutral-500" />
      )}
    </button>
  );

  // Mini Burndown Chart
  const MiniBurndownChart = () => {
    const forecast = sprint.burndownForecast || [];
    if (forecast.length < 2) return null;

    const maxHours = Math.max(...forecast.map((f) => f.remainingHours));
    const width = 100;
    const height = 60;

    const points = forecast
      .map((f, i) => {
        const x = (i / (forecast.length - 1)) * width;
        const y = height - (f.remainingHours / maxHours) * height;
        return `${x},${y}`;
      })
      .join(" ");

    // Ideal burndown line
    const idealPoints = `0,0 ${width},${height}`;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
          {/* Ideal line */}
          <polyline
            points={idealPoints}
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          {/* Actual/forecast line */}
          <polyline
            points={points}
            fill="none"
            stroke={isDark ? "rgba(59,130,246,0.8)" : "rgba(37,99,235,0.8)"}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Gradient fill */}
          <defs>
            <linearGradient
              id="burndownGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={
                  isDark ? "rgba(59,130,246,0.2)" : "rgba(37,99,235,0.15)"
                }
              />
              <stop
                offset="100%"
                stopColor={isDark ? "rgba(59,130,246,0)" : "rgba(37,99,235,0)"}
              />
            </linearGradient>
          </defs>
          <polygon
            points={`0,${height} ${points} ${width},${height}`}
            fill="url(#burndownGradient)"
          />
        </svg>
        <div
          className={`flex justify-between text-xs mt-1 ${
            isDark ? "text-neutral-500" : "text-neutral-600"
          }`}
        >
          <span>{format(parseISO(forecast[0].date), "MMM d")}</span>
          <span>
            {format(parseISO(forecast[forecast.length - 1].date), "MMM d")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm ${
          isDark ? "bg-black/60" : "bg-black/30"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          isDark
            ? "bg-neutral-950 border border-white/[0.08]"
            : "bg-white border border-neutral-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between p-6 ${
            isDark
              ? "border-b border-white/[0.06]"
              : "border-b border-neutral-200"
          }`}
        >
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <h2
                className={`text-xl font-semibold truncate ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {sprint.name || sprint.sprintId}
              </h2>
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
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {format(startDate, "MMM d")} — {format(endDate, "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {totalDays} days
              </span>
              {sprint.plannedBy && (
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  {sprint.plannedBy}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/[0.05]" : "hover:bg-neutral-100"
            }`}
          >
            <X
              className={`w-5 h-5 ${
                isDark ? "text-neutral-400" : "text-neutral-500"
              }`}
            />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary */}
          {(sprint.summary || sprint.aiSummary) && (
            <div
              className={`rounded-xl p-4 ${
                isDark
                  ? "bg-white/[0.02] border border-white/[0.04]"
                  : "bg-neutral-50 border border-neutral-200"
              }`}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                {sprint.summary || sprint.aiSummary}
              </p>
            </div>
          )}

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Tasks */}
            <div
              className={`rounded-xl p-4 ${
                isDark
                  ? "bg-white/[0.02] border border-white/[0.04]"
                  : "bg-neutral-50 border border-neutral-200"
              }`}
            >
              <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-2">
                <Target className="w-3.5 h-3.5" />
                Selected Tasks
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {selectedCount}
              </div>
              {deferredCount > 0 && (
                <div className="text-xs text-neutral-500 mt-1">
                  +{deferredCount} deferred
                </div>
              )}
            </div>

            {/* Total Effort */}
            <div
              className={`rounded-xl p-4 ${
                isDark
                  ? "bg-white/[0.02] border border-white/[0.04]"
                  : "bg-neutral-50 border border-neutral-200"
              }`}
            >
              <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-2">
                <Clock className="w-3.5 h-3.5" />
                Total Effort
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {sprint.totalEffort || 0}
                <span className="text-sm text-neutral-500 font-normal ml-1">
                  hrs
                </span>
              </div>
            </div>

            {/* Velocity */}
            <div
              className={`rounded-xl p-4 ${
                isDark
                  ? "bg-white/[0.02] border border-white/[0.04]"
                  : "bg-neutral-50 border border-neutral-200"
              }`}
            >
              <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Velocity
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {sprint.velocity || sprint.predictedVelocity || 0}
              </div>
            </div>

            {/* Capacity */}
            <div
              className={`rounded-xl p-4 ${
                isDark
                  ? "bg-white/[0.02] border border-white/[0.04]"
                  : "bg-neutral-50 border border-neutral-200"
              }`}
            >
              <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-2">
                <Users className="w-3.5 h-3.5" />
                Team Capacity
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {Math.round(sprint.capacity?.totalCapacityHours || 0)}
                <span className="text-sm text-neutral-500 font-normal ml-1">
                  hrs
                </span>
              </div>
            </div>
          </div>

          {/* Risk & Confidence Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Risk Analysis */}
            <div className={`${risk.bg} border ${risk.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${risk.text}`} />
                  <span className={`text-sm font-medium ${risk.text}`}>
                    {risk.label}
                  </span>
                </div>
                <span className={`text-2xl font-bold ${risk.text}`}>
                  {Math.round(riskPercent)}%
                </span>
              </div>
              {sprint.riskAnalysis?.overloadedMembers?.length ? (
                <p className="text-xs text-neutral-400">
                  {sprint.riskAnalysis.overloadedMembers.length} overloaded
                  member(s)
                </p>
              ) : (
                <p className="text-xs text-neutral-400">
                  No critical issues detected
                </p>
              )}
            </div>

            {/* AI Confidence */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">
                    AI Confidence
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-400">
                  {confidence ?? "—"}%
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {sprint.assignmentStrategy === "fairness"
                  ? "Fairness-optimized assignments"
                  : "AI-optimized planning"}
              </p>
            </div>

            {/* Blocker Health */}
            <div
              className={`rounded-xl p-4 ${
                isDark
                  ? "bg-white/[0.02] border border-white/[0.04]"
                  : "bg-neutral-50 border border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neutral-500" />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-white/80" : "text-neutral-700"
                    }`}
                  >
                    Blocker Health
                  </span>
                </div>
                <BlockerHealthPill
                  blockerStatus={blockerStatus}
                  blockerHealthScore={typeof blockerScore === "number" ? blockerScore : null}
                  blockerCount={typeof blockerCount === "number" ? blockerCount : null}
                  blockerUpdatedAt={typeof blockerUpdatedAt === "string" ? blockerUpdatedAt : null}
                  className="ml-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  {typeof blockerCount === "number"
                    ? `${blockerCount} blocker(s) detected`
                    : isRefreshingBlockers
                    ? "Running blocker scan…"
                    : isProjectManager
                    ? "No scan yet — click Run Scan below"
                    : "No blocker scan available yet"}
                </p>
                {isProjectManager && (
                  <Button
                    onClick={handleRefreshBlockers}
                    disabled={isRefreshingBlockers}
                    size="sm"
                    className={`ml-3 transition-all duration-200 text-xs py-1 px-2 h-auto ${
                      isDark
                        ? "border border-neutral-600/50 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700/50 hover:border-neutral-500"
                        : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400"
                    }`}
                  >
                    <RefreshCw
                      className={`w-3 h-3 mr-1 ${
                        isRefreshingBlockers ? "animate-spin" : ""
                      }`}
                    />
                    {isRefreshingBlockers ? "Scanning…" : "Run Scan"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Blocker Report */}
          {(blockerSummary || blockersList.length > 0 || blockerActions.length > 0) && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <SectionHeader
                    id="blockers"
                    icon={Shield}
                    title="Blocker Report"
                    badge={
                      <span className="ml-2">
                        <BlockerHealthPill
                          compact
                          blockerStatus={blockerStatus}
                          blockerHealthScore={typeof blockerScore === "number" ? blockerScore : null}
                          blockerCount={typeof blockerCount === "number" ? blockerCount : null}
                          blockerUpdatedAt={typeof blockerUpdatedAt === "string" ? blockerUpdatedAt : null}
                        />
                      </span>
                    }
                  />
                </div>
                {isProjectManager && (
                  <Button
                    onClick={handleRefreshBlockers}
                    disabled={isRefreshingBlockers}
                    size="sm"
                    className={`ml-3 transition-all duration-200 ${
                      isDark
                        ? "border border-neutral-600/50 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700/50 hover:border-neutral-500"
                        : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400"
                    }`}
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 mr-1.5 ${
                        isRefreshingBlockers ? "animate-spin" : ""
                      }`}
                    />
                    {isRefreshingBlockers ? "Scanning..." : "Refresh Scan"}
                  </Button>
                )}
              </div>
              {expandedSections.has("blockers") && (
                <div
                  className={`mt-3 rounded-xl p-4 space-y-4 ${
                    isDark
                      ? "bg-white/[0.02] border border-white/[0.04]"
                      : "bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  {blockerSummary && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">
                        AI Summary
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        {blockerSummary}
                      </p>
                    </div>
                  )}

                  {blockerActions.length > 0 && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-2">
                        Recommended Actions
                      </div>
                      <ul className="space-y-1">
                        {blockerActions.slice(0, 5).map((a, idx) => (
                          <li
                            key={idx}
                            className={`text-sm flex items-start gap-2 ${
                              isDark ? "text-neutral-300" : "text-neutral-700"
                            }`}
                          >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0" />
                            <span className="min-w-0 break-words">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {blockersList.length > 0 && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-2">
                        Top Blockers
                      </div>
                      <div className="space-y-2">
                        {blockersList.slice(0, 6).map((b: any, idx: number) => {
                          const sev = String(b?.severity || "Low");
                          const sevStyle =
                            sev === "High"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : sev === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20";
                          const title =
                            b?.taskTitle ||
                            b?.taskId ||
                            b?.entityId ||
                            "Unknown";
                          const type = b?.type || "Blocker";
                          const desc = b?.description || "";
                          return (
                            <div
                              key={idx}
                              className={`rounded-xl p-3 ${
                                isDark
                                  ? "bg-black/20 border border-white/[0.04]"
                                  : "bg-white border border-neutral-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1 min-w-0">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${sevStyle}`}>
                                      {sev}
                                    </span>
                                    <span
                                      className={`text-sm font-medium truncate ${
                                        isDark ? "text-white/90" : "text-neutral-900"
                                      }`}
                                    >
                                      {type}
                                    </span>
                                  </div>
                                  <div className="text-xs text-neutral-500 truncate">
                                    {title}
                                  </div>
                                </div>
                                {typeof b?.confidence === "number" && (
                                  <div className="text-xs text-neutral-500 flex-shrink-0">
                                    {Math.round(b.confidence * 100)}%
                                  </div>
                                )}
                              </div>
                              {desc && (
                                <p
                                  className={`text-sm mt-2 leading-relaxed ${
                                    isDark ? "text-neutral-300" : "text-neutral-700"
                                  }`}
                                >
                                  {desc}
                                </p>
                              )}
                              {b?.recommendedAction && (
                                <p className="text-xs text-neutral-500 mt-2">
                                  <span className="font-medium">Action:</span>{" "}
                                  {b.recommendedAction}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Blocker History Trend */}
          {sprint._id && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="blocker-history"
                icon={BarChart3}
                title="Blocker Health Timeline"
              />
              {expandedSections.has("blocker-history") && (
                <div className="mt-3">
                  <BlockerHistoryChart sprintId={sprint._id} />
                </div>
              )}
            </div>
          )}

          {/* Burndown Forecast */}
          {sprint.burndownForecast && sprint.burndownForecast.length > 0 && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="burndown"
                icon={BarChart3}
                title="Burndown Forecast"
              />
              {expandedSections.has("burndown") && (
                <div
                  className={`mt-3 rounded-xl p-4 ${
                    isDark
                      ? "bg-white/[0.02] border border-white/[0.04]"
                      : "bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  <MiniBurndownChart />
                </div>
              )}
            </div>
          )}

          {/* Goals */}
          {sprint.goals && sprint.goals.length > 0 && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="goals"
                icon={Target}
                title="Sprint Goals"
                badge={
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs text-neutral-400 ${
                      isDark ? "bg-white/[0.05]" : "bg-neutral-100"
                    }`}
                  >
                    {sprint.goals.length}
                  </span>
                }
              />
              {expandedSections.has("goals") && (
                <div className="mt-3 space-y-2">
                  {sprint.goals.map((goal, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 rounded-xl p-3 ${
                        isDark
                          ? "bg-white/[0.02] border border-white/[0.04]"
                          : "bg-neutral-50 border border-neutral-200"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-emerald-400 font-medium">
                          {idx + 1}
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed break-words min-w-0 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        {goal}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Team Workload */}
          <div
            className={`pt-4 ${
              isDark
                ? "border-t border-white/[0.04]"
                : "border-t border-neutral-200"
            }`}
          >
            <SectionHeader
              id="team"
              icon={Users}
              title="Team Workload"
              badge={
                <span
                  className={`px-2 py-0.5 rounded-full text-xs text-neutral-400 ${
                    isDark ? "bg-white/[0.05]" : "bg-neutral-100"
                  }`}
                >
                  {allMembers.length} members
                </span>
              }
            />
            {expandedSections.has("team") && (
              <div className="mt-3 space-y-2">
                {allMembers.map((member: any) => {
                  const workloadPercent =
                    member.effectiveCapacity > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (member.plannedHours / member.effectiveCapacity) *
                              100
                          )
                        )
                      : 0;
                  const isOverloaded =
                    workloadPercent > 100 || member.overloadFlag;

                  return (
                    <div
                      key={member.projectMemberId}
                      className={`rounded-xl p-4 ${
                        isDark
                          ? "bg-white/[0.02] border border-white/[0.04]"
                          : "bg-neutral-50 border border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarImage
                              src={member.avatar}
                              alt={member.name}
                            />
                            <AvatarFallback
                              className={`text-sm ${
                                isDark
                                  ? "bg-neutral-800 text-neutral-400"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}
                            >
                              {(member.name || "?").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                isDark ? "text-white/90" : "text-neutral-900"
                              }`}
                            >
                              {member.name}
                            </div>
                            <div className="text-xs text-neutral-500 capitalize">
                              {member.role}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-semibold ${
                              isDark ? "text-white/90" : "text-neutral-900"
                            }`}
                          >
                            {member.plannedHours || 0}
                            <span className="text-neutral-500 font-normal">
                              {" "}
                              / {Math.round(member.effectiveCapacity || 0)}h
                            </span>
                          </div>
                          {member.taskCount !== undefined && (
                            <div className="text-xs text-neutral-500">
                              {member.taskCount} task
                              {member.taskCount !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Workload bar */}
                      <div
                        className={`h-1.5 rounded-full overflow-hidden ${
                          isDark ? "bg-white/[0.05]" : "bg-neutral-200"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverloaded
                              ? "bg-gradient-to-r from-rose-500 to-rose-400"
                              : workloadPercent > 80
                              ? "bg-gradient-to-r from-amber-500 to-amber-400"
                              : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          }`}
                          style={{
                            width: `${Math.min(100, workloadPercent)}%`,
                          }}
                        />
                      </div>
                      {/* Fairness indicator */}
                      {member.fairnessScore && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                          <Scale className="w-3 h-3" />
                          Fairness: {(member.fairnessScore * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Tasks */}
          {sprint.selectedTasks && sprint.selectedTasks.length > 0 && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="tasks"
                icon={ListTodo}
                title="Selected Tasks"
                badge={
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-xs text-emerald-400">
                    {sprint.selectedTasks.length}
                  </span>
                }
              />
              {expandedSections.has("tasks") && (
                <div className="mt-3 space-y-2">
                  {sprint.selectedTasks.map((task, idx) => {
                    const assignee =
                      task.assignedMemberDetails ||
                      getMemberDetails(task.assignedTo);
                    return (
                      <div
                        key={task.taskId}
                        className={`rounded-xl p-4 ${
                          isDark
                            ? "bg-white/[0.02] border border-white/[0.04]"
                            : "bg-neutral-50 border border-neutral-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-neutral-500">
                                {task.taskId}
                              </span>
                              <span className="text-xs text-neutral-600">
                                •
                              </span>
                              <span className="text-xs text-neutral-500">
                                {task.estimatedHours}h
                              </span>
                            </div>
                            <p
                              className={`text-sm line-clamp-2 ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            >
                              {task.reason}
                            </p>
                          </div>
                          {assignee && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={assignee.avatar || undefined}
                                  alt={assignee.name}
                                />
                                <AvatarFallback
                                  className={`text-[10px] ${
                                    isDark
                                      ? "bg-neutral-800 text-neutral-400"
                                      : "bg-neutral-100 text-neutral-600"
                                  }`}
                                >
                                  {(assignee.name || "?")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`text-xs ${
                                  isDark
                                    ? "text-neutral-400"
                                    : "text-neutral-600"
                                }`}
                              >
                                {assignee.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Deferred Tasks */}
          {sprint.deferredTasks && sprint.deferredTasks.length > 0 && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="deferred"
                icon={AlertCircle}
                title="Deferred Tasks"
                badge={
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-xs text-amber-400">
                    {sprint.deferredTasks.length}
                  </span>
                }
              />
              {expandedSections.has("deferred") && (
                <div className="mt-3 space-y-2">
                  {sprint.deferredTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-amber-400/70">
                          {task.taskId}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {task.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {sprint.recommendations && sprint.recommendations.length > 0 && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="recommendations"
                icon={Flame}
                title="AI Recommendations"
                badge={
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-xs text-blue-400">
                    {sprint.recommendations.length}
                  </span>
                }
              />
              {expandedSections.has("recommendations") && (
                <div className="mt-3 space-y-2">
                  {sprint.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex items-start gap-3"
                    >
                      <Zap className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p
                        className={`text-sm ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Burndown Chart */}
          {sprint.burndownForecast && sprint.burndownForecast.length > 0 && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="burndown"
                icon={BarChart3}
                title="Sprint Burndown"
              />
              {expandedSections.has("burndown") && (
                <div className="mt-3">
                  <BurndownChart
                    burndownForecast={sprint.burndownForecast}
                    totalEffort={sprint.totalEffort || 0}
                    sprintLengthDays={differenceInDays(
                      parseISO(sprint.endDate),
                      parseISO(sprint.startDate)
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {/* Risk Mitigation */}
          {sprint.riskAnalysis && (
            <div
              className={`pt-4 ${
                isDark
                  ? "border-t border-white/[0.04]"
                  : "border-t border-neutral-200"
              }`}
            >
              <SectionHeader
                id="risks"
                icon={AlertTriangle}
                title="Risk Analysis"
                badge={
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      riskPercent >= 50
                        ? "bg-red-500/10 text-red-400"
                        : riskPercent >= 25
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {riskPercent.toFixed(0)}% Risk
                  </span>
                }
              />
              {expandedSections.has("risks") && (
                <div className="mt-3">
                  <RiskMitigationPanel
                    delayRiskPercent={
                      sprint.riskAnalysis?.delayRiskPercent || 0
                    }
                    overloadedMembers={
                      sprint.riskAnalysis?.overloadedMembers || []
                    }
                    criticalDependencies={
                      sprint.riskAnalysis?.criticalDependencies || []
                    }
                    deadlineThreats={sprint.riskAnalysis?.deadlineThreats || []}
                  />
                </div>
              )}
            </div>
          )}

          {/* Member Performance */}
          {sprint.memberWorkloadSummary &&
            sprint.memberWorkloadSummary.length > 0 && (
              <div
                className={`pt-4 ${
                  isDark
                    ? "border-t border-white/[0.04]"
                    : "border-t border-neutral-200"
                }`}
              >
                <SectionHeader
                  id="performance"
                  icon={Users}
                  title="Team Workload & Performance"
                  badge={
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-xs text-purple-400">
                      {sprint.memberWorkloadSummary.length} members
                    </span>
                  }
                />
                {expandedSections.has("performance") && (
                  <div className="mt-3">
                    <MemberPerformancePanel
                      memberWorkloadSummary={sprint.memberWorkloadSummary}
                      fairnessReport={sprint.fairnessReport}
                      selectedTasks={sprint.selectedTasks}
                      capacity={sprint.capacity}
                      members={members}
                    />
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-6 py-4 ${
            isDark
              ? "border-t border-white/[0.06] bg-white/[0.01]"
              : "border-t border-neutral-200 bg-neutral-50"
          }`}
        >
          <Button
            onClick={onClose}
            className={`transition-all duration-200 cursor-pointer ${
              isDark
                ? "border border-neutral-600/50 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700/50 hover:border-neutral-500"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400"
            }`}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
