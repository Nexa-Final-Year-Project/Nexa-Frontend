"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  X,
  Trash2,
  AlertTriangle,
  FileText,
  Edit3,
  Settings2,
} from "lucide-react";

interface DeleteReportModalProps {
  open: boolean;
  onClose: () => void;
  report: any;
  onDeleteWithTasks: () => Promise<void>;
  onDeleteKeepTasks: () => Promise<void>;
  onEditAssignments?: () => void;
}

export default function DeleteReportModal({
  open,
  onClose,
  report,
  onDeleteWithTasks,
  onDeleteKeepTasks,
  onEditAssignments,
}: DeleteReportModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    "with-tasks" | "keep-tasks" | "edit-assignments" | null
  >(null);

  if (!open) return null;

  const reportTitle = report?.displayTitle || report?.reportId || "this report";
  const taskCount =
    report?.summary?.totalTasks ||
    report?.meta?.summary?.totalTasks ||
    report?.suggestionsCreated ||
    report?.meta?.suggestionsCreated ||
    (report?.assignmentSuggestions || []).length ||
    "?";

  const handleDelete = async () => {
    if (!selectedOption) return;

    if (selectedOption === "edit-assignments") {
      onClose();
      if (onEditAssignments) {
        onEditAssignments();
      }
      return;
    }

    setIsDeleting(true);
    try {
      if (selectedOption === "with-tasks") {
        await onDeleteWithTasks();
      } else {
        await onDeleteKeepTasks();
      }
      onClose();
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden ${
          isDark
            ? "bg-neutral-900/95 border border-white/10"
            : "bg-white border border-neutral-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-4 border-b ${
            isDark ? "border-white/10" : "border-neutral-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                isDark ? "bg-red-500/20" : "bg-red-100"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              />
            </div>
            <div>
              <h2
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Delete Report
              </h2>
              <p
                className={`text-sm ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? "bg-white/5 hover:bg-white/10"
                : "bg-neutral-100 hover:bg-neutral-200"
            }`}
          >
            <X
              className={`h-4 w-4 ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto max-h-[calc(100%-120px)]">
          <p
            className={`text-sm ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            You are about to delete{" "}
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              "{reportTitle}"
            </span>
            {taskCount !== "?" && (
              <span>
                {" "}
                which contains{" "}
                <span
                  className={`font-medium ${
                    isDark ? "text-amber-400" : "text-amber-600"
                  }`}
                >
                  {taskCount} tasks
                </span>
              </span>
            )}
            .
          </p>

          <p
            className={`text-sm ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            What would you like to do with the tasks generated by this report?
          </p>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {/* Option 1: Delete with tasks */}
            <button
              onClick={() => setSelectedOption("with-tasks")}
              className={`w-full p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedOption === "with-tasks"
                  ? isDark
                    ? "border-red-500/50 bg-red-500/10"
                    : "border-red-300 bg-red-50"
                  : isDark
                  ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedOption === "with-tasks"
                      ? isDark
                        ? "bg-red-500/20"
                        : "bg-red-200"
                      : isDark
                      ? "bg-white/10"
                      : "bg-neutral-200"
                  }`}
                >
                  <Trash2
                    className={`h-4 w-4 ${
                      selectedOption === "with-tasks"
                        ? isDark
                          ? "text-red-400"
                          : "text-red-600"
                        : isDark
                        ? "text-neutral-400"
                        : "text-neutral-600"
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      selectedOption === "with-tasks"
                        ? isDark
                          ? "text-red-300"
                          : "text-red-700"
                        : isDark
                        ? "text-white"
                        : "text-neutral-900"
                    }`}
                  >
                    Delete report and all tasks
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    Permanently remove this report and all{" "}
                    {taskCount !== "?" ? taskCount : "associated"} tasks from
                    the database. Tasks will be removed from all sprints and
                    backlogs.
                  </div>
                </div>
              </div>
            </button>

            {/* Option 2: Edit assignments first */}
            <button
              onClick={() => setSelectedOption("edit-assignments")}
              className={`w-full p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedOption === "edit-assignments"
                  ? isDark
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-emerald-300 bg-emerald-50"
                  : isDark
                  ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedOption === "edit-assignments"
                      ? isDark
                        ? "bg-emerald-500/20"
                        : "bg-emerald-200"
                      : isDark
                      ? "bg-white/10"
                      : "bg-neutral-200"
                  }`}
                >
                  <Settings2
                    className={`h-4 w-4 ${
                      selectedOption === "edit-assignments"
                        ? isDark
                          ? "text-emerald-400"
                          : "text-emerald-600"
                        : isDark
                        ? "text-neutral-400"
                        : "text-neutral-600"
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      selectedOption === "edit-assignments"
                        ? isDark
                          ? "text-emerald-300"
                          : "text-emerald-700"
                        : isDark
                        ? "text-white"
                        : "text-neutral-900"
                    }`}
                  >
                    Review & edit assignments first
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    Open the assignment review modal to choose which task
                    suggestions to keep, approve, or remove before making a
                    decision.
                  </div>
                </div>
              </div>
            </button>

            {/* Option 3: Keep tasks */}
            <button
              onClick={() => setSelectedOption("keep-tasks")}
              className={`w-full p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedOption === "keep-tasks"
                  ? isDark
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-blue-300 bg-blue-50"
                  : isDark
                  ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedOption === "keep-tasks"
                      ? isDark
                        ? "bg-blue-500/20"
                        : "bg-blue-200"
                      : isDark
                      ? "bg-white/10"
                      : "bg-neutral-200"
                  }`}
                >
                  <Edit3
                    className={`h-4 w-4 ${
                      selectedOption === "keep-tasks"
                        ? isDark
                          ? "text-blue-400"
                          : "text-blue-600"
                        : isDark
                        ? "text-neutral-400"
                        : "text-neutral-600"
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      selectedOption === "keep-tasks"
                        ? isDark
                          ? "text-blue-300"
                          : "text-blue-700"
                        : isDark
                        ? "text-white"
                        : "text-neutral-900"
                    }`}
                  >
                    Delete report only, keep tasks
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    Remove the report but keep all generated tasks. You can
                    continue to modify and assign these tasks normally.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t ${
            isDark
              ? "border-white/10 bg-white/[0.02]"
              : "border-neutral-200 bg-neutral-50/50"
          }`}
        >
          <Button
            onClick={onClose}
            variant="outline"
            className={`border transition-all duration-200 cursor-pointer ${
              isDark
                ? "border-neutral-600/50 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700/50 hover:border-neutral-500"
                : "border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:border-neutral-400"
            }`}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={!selectedOption || isDeleting}
            className={`cursor-pointer transition-all duration-200 ${
              selectedOption === "with-tasks"
                ? isDark
                  ? "border border-rose-500/50 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                  : "border border-red-300 bg-red-100 text-red-700 hover:bg-red-200 hover:border-red-400"
                : selectedOption === "keep-tasks"
                ? isDark
                  ? "border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  : "border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:border-blue-400"
                : selectedOption === "edit-assignments"
                ? isDark
                  ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "border border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:border-emerald-400"
                : isDark
                ? "border border-neutral-600/50 bg-neutral-800/30 text-neutral-500"
                : "border border-neutral-300 bg-neutral-100 text-neutral-500"
            }`}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Deleting...
              </>
            ) : selectedOption === "with-tasks" ? (
              "Delete Report & Tasks"
            ) : selectedOption === "keep-tasks" ? (
              "Delete Report Only"
            ) : selectedOption === "edit-assignments" ? (
              "Review Assignments"
            ) : (
              "Select an option"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
