"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "@/lib/customToast";
import { reportsApi } from "@/api/reports/reportsApi";
import { useAuthStore } from "@/store/auth/authStore";
import {
  X,
  Search,
  CheckCircle2,
  Trash2,
  ChevronDown,
  User,
  Clock,
  AlertCircle,
  Sparkles,
  Save,
} from "lucide-react";

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

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Helper to extract MongoDB ObjectId from various formats
const getMongoId = (obj: any): string | null => {
  if (!obj) return null;
  if (typeof obj === "string" && obj.length === 24) return obj;
  if (typeof obj._id === "string" && obj._id.length === 24) return obj._id;
  if (obj._id && typeof obj._id === "object" && obj._id.$oid)
    return obj._id.$oid;
  if (typeof obj.id === "string" && obj.id.length === 24) return obj.id;
  if (obj.id && typeof obj.id === "object" && obj.id.$oid) return obj.id.$oid;
  // Backend returns reportId as the MongoDB _id
  if (typeof obj.reportId === "string" && obj.reportId.length === 24)
    return obj.reportId;
  if (obj.reportId && typeof obj.reportId === "object" && obj.reportId.$oid)
    return obj.reportId.$oid;
  return null;
};

export default function AssignmentReviewModal({
  open,
  onClose,
  report,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  report: any;
  onSave?: (updatedAssignmentReasons: any[]) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuthStore();
  // Get assignment reasons from multiple possible locations
  const initial =
    (report?.meta?.assignmentReasons as any[]) ||
    (report?.rawAgentOutput?.meta?.assignmentReasons as any[]) ||
    (report?.rawAgentOutput?.assignmentReasons as any[]) ||
    [];
  const [items, setItems] = useState<any[]>(initial);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Extract MongoDB ID from report
  const mongoId = getMongoId(report);

  // Load suggestions from backend when modal opens
  useEffect(() => {
    if (open && mongoId) {
      console.log(
        "AssignmentReviewModal: loading suggestions for mongoId:",
        mongoId
      );
      loadSuggestions();
    } else if (open && !mongoId) {
      console.warn(
        "AssignmentReviewModal: mongoId is missing, checking assignmentSuggestions",
        {
          report,
          assignmentSuggestions: report?.assignmentSuggestions,
        }
      );
      // Try to use embedded assignmentSuggestions from report if available
      if (
        report?.assignmentSuggestions &&
        Array.isArray(report.assignmentSuggestions)
      ) {
        const embeddedSuggestions = report.assignmentSuggestions.map(
          (s: any) => ({
            _id: s.suggestionId || getMongoId(s),
            status: "suggested",
            ...s,
          })
        );
        console.log(
          "AssignmentReviewModal: using embedded suggestions:",
          embeddedSuggestions.length
        );
        setSuggestions(embeddedSuggestions);
      }
    }
  }, [mongoId, open]);

  React.useEffect(() => {
    // Get assignment reasons from multiple possible locations
    const reasons =
      (report?.meta?.assignmentReasons as any[]) ||
      (report?.rawAgentOutput?.meta?.assignmentReasons as any[]) ||
      (report?.rawAgentOutput?.assignmentReasons as any[]) ||
      [];
    setItems(reasons);
  }, [report?.reportId, open]);

  const loadSuggestions = async () => {
    try {
      if (!mongoId) {
        console.warn("loadSuggestions: mongoId is missing");
        return;
      }
      console.log("loadSuggestions: fetching for mongoId:", mongoId);
      const response = await reportsApi.getSuggestionsByReport(mongoId);
      console.log("loadSuggestions: response:", response);
      if (response.success) {
        setSuggestions(response.suggestions || []);
        // Check if all are approved
        const allApproved = (response.suggestions || []).every(
          (s: any) => s.status === "approved"
        );
        setIsApproved(allApproved && response.suggestions.length > 0);
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
      // Fallback to embedded suggestions
      if (
        report?.assignmentSuggestions &&
        Array.isArray(report.assignmentSuggestions)
      ) {
        const embeddedSuggestions = report.assignmentSuggestions.map(
          (s: any) => ({
            _id: s.suggestionId || getMongoId(s),
            status: "suggested",
            ...s,
          })
        );
        console.log(
          "loadSuggestions: using fallback embedded suggestions:",
          embeddedSuggestions.length
        );
        setSuggestions(embeddedSuggestions);
      }
    }
  };

  const filtered = items.filter((it) => {
    if (!query) return true;
    const hay = `${it.task_title || ""} ${it.member_name || ""} ${
      it.reason || ""
    }`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  if (!open) return null;

  const saveAndClose = async () => {
    setIsSaving(true);
    try {
      // Update suggestions in backend
      if (mongoId) {
        const updates = items
          .map((it, idx) => ({
            suggestionId: suggestions[idx]?._id,
            taskTitle: it.task_title,
            reason: it.reason,
            suggestedMemberName: it.member_name,
          }))
          .filter((u) => u.suggestionId);

        if (updates.length > 0) {
          await reportsApi.bulkUpdateSuggestions(updates);
        }

        // Update assignment reasons in report
        await reportsApi.updateAssignments(mongoId, items);
      }

      // Update localStorage
      const local = JSON.parse(
        localStorage.getItem("generationReports") || "[]"
      );
      const updated = (local || []).map((r: any) =>
        r.reportId === report.reportId
          ? { ...r, meta: { ...(r.meta || {}), assignmentReasons: items } }
          : r
      );
      localStorage.setItem("generationReports", JSON.stringify(updated));

      try {
        window.dispatchEvent(new Event("generationReports:changed"));
      } catch (e) {}

      if (onSave) onSave(items);
      toast.success("Assignment suggestions saved");
      onClose();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save assignments"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const approveAll = async () => {
    console.log("approveAll: starting with suggestions:", suggestions.length);
    console.log(
      "approveAll: suggestion details:",
      suggestions.map((s) => ({ id: s._id, status: s.status }))
    );

    setIsApproving(true);
    try {
      // Get all suggestion IDs that are still pending
      const pendingSuggestions = suggestions.filter(
        (s) => s.status === "suggested"
      );
      const suggestionIds = pendingSuggestions
        .map((s) => getMongoId(s) || s._id)
        .filter((id) => id);

      console.log(
        "approveAll: pendingSuggestions:",
        pendingSuggestions.length,
        "suggestionIds:",
        suggestionIds
      );

      if (suggestionIds.length === 0) {
        // If no backend suggestions, try using local items with assignmentSuggestions from report
        if (
          report?.assignmentSuggestions &&
          Array.isArray(report.assignmentSuggestions)
        ) {
          const localIds = report.assignmentSuggestions
            .map((as: any) => {
              // Handle various formats of suggestionId
              if (typeof as.suggestionId === "string") return as.suggestionId;
              if (as.suggestionId?.$oid) return as.suggestionId.$oid;
              return getMongoId(as);
            })
            .filter((id: any) => id && id.length === 24);

          console.log(
            "approveAll: falling back to report.assignmentSuggestions, found:",
            localIds.length,
            localIds
          );

          if (localIds.length > 0) {
            const response = await reportsApi.bulkApproveSuggestions(
              localIds,
              user?.id
            );
            console.log("approveAll: bulk approve response:", response);

            if (response.success) {
              toast.success(response.message || "All assignments approved");
              setIsApproved(true);
              setItems(items.map((it) => ({ ...it, approved: true })));
              await loadSuggestions();

              // Dispatch events to refresh tasks and reports in other views
              try {
                window.dispatchEvent(new Event("tasks:refresh"));
                window.dispatchEvent(new Event("generationReports:changed"));
              } catch (e) {}
              return;
            }
          }
        }

        toast.info("No pending suggestions to approve");
        return;
      }

      // Bulk approve via API
      console.log(
        "approveAll: calling bulkApproveSuggestions with:",
        suggestionIds
      );
      const response = await reportsApi.bulkApproveSuggestions(
        suggestionIds,
        user?.id
      );
      console.log("approveAll: response:", response);

      if (response.success) {
        toast.success(response.message);
        setIsApproved(true);

        // Mark all items as approved locally
        setItems(items.map((it) => ({ ...it, approved: true })));

        // Reload suggestions to get updated statuses
        await loadSuggestions();

        // Dispatch events to refresh tasks and reports in other views
        try {
          window.dispatchEvent(new Event("tasks:refresh"));
          window.dispatchEvent(new Event("generationReports:changed"));
        } catch (e) {}
      }
    } catch (error: any) {
      console.error("Approval error:", error);
      console.error("Error details:", error?.response?.data);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to approve all assignments"
      );
    } finally {
      setIsApproving(false);
    }
  };

  const toggleApprove = async (idx: number) => {
    const item = items[idx];
    const suggestion = suggestions[idx];

    if (!suggestion) {
      // Local only approval
      const clone = [...items];
      clone[idx] = { ...clone[idx], approved: !clone[idx].approved };
      setItems(clone);
      return;
    }

    try {
      if (suggestion.status === "suggested") {
        // Approve single suggestion
        await reportsApi.approveSuggestion(suggestion._id, user?.id);
        toast.success("Assignment approved");

        const clone = [...items];
        clone[idx] = { ...clone[idx], approved: true };
        setItems(clone);

        await loadSuggestions();

        // Dispatch events to refresh tasks in other views
        try {
          window.dispatchEvent(new Event("tasks:refresh"));
        } catch (e) {}
      } else {
        // Toggle local approval state
        const clone = [...items];
        clone[idx] = { ...clone[idx], approved: !clone[idx].approved };
        setItems(clone);
      }
    } catch (error: any) {
      console.error("Toggle approve error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to approve assignment"
      );
    }
  };

  const removeItem = async (idx: number) => {
    const suggestion = suggestions[idx];

    try {
      if (suggestion?._id) {
        await reportsApi.declineSuggestion(
          suggestion._id,
          user?.id,
          "Removed by PM"
        );
      }

      setItems(items.filter((_, i) => i !== idx));
      toast.success("Assignment removed");
    } catch (error: any) {
      console.error("Remove error:", error);
      toast.error("Failed to remove assignment");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute inset-0 backdrop-blur-sm ${
              isDark ? "bg-black/70" : "bg-black/30"
            }`}
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-[90vw] max-w-4xl max-h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isDark
                ? "bg-neutral-900/95 border border-white/[0.08]"
                : "bg-white border border-neutral-200"
            }`}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-20 backdrop-blur-xl p-5 ${
                isDark
                  ? "bg-neutral-900/95 border-b border-white/[0.06]"
                  : "bg-white border-b border-neutral-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/20">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      Assignment Review
                    </h2>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white/50" : "text-neutral-500"
                      }`}
                    >
                      Review & confirm task assignment suggestions
                    </p>
                    {isApproved && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400">
                          All assignments approved
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isDark
                      ? "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-white"
                      : "bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Search & Actions Bar */}
              <div className="flex items-center gap-3 mt-4">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-white/30" : "text-neutral-400"
                    }`}
                  />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search assignments..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-1 ${
                      isDark
                        ? "bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/30 focus:border-emerald-500/30 focus:ring-emerald-500/20"
                        : "bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  />
                </div>
                <Button
                  onClick={approveAll}
                  disabled={isApproving || isApproved}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isApproving
                    ? "Approving..."
                    : isApproved
                    ? "All Approved"
                    : "Approve All"}
                </Button>
                <Button
                  variant="outline"
                  onClick={saveAndClose}
                  disabled={isSaving}
                  className={`px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2 ${
                    isDark
                      ? "border border-white/[0.08] bg-white/[0.02] text-white hover:bg-white/[0.04]"
                      : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-5">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/50">
                    No assignment suggestions available
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Generate tasks with AI to see assignment suggestions here
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((it, idx) => (
                    <motion.div
                      key={it.task_id || idx}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.05 }}
                      className={`group p-4 rounded-xl border transition-all duration-200 ${
                        it.approved
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-white truncate">
                              {it.task_title || "Untitled task"}
                            </h3>
                            {it.approved && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Approved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/40">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{it.member_name || "Unassigned"}</span>
                            </div>
                            {it.estimatedHours && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{it.estimatedHours}h</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => toggleApprove(items.indexOf(it))}
                            className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                              it.approved
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                : "bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {it.approved ? "Approved" : "Approve"}
                          </Button>
                          <Button
                            onClick={() => removeItem(items.indexOf(it))}
                            className="px-3 py-1.5 text-xs rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      {/* Editable Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">
                            Task Title
                          </label>
                          <Input
                            value={it.task_title || ""}
                            onChange={(e) => {
                              const c = [...items];
                              c[items.indexOf(it)] = {
                                ...c[items.indexOf(it)],
                                task_title: e.target.value,
                              };
                              setItems(c);
                            }}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">
                            Assigned Member
                          </label>
                          <Input
                            value={it.member_name || ""}
                            onChange={(e) => {
                              const c = [...items];
                              c[items.indexOf(it)] = {
                                ...c[items.indexOf(it)],
                                member_name: e.target.value,
                              };
                              setItems(c);
                            }}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">
                            Assignment Reason
                          </label>
                          <Textarea
                            value={it.reason || ""}
                            onChange={(e) => {
                              const c = [...items];
                              c[items.indexOf(it)] = {
                                ...c[items.indexOf(it)],
                                reason: e.target.value,
                              };
                              setItems(c);
                            }}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 resize-none"
                            rows={2}
                          />
                        </div>

                        {/* Expandable Details */}
                        <details className="group/details">
                          <summary className="flex items-center gap-2 cursor-pointer text-xs text-white/40 hover:text-white/60 transition-colors">
                            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open/details:rotate-180" />
                            Show task details
                          </summary>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                              <div>
                                <span className="text-white/30">Priority</span>
                                <p className="text-white/70">
                                  {it.priority || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/30">Role</span>
                                <p className="text-white/70">
                                  {it.role || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/30">
                                  Complexity
                                </span>
                                <p className="text-white/70">
                                  {it.complexity || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/30">Type</span>
                                <p className="text-white/70">
                                  {it.type || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/30">
                                  Risk Level
                                </span>
                                <p className="text-white/70">
                                  {it.riskLevel || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/30">
                                  Estimated Hours
                                </span>
                                <p className="text-white/70">
                                  {it.estimatedHours ?? "—"}
                                </p>
                              </div>
                            </div>
                            {it.definitionOfDone && (
                              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                                <span className="text-xs text-white/30">
                                  Definition of Done
                                </span>
                                <p className="text-xs text-white/70 mt-1 whitespace-pre-wrap">
                                  {it.definitionOfDone}
                                </p>
                              </div>
                            )}
                            {(it.tags?.length > 0 ||
                              it.potentialBlockers?.length > 0) && (
                              <div className="mt-3 pt-3 border-t border-white/[0.04] flex flex-wrap gap-4">
                                {it.tags?.length > 0 && (
                                  <div>
                                    <span className="text-xs text-white/30 block mb-1.5">
                                      Tags
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {it.tags.map((t: string, i: number) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 text-xs rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        >
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {it.potentialBlockers?.length > 0 && (
                                  <div>
                                    <span className="text-xs text-white/30 block mb-1.5">
                                      Potential Blockers
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {it.potentialBlockers.map(
                                        (b: string, i: number) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 text-xs rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                          >
                                            {b}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        </details>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
