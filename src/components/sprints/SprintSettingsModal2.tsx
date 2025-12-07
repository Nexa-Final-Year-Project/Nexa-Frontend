import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal/Modal";
import { Button } from "../ui/button";
import { Sprint as SprintType } from "@/types/sprint";
import { format, parseISO, differenceInDays } from "date-fns";
import { useForm } from "@mantine/form";
import { SPRINT_FORM_FIELDS } from "@/lib/constants/sprints/sprints";
import { FormField } from "../ui/form/FormField";
import { TeamMemberAvatar } from "../teams/TeamMemberAvatar";
import { useProject } from "@/store/projects/projectStore";
import { useTheme } from "next-themes";
import {
  Calendar,
  Clock,
  Target,
  Users,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  Plus,
  X,
  Edit2,
  Save,
  AlertCircle,
  BarChart3,
  Award,
  Sparkles,
} from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "team">(
    "overview"
  );

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
    setIsEditing(false);
    onClose();
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      form.setFieldValue("goals", [...form.values.goals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    form.setFieldValue(
      "goals",
      form.values.goals.filter((_, i) => i !== index)
    );
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

  // Calculate sprint metrics
  const startDate = sprint.startDate ? parseISO(sprint.startDate) : new Date();
  const endDate = sprint.endDate ? parseISO(sprint.endDate) : new Date();
  const today = new Date();
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = Math.max(0, differenceInDays(today, startDate));
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));
  const progressPercent =
    totalDays > 0
      ? Math.min(100, Math.round((daysElapsed / totalDays) * 100))
      : 0;
  const selectedTasksCount = (sprint as any)?.selectedTasks?.length || 0;
  const velocity = (sprint as any)?.velocity || 0;
  const healthScore = (sprint as any)?.sprintHealthScore || 0;

  return (
    <Modal title="" open={open} onOpenChange={onClose} size="xl">
      <div className={`relative ${isDark ? "bg-neutral-950" : "bg-white"}`}>
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
              isDark ? "bg-blue-500" : "bg-blue-400"
            }`}
            style={{ transform: "translate(30%, -30%)" }}
          />
          <div
            className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
              isDark ? "bg-purple-500" : "bg-purple-400"
            }`}
            style={{ transform: "translate(-30%, 30%)" }}
          />
        </div>

        {/* Hero Header Section */}
        <div
          className={`relative border-b ${
            isDark
              ? "border-white/[0.08] bg-gradient-to-br from-neutral-900/50 to-neutral-900/30"
              : "border-neutral-200 bg-gradient-to-br from-neutral-50 to-white"
          }`}
        >
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-3 rounded-xl ${
                      isDark
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <Target
                      className={`w-6 h-6 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        value={form.values.name}
                        onChange={(e) =>
                          form.setFieldValue("name", e.target.value)
                        }
                        className={`text-2xl font-bold border-b-2 bg-transparent focus:outline-none ${
                          isDark
                            ? "text-white border-blue-500/50 focus:border-blue-500"
                            : "text-neutral-900 border-blue-400 focus:border-blue-600"
                        }`}
                        placeholder="Sprint Name"
                      />
                    ) : (
                      <h1
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        {sprint.name || "Sprint Settings"}
                      </h1>
                    )}
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      Configure sprint parameters and monitor progress
                    </p>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <div
                    className={`rounded-xl p-3 ${
                      isDark
                        ? "bg-white/[0.03] border border-white/[0.06]"
                        : "bg-neutral-50 border border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      >
                        Duration
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {totalDays}{" "}
                      <span className="text-sm font-normal">days</span>
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${
                      isDark
                        ? "bg-white/[0.03] border border-white/[0.06]"
                        : "bg-neutral-50 border border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      >
                        Remaining
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        daysRemaining < 3
                          ? isDark
                            ? "text-red-400"
                            : "text-red-600"
                          : isDark
                          ? "text-white"
                          : "text-neutral-900"
                      }`}
                    >
                      {daysRemaining}{" "}
                      <span className="text-sm font-normal">days</span>
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${
                      isDark
                        ? "bg-white/[0.03] border border-white/[0.06]"
                        : "bg-neutral-50 border border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      >
                        Tasks
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {selectedTasksCount}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${
                      isDark
                        ? "bg-white/[0.03] border border-white/[0.06]"
                        : "bg-neutral-50 border border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp
                        className={`w-3.5 h-3.5 ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      >
                        Velocity
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {velocity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isEditing
                      ? isDark
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-blue-100 text-blue-600 border border-blue-300"
                      : isDark
                      ? "bg-white/[0.05] text-neutral-400 hover:bg-white/[0.1] hover:text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {isEditing ? (
                    <Save className="w-5 h-5" />
                  ) : (
                    <Edit2 className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDark
                      ? "bg-white/[0.05] text-neutral-400 hover:bg-white/[0.1] hover:text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  Sprint Progress
                </span>
                <span
                  className={`text-xs font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {progressPercent}%
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-white/[0.05]" : "bg-neutral-200"
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs ${
                    isDark ? "text-neutral-500" : "text-neutral-600"
                  }`}
                >
                  {format(startDate, "MMM d, yyyy")}
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-neutral-500" : "text-neutral-600"
                  }`}
                >
                  {format(endDate, "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mt-6 border-b ${isDark ? 'border-white/[0.08]' : 'border-neutral-200'}">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "details", label: "Details", icon: Target },
                { id: "team", label: "Team", icon: Users },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-neutral-900"
                        : isDark
                        ? "text-neutral-500 hover:text-neutral-300"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isActive && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          isDark ? "bg-blue-500" : "bg-blue-600"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto hide-scrollbar">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Score Card */}
              <div
                className={`lg:col-span-2 rounded-2xl p-6 border ${
                  isDark
                    ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]"
                    : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-emerald-500/10" : "bg-emerald-50"
                      }`}
                    >
                      <Activity
                        className={`w-5 h-5 ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        Sprint Health
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Overall sprint wellbeing score
                      </p>
                    </div>
                  </div>
                  <div className={`text-right`}>
                    <div
                      className={`text-3xl font-bold ${
                        healthScore >= 70
                          ? isDark
                            ? "text-emerald-400"
                            : "text-emerald-600"
                          : healthScore >= 40
                          ? isDark
                            ? "text-yellow-400"
                            : "text-yellow-600"
                          : isDark
                          ? "text-red-400"
                          : "text-red-600"
                      }`}
                    >
                      {healthScore}%
                    </div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-neutral-500" : "text-neutral-600"
                      }`}
                    >
                      {healthScore >= 70
                        ? "Healthy"
                        : healthScore >= 40
                        ? "At Risk"
                        : "Critical"}
                    </p>
                  </div>
                </div>
                <AdvancedHealthBar value={healthScore} isDark={isDark} />
              </div>

              {/* AI Summary Card */}
              <div
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles
                    className={`w-5 h-5 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <h3
                    className={`text-sm font-bold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    AI Insights
                  </h3>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  {(sprint as any)?.aiSummary ||
                    "This sprint is well-balanced with optimal task distribution. Team velocity is stable and on track for completion."}
                </p>
              </div>

              {/* Goals Section */}
              <div
                className={`lg:col-span-2 rounded-2xl p-6 border ${
                  isDark
                    ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]"
                    : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-blue-500/10" : "bg-blue-50"
                      }`}
                    >
                      <Target
                        className={`w-5 h-5 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      Sprint Goals
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {form.values.goals.length} goals
                  </span>
                </div>

                {isEditing && (
                  <div className="flex gap-2 mb-4">
                    <input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addGoal()}
                      placeholder="Add a new goal..."
                      className={`flex-1 px-4 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-white/[0.05] border-white/[0.1] text-white placeholder:text-neutral-500 focus:ring-blue-500/50"
                          : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:ring-blue-500"
                      }`}
                    />
                    <button
                      onClick={addGoal}
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-sm transition-all ${
                        isDark
                          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                  {form.values.goals && form.values.goals.length > 0 ? (
                    form.values.goals.map((goal, idx) => (
                      <div
                        key={idx}
                        className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div
                          className={`mt-1 p-1 rounded-lg ${
                            isDark ? "bg-emerald-500/10" : "bg-emerald-50"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }`}
                          />
                        </div>
                        <p
                          className={`flex-1 text-sm leading-relaxed break-words min-w-0 ${
                            isDark ? "text-neutral-300" : "text-neutral-700"
                          }`}
                        >
                          {goal}
                        </p>
                        {isEditing && (
                          <button
                            onClick={() => removeGoal(idx)}
                            className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all ${
                              isDark
                                ? "hover:bg-red-500/20 text-red-400"
                                : "hover:bg-red-100 text-red-600"
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      className={`text-center py-12 ${
                        isDark ? "text-neutral-500" : "text-neutral-400"
                      }`}
                    >
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No goals set for this sprint</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members Card */}
              <div
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]"
                    : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-purple-500/10" : "bg-purple-50"
                    }`}
                  >
                    <Users
                      className={`w-5 h-5 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Team
                  </h3>
                </div>
                <div className="space-y-3">
                  {assignedMemberObjs && assignedMemberObjs.length > 0 ? (
                    assignedMemberObjs.map((member: any) => (
                      <div
                        key={member._id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          isDark ? "bg-white/[0.02]" : "bg-white"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isDark
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {member.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isDark ? "text-white" : "text-neutral-900"
                            }`}
                          >
                            {member.name}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-neutral-500" : "text-neutral-600"
                            }`}
                          >
                            {member.role || "Member"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p
                      className={`text-sm text-center py-8 ${
                        isDark ? "text-neutral-500" : "text-neutral-400"
                      }`}
                    >
                      No team members assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]"
                    : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-4 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Sprint Configuration
                </h3>
                <div className="space-y-4">
                  {SPRINT_FORM_FIELDS.map((field) => (
                    <FormField key={field.name} field={field} form={form} />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div
                  className={`rounded-2xl p-6 border ${
                    isDark
                      ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]"
                      : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Status
                  </h3>
                  <div
                    className={`text-center py-8 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                        isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      {(sprint as any)?.status || "Active"}
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-6 border ${
                    isDark
                      ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]"
                      : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Total Tasks
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        {selectedTasksCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Velocity
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        {velocity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Progress
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedMemberObjs && assignedMemberObjs.length > 0 ? (
                assignedMemberObjs.map((member: any) => (
                  <div
                    key={member._id}
                    className={`rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
                      isDark
                        ? "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08] hover:border-white/[0.15]"
                        : "bg-gradient-to-br from-neutral-50 to-white border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 ${
                          isDark
                            ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400"
                            : "bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600"
                        }`}
                      >
                        {member.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <h4
                        className={`text-lg font-bold mb-1 ${
                          isDark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        {member.name}
                      </h4>
                      <p
                        className={`text-sm mb-3 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {member.role || "Team Member"}
                      </p>
                      <div
                        className={`w-full px-3 py-2 rounded-lg ${
                          isDark ? "bg-white/[0.05]" : "bg-neutral-100"
                        }`}
                      >
                        <p
                          className={`text-xs ${
                            isDark ? "text-neutral-500" : "text-neutral-600"
                          }`}
                        >
                          Member ID
                        </p>
                        <p
                          className={`text-xs font-mono ${
                            isDark ? "text-neutral-400" : "text-neutral-700"
                          }`}
                        >
                          {member._id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`col-span-full text-center py-16 ${
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  }`}
                >
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">
                    No team members assigned to this sprint
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`border-t px-8 py-5 ${
            isDark
              ? "border-white/[0.08] bg-neutral-900/50"
              : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isDark
                  ? "bg-white/[0.05] text-white hover:bg-white/[0.1]"
                  : "bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function AdvancedHealthBar({
  value,
  isDark,
}: {
  value?: number | string;
  isDark: boolean;
}) {
  const v = typeof value === "number" ? value : Number(value) || 0;
  const pct = Math.max(0, Math.min(100, Math.round(v)));

  const getHealthColor = () => {
    if (pct >= 70)
      return isDark
        ? "from-emerald-500 to-emerald-400"
        : "from-emerald-600 to-emerald-500";
    if (pct >= 40)
      return isDark
        ? "from-yellow-500 to-yellow-400"
        : "from-yellow-600 to-yellow-500";
    return isDark ? "from-red-500 to-red-400" : "from-red-600 to-red-500";
  };

  return (
    <div>
      <div
        className={`relative h-3 w-full rounded-full overflow-hidden ${
          isDark ? "bg-white/[0.05]" : "bg-neutral-200"
        }`}
      >
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getHealthColor()} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {pct >= 70 ? (
            <CheckCircle2
              className={`w-4 h-4 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          ) : pct >= 40 ? (
            <AlertCircle
              className={`w-4 h-4 ${
                isDark ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
          ) : (
            <AlertCircle
              className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`}
            />
          )}
          <span
            className={`text-sm ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {pct >= 70
              ? "Excellent health"
              : pct >= 40
              ? "Needs attention"
              : "Requires action"}
          </span>
        </div>
        <span
          className={`text-xs font-medium ${
            isDark ? "text-neutral-500" : "text-neutral-600"
          }`}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}

function HealthBar({
  value,
  isDark,
}: {
  value?: number | string;
  isDark: boolean;
}) {
  const v = typeof value === "number" ? value : Number(value) || 0;
  const pct = Math.max(0, Math.min(100, Math.round(v)));
  return (
    <div>
      <div
        className={`relative h-2 w-full rounded-full overflow-hidden ${
          isDark ? "bg-neutral-700" : "bg-neutral-300"
        }`}
      >
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`text-xs mt-1.5 font-medium ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`}
      >
        {pct}% healthy
      </div>
    </div>
  );
}

export const SprintSettingsModal = SprintSettingsModal2;

export default SprintSettingsModal2;
