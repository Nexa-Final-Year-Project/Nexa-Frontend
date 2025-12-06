"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Sparkle, LayoutGrid, List } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { Task } from "@/types/task";
import { Sprint as SprintType } from "@/types/sprint";
import { ProjectMember } from "@/types/project";
import toast from "@/lib/customToast";
import { useSprints } from "@/hooks/sprints/useSprints";
import {
  LatestSprintCard,
  SprintDangerZoneModal,
  SprintModal,
  SprintSettingsModal,
  SprintsTable,
} from "@/components/sprints";
import SprintPlannerModal from "@/components/shared/models/SprintsPlannerModal";
import SprintPlanCard from "./SprintPlanCard";
import SprintDetailModal from "./SprintDetailModal";

/* -------------------- Props -------------------- */
interface SprintsProps {
  projectId: string;
  tasks?: Task[];
  sprints: SprintType[];
  members?: ProjectMember[];
}

/* -------------------- Main Component -------------------- */
export const Sprints = ({
  projectId,
  tasks = [],
  sprints,
  members = [],
}: SprintsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<SprintType | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPlanningDialog, setOpenPlanningDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedDetailSprint, setSelectedDetailSprint] =
    useState<SprintType | null>(null);
  const { createSprint, updateSprint, deleteSprint } = useSprints();

  // Helpers
  const getSprintTasks = (sprintId: string) =>
    tasks?.filter((task) => task?.sprint === sprintId) || [];

  const calculateSprintProgress = (sprintId: string) => {
    const sprintTasks = getSprintTasks(sprintId);
    if (!sprintTasks?.length) return 0;
    const completed = sprintTasks.filter((t) => t.status === "Done").length;
    return Math.round((completed / sprintTasks.length) * 100);
  };

  const handleStartSprint = async (sprint: SprintType) => {
    try {
      await updateSprint(sprint._id, { ...sprint });
      toast.success(`Sprint "${sprint.name}" marked as current`, {
        description: `Runs from ${format(
          parseISO(sprint.startDate),
          "MMM d"
        )} to ${format(parseISO(sprint.endDate), "MMM d")}`,
      });
    } catch {
      toast.error("Failed to update sprint");
    }
  };

  const handleCreateSprint = async (data: {
    name: string;
    goals: string[];
    startDate: string;
    endDate: string;
  }) => {
    try {
      await createSprint({ ...data, project: projectId });
      setIsCreateDialogOpen(false);
      toast.success("Sprint created successfully");
    } catch {
      toast.error("Failed to create sprint");
    }
  };

  const latestSprint = sprints?.length > 0 && sprints[0];

  // Check if sprint has AI planner data
  const hasAIData = (sprint: SprintType) => {
    return (
      sprint.aiSummary ||
      sprint.summary ||
      sprint.selectedTasks?.length ||
      sprint.capacity
    );
  };

  // Filter AI-planned sprints vs regular sprints
  const aiPlannedSprints = sprints?.filter(hasAIData) || [];
  const regularSprints = sprints?.filter((s) => !hasAIData(s)) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          Sprints Overview
        </h1>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div
            className={`flex items-center rounded-lg p-1 ${
              isDark
                ? "bg-neutral-900/50 border border-white/[0.06]"
                : "bg-neutral-100 border border-neutral-200"
            }`}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? isDark
                    ? "bg-white/[0.1] text-white"
                    : "bg-white text-neutral-900 shadow-sm"
                  : isDark
                  ? "text-neutral-500 hover:text-neutral-300"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? isDark
                    ? "bg-white/[0.1] text-white"
                    : "bg-white text-neutral-900 shadow-sm"
                  : isDark
                  ? "text-neutral-500 hover:text-neutral-300"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`flex cursor-pointer items-center !text-sm !p-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
            onClick={() => setOpenPlanningDialog(true)}
          >
            <Sparkle
              className={`w-4 h-4 mr-2 ${
                isDark ? "text-white" : "text-neutral-700"
              }`}
            />
            Plan Sprints
          </Button>
        </div>
      </div>

      {/* Latest Sprint Highlight (only if we have a latest sprint with AI data) */}
      {latestSprint && hasAIData(latestSprint) && viewMode === "table" && (
        <LatestSprintCard
          sprint={latestSprint}
          calculateProgress={calculateSprintProgress}
          onConfigure={() => {
            setIsSettingsDialogOpen(true);
            setSelectedSprint(latestSprint);
          }}
          onDelete={() => {
            setOpenDeleteDialog(true);
            setSelectedSprint(latestSprint);
          }}
        />
      )}

      {/* Sprints Content */}
      {!sprints?.length ? (
        <div
          className={`rounded-2xl p-12 ${
            isDark
              ? "bg-neutral-900/40 border border-white/[0.06]"
              : "bg-neutral-50 border border-neutral-200"
          }`}
        >
          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isDark
                  ? "bg-neutral-800/50 border border-white/[0.06]"
                  : "bg-neutral-100 border border-neutral-200"
              }`}
            >
              <Sparkle className="w-8 h-8 text-neutral-500" />
            </div>
            <h3
              className={`text-lg font-medium mb-2 ${
                isDark ? "text-white/90" : "text-neutral-900"
              }`}
            >
              No sprints yet
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
              Create your first sprint manually or use AI to automatically plan
              optimal sprints based on your tasks and team capacity.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                className={`cursor-pointer ${
                  isDark
                    ? "border-white/[0.1] text-white hover:bg-white/[0.05]"
                    : "border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                }`}
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manual Sprint
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                onClick={() => setOpenPlanningDialog(true)}
              >
                <Sparkle className="h-4 w-4 mr-2" />
                AI Plan Sprint
              </Button>
            </div>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View - AI Sprint Cards */
        <div className="space-y-6">
          {/* AI Planned Sprints */}
          {aiPlannedSprints.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkle className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                  AI Planned Sprints
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-xs text-blue-400">
                  {aiPlannedSprints.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {aiPlannedSprints.map((sprint) => (
                  <SprintPlanCard
                    key={sprint._id}
                    sprint={sprint}
                    members={members}
                    onClick={() => setSelectedDetailSprint(sprint)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Sprints */}
          {regularSprints.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                  Manual Sprints
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs text-neutral-400 ${
                    isDark ? "bg-white/[0.05]" : "bg-neutral-100"
                  }`}
                >
                  {regularSprints.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {regularSprints.map((sprint) => (
                  <div
                    key={sprint._id}
                    onClick={() => {
                      setIsSettingsDialogOpen(true);
                      setSelectedSprint(sprint);
                    }}
                    className={`group backdrop-blur-sm rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                      isDark
                        ? "bg-neutral-900/40 border border-white/[0.06] hover:bg-neutral-900/60 hover:border-white/[0.1]"
                        : "bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm hover:shadow"
                    }`}
                  >
                    <h3
                      className={`text-base font-semibold mb-2 ${
                        isDark ? "text-white/90" : "text-neutral-900"
                      }`}
                    >
                      {sprint.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-3">
                      {format(parseISO(sprint.startDate), "MMM d")} —{" "}
                      {format(parseISO(sprint.endDate), "MMM d, yyyy")}
                    </p>
                    {sprint.goals?.length > 0 && (
                      <div
                        className={`text-sm line-clamp-2 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {sprint.goals[0]}
                      </div>
                    )}
                    <div
                      className={`mt-4 pt-3 flex items-center justify-between ${
                        isDark
                          ? "border-t border-white/[0.04]"
                          : "border-t border-neutral-100"
                      }`}
                    >
                      <span className="text-xs text-neutral-500">
                        {getSprintTasks(sprint._id).length} tasks
                      </span>
                      <div className="text-xs text-neutral-500">
                        {calculateSprintProgress(sprint._id)}% complete
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              className={`cursor-pointer ${
                isDark
                  ? "border-white/[0.1] text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  : "border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Sprint
            </Button>
          </div>
        </div>
      ) : (
        /* Table View */
        <Card
          className={
            isDark
              ? "bg-neutral-900/40 border-white/[0.06]"
              : "bg-white border-neutral-200"
          }
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className={isDark ? "text-white" : "text-neutral-900"}>
                All Sprints
              </CardTitle>
              <Button
                className="cursor-pointer"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Sprint
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SprintsTable
              sprints={sprints}
              calculateProgress={calculateSprintProgress}
              onStartSprint={handleStartSprint}
              onConfigure={(s) => {
                setIsSettingsDialogOpen(true);
                setSelectedSprint(s);
              }}
              onDelete={(s) => {
                setOpenDeleteDialog(true);
                setSelectedSprint(s);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <SprintModal
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSprint}
        mode="create"
      />
      <SprintSettingsModal
        open={isSettingsDialogOpen}
        onClose={() => {
          setIsSettingsDialogOpen(false);
          setSelectedSprint(null);
        }}
        sprint={selectedSprint}
        onSave={(updated) => updateSprint(updated._id, updated)}
      />
      {selectedSprint && (
        <SprintDangerZoneModal
          open={openDeleteDialog}
          onOpenChange={() => setOpenDeleteDialog(false)}
          sprintName={selectedSprint.name}
          onDelete={() => deleteSprint(selectedSprint._id)}
        />
      )}
      {openPlanningDialog && (
        <SprintPlannerModal
          isOpen={openPlanningDialog}
          onClose={() => setOpenPlanningDialog(false)}
        />
      )}

      {/* Sprint Detail Modal */}
      <SprintDetailModal
        open={!!selectedDetailSprint}
        onClose={() => setSelectedDetailSprint(null)}
        sprint={selectedDetailSprint}
        members={members}
      />
    </div>
  );
};
