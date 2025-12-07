import React, { useEffect } from "react";
import { Modal } from "../ui/modal/Modal";
import { Button } from "../ui/button";
import { Sprint as SprintType } from "@/types/sprint";
import { format, parseISO } from "date-fns";
import { useForm } from "@mantine/form";
import { SPRINT_FORM_FIELDS } from "@/lib/constants/sprints/sprints";
import { FormField } from "../ui/form/FormField";
import { TeamMemberAvatar } from "../teams/TeamMemberAvatar";
import { useProject } from "@/store/projects/projectStore";
import { useTheme } from "next-themes";

interface SprintSettingsModalProps {
  open: boolean;
  onClose: () => void;
  sprint: SprintType | null;
  onSave: (updatedSprint: SprintType) => void;
}

export const SprintSettingsModal2: React.FC<SprintSettingsModalProps> = ({
  open,
  onClose,
  sprint,
  onSave,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const form = useForm({
    initialValues: {
      name: "",
      goals: [] as string[],
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (sprint) {
      const normalizeDate = (d?: string) => {
        if (!d) return "";
        try {
          return format(parseISO(d), "yyyy-MM-dd");
        } catch (e) {
          return d;
        }
      };

      form.setValues({
        name: sprint.name || sprint.sprintName || "",
        goals: sprint.goals || [],
        startDate: normalizeDate(sprint.startDate),
        endDate: normalizeDate(sprint.endDate),
      });
    }
  }, [sprint]);

  const handleSubmit = () => {
    if (!sprint) return;

    const updatedSprint: SprintType = {
      ...sprint,
      ...form.values,
    };

    onSave(updatedSprint);
    onClose();
  };

  const projectId = sprint
    ? (sprint.project as string) || (sprint.projectId as string) || ""
    : "";
  const project = useProject(projectId);
  const projectMembers = project?.members || [];
  const assignedMembers = (sprint as any)?.assignedMembers || [];
  const assignedMemberObjs = assignedMembers
    .map((id: string) => projectMembers.find((m) => m._id === id))
    .filter(Boolean) as any[];

  if (!sprint) return null;

  return (
    <Modal title="Sprint Settings" open={open} onOpenChange={onClose} size="lg">
      <div className={`max-h-[75vh] overflow-y-auto hide-scrollbar p-4 ${isDark ? "bg-neutral-950" : "bg-white"}`}>
        <div className={`rounded-2xl border p-6 space-y-6 ${
          isDark
            ? "bg-neutral-900/80 border-white/[0.08]"
            : "bg-white border-neutral-200"
        }`}>
          {/* Header - Responsive */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? "border-white/[0.06]" : "border-neutral-200"
          }`}>
            <div className="flex-1 min-w-0">
              <h2 className={`text-lg font-bold truncate ${isDark ? "text-white" : "text-neutral-900"}`}>
                {sprint.name || "Sprint"}
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Edit sprint settings and manage members.
              </p>
            </div>
            <div className={`whitespace-nowrap text-right text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <div className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Dates</div>
              <div className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                {sprint.startDate
                  ? format(parseISO(sprint.startDate), "MMM d")
                  : "-"}
                {" — "}
                {sprint.endDate
                  ? format(parseISO(sprint.endDate), "MMM d")
                  : "-"}
              </div>
            </div>
          </div>

          {/* Main Content - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form Fields */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                Basic Information
              </h3>
              <div className="space-y-3">
                {SPRINT_FORM_FIELDS.map((field) => (
                  <FormField key={field.name} field={field} form={form} />
                ))}
              </div>

              {/* Goals Section */}
              <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/[0.06]" : "border-neutral-200"}`}>
                <h4 className={`text-sm font-medium mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Goals
                </h4>
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
                  {form.values.goals && form.values.goals.length ? (
                    form.values.goals.map((g, i) => (
                      <div
                        key={i}
                        className={`text-sm p-2 rounded-lg break-words ${
                          isDark
                            ? "bg-white/[0.05] text-neutral-300 border border-white/[0.05]"
                            : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                        }`}
                      >
                        {g}
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                      No goals added
                    </p>
                  )}
                </div>
              </div>

              {/* Assigned Members */}
              <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/[0.06]" : "border-neutral-200"}`}>
                <h4 className={`text-sm font-medium mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Assigned Members
                </h4>
                <div className="flex flex-wrap gap-2">
                  {assignedMemberObjs && assignedMemberObjs.length > 0 ? (
                    assignedMemberObjs.map((member: any) => (
                      <div
                        key={member._id}
                        className={`text-xs px-2.5 py-1.5 rounded-lg ${
                          isDark
                            ? "bg-white/[0.08] text-white border border-white/[0.1]"
                            : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                        }`}
                      >
                        {member.name}
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                      No members assigned
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Summary Cards - Stack on mobile */}
            <aside className="space-y-3">
              {/* Velocity Card */}
              <div className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05]"
                  : "bg-neutral-50 border-neutral-200"
              }`}>
                <div className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>Velocity</div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  {(sprint as any).velocity ?? "—"}
                </div>
              </div>

              {/* Status Card */}
              <div className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05]"
                  : "bg-neutral-50 border-neutral-200"
              }`}>
                <div className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>Status</div>
                <div className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                  {(sprint as any).status ?? "—"}
                </div>
              </div>

              {/* Sprint Health Card */}
              <div className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05]"
                  : "bg-neutral-50 border-neutral-200"
              }`}>
                <div className={`text-xs mb-2 ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                  Sprint Health
                </div>
                <HealthBar value={(sprint as any).sprintHealthScore} isDark={isDark} />
              </div>

              {/* AI Summary Card */}
              <div className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05]"
                  : "bg-neutral-50 border-neutral-200"
              }`}>
                <h5 className={`text-sm font-medium mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  AI Summary
                </h5>
                <p className={`text-xs line-clamp-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {(sprint as any).aiSummary || "No summary available"}
                </p>
              </div>

              {/* Tasks Card */}
              <div className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05]"
                  : "bg-neutral-50 border-neutral-200"
              }`}>
                <h5 className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Tasks
                </h5>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  {(sprint as any).selectedTasks?.length || 0}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                  in sprint
                </p>
              </div>
            </aside>
          </div>

          {/* Action Buttons - Responsive */}
          <div className={`flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t ${
            isDark ? "border-white/[0.06]" : "border-neutral-200"
          }`}>
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "bg-white/[0.05] text-white hover:bg-white/[0.1]"
                  : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              }`}
            >
              Cancel
            </button>
            <button
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all`}
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function HealthBar({ value, isDark }: { value?: number | string; isDark: boolean }) {
  const v = typeof value === "number" ? value : Number(value) || 0;
  const pct = Math.max(0, Math.min(100, Math.round(v)));
  return (
    <div>
      <div className={`relative h-2 w-full rounded-full overflow-hidden ${isDark ? "bg-neutral-700" : "bg-neutral-300"}`}>
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`text-xs mt-1.5 font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
        {pct}% healthy
      </div>
    </div>
  );
}

export const SprintSettingsModal = SprintSettingsModal2;

export default SprintSettingsModal2;
