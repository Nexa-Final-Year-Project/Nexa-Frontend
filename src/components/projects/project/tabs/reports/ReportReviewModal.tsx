"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
// Keep native modal structure; only refine colors and styles for consistency
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectMember } from "@/types/project";
import toast from "@/lib/customToast";
import { useAuthStore } from "@/store/auth/authStore";
import AssignmentReviewModal from "../AssignmentReviewModal";
import { reportsApi } from "@/api/reports/reportsApi";

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Helper to extract MongoDB ObjectId from various formats
const getMongoId = (report: any): string | null => {
  if (!report) return null;
  // Direct _id as string
  if (typeof report._id === "string" && report._id.length === 24)
    return report._id;
  // MongoDB Extended JSON format { $oid: "..." }
  if (report._id && typeof report._id === "object" && report._id.$oid)
    return report._id.$oid;
  // Maybe stored as id instead of _id
  if (typeof report.id === "string" && report.id.length === 24)
    return report.id;
  if (report.id && typeof report.id === "object" && report.id.$oid)
    return report.id.$oid;
  // Backend returns reportId as the MongoDB _id
  if (typeof report.reportId === "string" && report.reportId.length === 24)
    return report.reportId;
  if (
    report.reportId &&
    typeof report.reportId === "object" &&
    report.reportId.$oid
  )
    return report.reportId.$oid;
  return null;
};

