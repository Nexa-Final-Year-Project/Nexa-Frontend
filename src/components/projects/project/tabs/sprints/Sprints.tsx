"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Sparkle } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { Task } from "@/types/task";
import { Sprint as SprintType } from "@/types/sprint";
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

/* -------------------- Props -------------------- */
interface SprintsProps {
  projectId: string;
  tasks?: Task[];
  sprints: SprintType[];
}

/* -------------------- Main Component -------------------- */
export const Sprints = ({ projectId, tasks = [], sprints }: SprintsProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<SprintType | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPlanningDialog, setOpenPlanningDialog] = useState(false);
  const {
    createSprint,
    updateSprint,
    deleteSprint,
    generateSprints: planSprints,
  } = useSprints();

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

  const latestSprint = sprints?.length
    ? sprints.reduce(
        (latest, sprint) =>
          !latest || isAfter(parseISO(sprint.endDate), parseISO(latest.endDate))
            ? sprint
            : latest,
        null as SprintType | null
      )
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sprints Overview</h1>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center !text-sm !p-2"
          onClick={() => {
            setOpenPlanningDialog(true);
          }}
        >
          <Sparkle className="w-4 h-4 mr-2" />
          Plan Sprints
        </Button>
      </div>
      {latestSprint && (
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sprints</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Sprint
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!sprints?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No sprints found for this project
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

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
          handleSubmit={(data) => {
            planSprints(data.description, projectId, data?.name || "");
            setOpenPlanningDialog(false);
          }}
          sprints={sprints}
        />
      )}
    </div>
  );
};