export default function ReportReviewModal({
  open,
  onClose,
  report,
  members,
}: {
  open: boolean;
  onClose: () => void;
  report: any;
  members: ProjectMember[];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Handle both backend structure and localStorage structure
  const meta = report?.meta || {};
  const summary = report?.summary || meta?.summary || {};

  // Get backlog summary - can be in different places
  const backlogSummary =
    meta?.backlogSummary ||
    (summary?.backlogCompleteness
      ? `Generated ${summary.totalTasks || 0} tasks across ${
          summary.totalPhases || 0
        } phases. Backlog completeness: ${
          summary.backlogCompleteness
        }%. The focus is heavily weighted toward ${
          Object.keys(report?.workloadDifficulty || {}).find(
            (k) => (report?.workloadDifficulty?.[k] || 0) > 0
          ) || "development"
        }.`
      : null) ||
    `Generated ${summary.totalTasks || "?"} tasks across ${
      summary.totalPhases || "?"
    } phases.`;

  // Get sprint health score from summary or meta
  const sprintHealthScore =
    summary?.sprintHealthScore ?? meta?.sprintHealthScore ?? null;

  // Get member capacity from report root or meta
  const reportMemberCapacity =
    report?.memberCapacity || meta?.memberCapacity || {};

  // Get workload difficulty from report root or meta
  const reportWorkloadDifficulty =
    report?.workloadDifficulty || meta?.workloadDifficulty || {};

  const { user } = useAuthStore();
  const reportOwnerId = report?.ownerId;
  const reportOwnerEmail = report?.ownerEmail;
  const canEdit = (() => {
    if (!reportOwnerId && !reportOwnerEmail) return true;
    if (!user) return false;
    return reportOwnerId === user.id || reportOwnerEmail === user.email;
  })();

  const [status, setStatus] = useState(report?.status || "pending_review");
  const [isApproved, setIsApproved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle decisionLog - can be array of strings OR array of {timestamp, message} objects
  const rawDecisionLog = report?.decisionLog || meta?.decisionLog || [];
  const initialDecisionLog = rawDecisionLog.map((d: any) =>
    typeof d === "string" ? d : d?.message || JSON.stringify(d)
  );
  const [decisionLog, setDecisionLog] = useState<string[]>(initialDecisionLog);

  // Get assignment reasons from rawAgentOutput or meta
  const rawAssignmentReasons =
    report?.rawAgentOutput?.meta?.assignmentReasons ||
    report?.rawAgentOutput?.assignmentReasons ||
    meta?.assignmentReasons ||
    [];
  const [assignmentReasons, setAssignmentReasons] =
    useState<any[]>(rawAssignmentReasons);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [memberCapacity, setMemberCapacity] =
    useState<Record<string, any>>(reportMemberCapacity);
  const [internalSearch, setInternalSearch] = useState("");

  // Check if report is already approved
  useEffect(() => {
    const reportStatus = report?.status?.toLowerCase() || "pending_review";
    setIsApproved(reportStatus === "approved");
    setStatus(reportStatus);
  }, [report]);

  const filteredDecisionIndices = decisionLog
    .map((d, idx) => ({ d, idx }))
    .filter(
      ({ d }) =>
        !internalSearch ||
        d.toLowerCase().includes(internalSearch.toLowerCase())
    )
    .map(({ idx }) => idx);

  const filteredAssignmentIndices = assignmentReasons
    .map((a, idx) => ({ a, idx }))
    .filter(({ a }) => {
      if (!internalSearch) return true;
      const hay = `${a.task_title || ""} ${a.member_name || ""} ${
        a.reason || ""
      }`.toLowerCase();
      return hay.includes(internalSearch.toLowerCase());
    })
    .map(({ idx }) => idx);

  const taskDistribution = useMemo(() => {
    const byRole: Record<string, number> = {};
    (assignmentReasons || []).forEach((a) => {
      const role = a.role || a.member_role || a.member_name || "Unspecified";
      byRole[role] = (byRole[role] || 0) + 1;
    });
    return byRole;
  }, [assignmentReasons]);

  const workload = reportWorkloadDifficulty;

  // simple inline svg line chart for overview sparkline
  const Sparkline = ({ values = [] as number[] }: { values?: number[] }) => {
    const w = 220;
    const h = 48;
    if (!values || !values.length)
      return <div className="text-sm text-slate-300">No data</div>;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const points = values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg width={w} height={h} className="block">
        <polyline
          points={points}
          fill="none"
          stroke="#000"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const saveDraft = async () => {
    if (!canEdit) {
      toast.error(
        "You cannot save this report — it belongs to another account"
      );
      return;
    }

    setIsSaving(true);
    const mongoId = getMongoId(report);
    console.log("saveDraft: mongoId:", mongoId);

    try {
      // Update via API if report has MongoDB ID
      if (mongoId) {
        await reportsApi.updateReport(mongoId, {
          summary: report.meta?.summary || report.summary,
          decisionLog,
          memberCapacity,
          workloadDifficulty:
            report.meta?.workloadDifficulty || report.workloadDifficulty,
          reliabilityHistory:
            report.meta?.reliabilityHistory || report.reliabilityHistory,
        });
        console.log("saveDraft: saved to backend");
      } else {
        console.log("saveDraft: no mongoId, saving to localStorage only");
      }

      // Update localStorage
      const local = JSON.parse(
        localStorage.getItem("generationReports") || "[]"
      );
      const updated = (local || []).map((r: any) => {
        if (r.reportId !== report.reportId) return r;
        return {
          ...r,
          ownerId: r.ownerId || user?.id,
          ownerEmail: r.ownerEmail || user?.email,
          meta: {
            ...r.meta,
            decisionLog,
            assignmentReasons,
            memberCapacity,
          },
        };
      });
      localStorage.setItem("generationReports", JSON.stringify(updated));

      try {
        window.dispatchEvent(new Event("generationReports:changed"));
      } catch (e) {}

      toast.success("Changes saved successfully");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const approveAndAssign = async () => {
    if (!canEdit) {
      toast.error(
        "You cannot approve this report — it belongs to another account"
      );
      return;
    }

    // Extract MongoDB ID from report
    const mongoId = getMongoId(report);
    console.log(
      "approveAndAssign: extracted mongoId:",
      mongoId,
      "from report:",
      { _id: report?._id, id: report?.id, reportId: report?.reportId }
    );

    if (!mongoId) {
      toast.error("Report not synced to database. Cannot approve.");
      console.error(
        "approveAndAssign: could not extract MongoDB ID from report",
        report
      );
      return;
    }

    setIsSaving(true);
    try {
      console.log("approveAndAssign: starting approval for mongoId:", mongoId);

      // First save any pending changes
      try {
        await reportsApi.updateReport(mongoId, {
          summary: report.meta?.summary || report.summary,
          decisionLog,
          memberCapacity,
          workloadDifficulty:
            report.meta?.workloadDifficulty || report.workloadDifficulty,
          reliabilityHistory:
            report.meta?.reliabilityHistory || report.reliabilityHistory,
        });
        console.log("approveAndAssign: pending changes saved");
      } catch (saveErr: any) {
        console.warn(
          "approveAndAssign: save failed (continuing with approval):",
          saveErr?.message
        );
      }

      // Approve the report (commits hierarchy and tasks to DB)
      const result = await reportsApi.approveReport(mongoId, user?.id);
      console.log("approveAndAssign: API response:", result);

      if (!result.success) {
        throw new Error(result.message || "Approval failed");
      }

      toast.success(result.message || "Report approved successfully");

      // Update localStorage
      const local = JSON.parse(
        localStorage.getItem("generationReports") || "[]"
      );
      const updated = (local || []).map((r: any) => {
        if (r.reportId !== report.reportId) return r;
        return {
          ...r,
          ownerId: r.ownerId || user?.id,
          ownerEmail: r.ownerEmail || user?.email,
          status: "approved",
          meta: {
            ...r.meta,
            decisionLog,
            assignmentReasons,
            memberCapacity,
          },
        };
      });
      localStorage.setItem("generationReports", JSON.stringify(updated));

      try {
        window.dispatchEvent(new Event("generationReports:changed"));
        // Trigger task refresh to update analytics/charts
        window.dispatchEvent(new Event("tasks:refresh"));
      } catch (e) {}

      setStatus("approved");
      setIsApproved(true);

      // Open assignment review modal
      setTimeout(() => setShowAssignmentModal(true), 300);
    } catch (error: any) {
      console.error("Approval error:", error);
      console.error("Error details:", error?.response?.data);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to approve report"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const rejectReport = async () => {
    if (!canEdit) {
      toast.error(
        "You cannot reject this report — it belongs to another account"
      );
      return;
    }

    setIsSaving(true);
    const mongoId = getMongoId(report);
    try {
      if (mongoId) {
        await reportsApi.rejectReport(mongoId, "Rejected from UI");
      }

      const local = JSON.parse(
        localStorage.getItem("generationReports") || "[]"
      );
      const updated = (local || []).map((r: any) => {
        if (r.reportId !== report.reportId) return r;
        return {
          ...r,
          ownerId: r.ownerId || user?.id,
          ownerEmail: r.ownerEmail || user?.email,
          status: "rejected",
          meta: {
            ...r.meta,
            decisionLog,
            assignmentReasons,
            memberCapacity,
          },
        };
      });
      localStorage.setItem("generationReports", JSON.stringify(updated));

      try {
        window.dispatchEvent(new Event("generationReports:changed"));
      } catch (e) {}

      setStatus("rejected");
      toast.error("Report rejected");
      onClose();
    } catch (error: any) {
      console.error("Rejection error:", error);
      toast.error(error?.response?.data?.message || "Failed to reject report");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-[92vw] max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isDark 
                ? "bg-neutral-900/95 border border-white/[0.08]" 
                : "bg-white border border-neutral-200"
            }`}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center justify-between px-6 py-4 z-10 ${
                isDark 
                  ? "bg-neutral-900/90 border-b border-white/[0.06] text-white" 
                  : "bg-white border-b border-neutral-200 text-neutral-900"
              }`}
            >
              <div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-xs uppercase tracking-wider ${isDark ? "text-white/40" : "text-neutral-500"}`}
                >
                  Report ID
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`text-lg font-semibold tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}
                >
                  {report?.reportId}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-1"
                >
                  <span className={`text-sm ${isDark ? "text-white/50" : "text-neutral-500"}`}>Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : status === "rejected"
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {status}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder="Search inside report..."
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  className={`px-3 py-2 rounded-xl transition-all ${
                    isDark 
                      ? "bg-white/[0.04] text-white placeholder:text-white/30 border border-white/[0.08] focus:border-violet-500/50" 
                      : "bg-neutral-100 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 focus:border-violet-500"
                  }`}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(JSON.stringify(report));
                        toast.success("Copied report JSON");
                      } catch (e) {
                        toast.error("Copy failed");
                      }
                    }}
                    className="border border-white/[0.08] text-white/70 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 backdrop-blur-sm cursor-pointer rounded-xl"
                  >
                    Copy
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(report, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `report-${
                        report?.reportId || Date.now()
                      }.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="border border-white/[0.08] text-white/70 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 backdrop-blur-sm cursor-pointer rounded-xl"
                  >
                    Export
                  </Button>
                </motion.div>

                {/* Show Edit button if approved, otherwise show Approve/Reject/Save */}
                {isApproved && !isEditing ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-200 cursor-pointer rounded-xl"
                      >
                        Edit
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => setShowAssignmentModal(true)}
                        className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-200 cursor-pointer rounded-xl"
                      >
                        Review Assignments
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={saveDraft}
                        disabled={isSaving || !canEdit}
                        className="border border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 disabled:opacity-50 cursor-pointer rounded-xl"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </motion.div>
                    {!isApproved && (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={approveAndAssign}
                            disabled={isSaving || !canEdit}
                            className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-200 disabled:opacity-50 cursor-pointer rounded-xl"
                          >
                            {isSaving ? "Approving..." : "Approve"}
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={rejectReport}
                            disabled={isSaving || !canEdit}
                            className="border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/50 transition-all duration-200 disabled:opacity-50 cursor-pointer rounded-xl"
                          >
                            Reject
                          </Button>
                        </motion.div>
                      </>
                    )}
                    {isEditing && isApproved && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => {
                            saveDraft();
                            setIsEditing(false);
                          }}
                          disabled={isSaving || !canEdit}
                          className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-200 disabled:opacity-50 cursor-pointer rounded-xl"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 cursor-pointer rounded-xl"
                  >
                    Close
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Body */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="p-6 overflow-y-auto"
            >
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                <div className="col-span-1 md:col-span-2">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.1] transition-all"
                  >
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      Backlog Summary
                    </h3>
                    <p className="text-sm text-white/60 mt-3 leading-relaxed">
                      {backlogSummary}
                    </p>
                    <div className="mt-4">
                      <Sparkline
                        values={[
                          sprintHealthScore || 0,
                          (sprintHealthScore || 0) + 1,
                          (sprintHealthScore || 0) - 1,
                          (sprintHealthScore || 0) + 2,
                        ]}
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20 text-white"
                >
                  <h3 className="font-semibold text-white/70 text-sm">
                    Sprint Health Score
                  </h3>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-5xl font-bold mt-3 bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text"
                  >
                    {sprintHealthScore ?? "—"}
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white hover:border-white/[0.1] transition-all"
                >
                  <h4 className="font-medium mb-4 text-white/80">
                    Task Distribution by Role
                  </h4>
                  {Object.entries(taskDistribution).length === 0 && (
                    <div className="text-sm text-white/40 italic">No data</div>
                  )}
                  {Object.entries(taskDistribution).map(
                    ([role, count], idx) => (
                      <motion.div
                        key={role}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-3 mb-3"
                      >
                        <div className="w-32 text-sm text-white/70 truncate">
                          {role}
                        </div>
                        <div className="flex-1 bg-white/[0.04] rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (count / 1) * 5)}%`,
                            }}
                            transition={{
                              delay: 0.3 + idx * 0.05,
                              duration: 0.5,
                            }}
                            className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full"
                          />
                        </div>
                        <div className="w-8 text-sm text-white/50 text-right">
                          {count}
                        </div>
                      </motion.div>
                    )
                  )}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white hover:border-white/[0.1] transition-all"
                >
                  <h4 className="font-medium mb-4 text-white/80">
                    Workload Difficulty by Role
                  </h4>
                  {Object.entries(workload).map(([role, value], idx) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 mb-3"
                    >
                      <div className="w-32 text-sm text-white/70 truncate">
                        {role}
                      </div>
                      <div className="flex-1 bg-white/[0.04] rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(100, (value as number) / 2)}%`,
                          }}
                          transition={{
                            delay: 0.3 + idx * 0.05,
                            duration: 0.5,
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        />
                      </div>
                      <div className="w-8 text-sm text-white/50 text-right">
                        {String(value as number)}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Decision Log - Read Only */}
              <motion.div variants={itemVariants} className="space-y-6">
                <section>
                  <h4 className="font-semibold mb-2 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Decision Log
                  </h4>
                  <p className="text-xs text-white/40 mb-3">
                    AI reasoning and decisions during task generation
                    (read-only)
                  </p>
                  <div className="rounded-xl max-h-48 overflow-y-auto bg-white/[0.02] border border-white/[0.06] p-4">
                    {decisionLog.length === 0 ? (
                      <div className="text-sm text-white/40 italic">
                        No decision log entries available.
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {decisionLog
                          .filter(
                            (d) =>
                              !internalSearch ||
                              d
                                .toLowerCase()
                                .includes(internalSearch.toLowerCase())
                          )
                          .map((d, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.02 }}
                              className="text-sm text-white/70 bg-white/[0.03] rounded-lg px-4 py-2.5 border-l-2 border-violet-500/50"
                            >
                              {d}
                            </motion.li>
                          ))}
                      </ul>
                    )}
                  </div>
                </section>

                {/* Assignment reasons moved to separate modal for focused review */}
                <section>
                  <h4 className="font-semibold mb-2 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Assignment Suggestions
                  </h4>
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white hover:border-white/[0.1] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/60">
                        <span className="text-white font-medium">
                          {(assignmentReasons || []).length}
                        </span>{" "}
                        suggestion(s)
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => setShowAssignmentModal(true)}
                          className="px-4 py-2 rounded-xl border border-violet-500/30 text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 transition-all"
                        >
                          Open Assignment Review
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-xs text-white/40 mt-3">
                      Assignment suggestions are reviewed in a dedicated modal
                      where you can edit, approve, or delete individual
                      suggestions.
                    </p>
                  </motion.div>
                </section>

                <section>
                  <h4 className="font-semibold mb-2 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Member Capacity
                  </h4>
                  <div className="rounded-xl max-h-60 overflow-auto bg-white/[0.02] border border-white/[0.06]">
                    <table className="w-full text-sm text-white">
                      <thead className="bg-white/[0.04] text-white/60 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">
                            Member Name
                          </th>
                          <th className="text-left px-4 py-3 font-medium">
                            Total Capacity
                          </th>
                          <th className="text-left px-4 py-3 font-medium">
                            Assigned Tasks
                          </th>
                          <th className="text-left px-4 py-3 font-medium">
                            Max Tasks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(memberCapacity).map(
                          ([name, cap], idx) => (
                            <motion.tr
                              key={name}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="px-4 py-3 text-white/80">
                                {name}
                              </td>
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <Input
                                    className="w-24 bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-white focus:border-violet-500/50"
                                    value={cap.total}
                                    onChange={(e) =>
                                      setMemberCapacity({
                                        ...memberCapacity,
                                        [name]: {
                                          ...cap,
                                          total: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                ) : (
                                  <span className="text-white/60">
                                    {cap.total ?? "—"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-white/60">
                                {cap.assignedTasks ?? "—"}
                              </td>
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <Input
                                    className="w-24 bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-white focus:border-violet-500/50"
                                    value={cap.maxTasks}
                                    onChange={(e) =>
                                      setMemberCapacity({
                                        ...memberCapacity,
                                        [name]: {
                                          ...cap,
                                          maxTasks: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                ) : (
                                  <span className="text-white/60">
                                    {cap.maxTasks ?? "—"}
                                  </span>
                                )}
                              </td>
                            </motion.tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </motion.div>
            </motion.div>

            {showAssignmentModal && (
              <AssignmentReviewModal
                open={showAssignmentModal}
                onClose={() => setShowAssignmentModal(false)}
                report={report}
                onSave={(updated) => {
                  setAssignmentReasons(updated);
                  try {
                    const local = JSON.parse(
                      localStorage.getItem("generationReports") || "[]"
                    );
                    const updatedAll = (local || []).map((r: any) => {
                      if (r.reportId !== report.reportId) return r;
                      return {
                        ...r,
                        ownerId: r.ownerId || user?.id,
                        ownerEmail: r.ownerEmail || user?.email,
                        meta: { ...(r.meta || {}), assignmentReasons: updated },
                      };
                    });
                    localStorage.setItem(
                      "generationReports",
                      JSON.stringify(updatedAll)
                    );
                    try {
                      window.dispatchEvent(
                        new Event("generationReports:changed")
                      );
                    } catch (e) {}
                  } catch (e) {}
                }}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
