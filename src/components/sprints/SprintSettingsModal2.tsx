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
      <div className="max-h-[75vh] overflow-y-auto hide-scrollbar p-4">
        <div className="bg-gradient-to-br from-white/6 to-white/3 dark:from-slate-900/50 dark:to-slate-900/40 backdrop-blur rounded-2xl border border-white/6 p-5 shadow-lg">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold">{sprint.name || "Sprint"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Edit sprint settings, review health and velocity, and manage
                assigned members.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Dates</div>
              <div className="font-medium">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              <div className="space-y-3">
                {SPRINT_FORM_FIELDS.map((field) => (
                  <FormField key={field.name} field={field} form={form} />
                ))}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Goals</h4>
                <div className="flex flex-col gap-2">
                  {form.values.goals && form.values.goals.length ? (
                    form.values.goals.map((g, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary border border-primary/20 break-words"
                      >
                        {g}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No goals yet
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Assigned Members</h4>
                <div className="flex -space-x-3 items-center">
                  {assignedMemberObjs.length ? (
                    assignedMemberObjs.map((m, i) => (
                      <div
                        key={`${m._id ?? m.email ?? m.name ?? i}`}
                        className="mr-2"
                      >
                        <TeamMemberAvatar
                          name={m.name}
                          role={m.role}
                          avatarUrl={m.avatar || undefined}
                        />
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No members assigned
                    </span>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="p-4 bg-white/3 dark:bg-slate-900/40 rounded-xl border border-white/6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Velocity
                    </div>
                    <div className="text-lg font-semibold">
                      {(sprint as any).velocity ?? "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="font-medium">
                      {(sprint as any).status ?? "—"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sprint Health
                  </div>
                  <HealthBar value={(sprint as any).sprintHealthScore} />
                </div>
              </div>

              <div className="p-4 bg-white/3 dark:bg-slate-900/40 rounded-xl border border-white/6">
                <h5 className="text-sm font-medium mb-2">AI Summary</h5>
                <div className="text-sm text-muted-foreground">
                  {(sprint as any).meta?.aiSummary ||
                    (sprint as any).aiSummary ||
                    "No AI summary"}
                </div>
              </div>

              <div className="p-4 bg-white/3 dark:bg-slate-900/40 rounded-xl border border-white/6">
                <h5 className="text-sm font-medium mb-2">Tasks</h5>
                <div className="text-sm">
                  Total:{" "}
                  <span className="font-semibold">
                    {(sprint as any).tasks?.length ?? 0}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    ["High", "bg-red-500"],
                    ["Medium", "bg-amber-500"],
                    ["Low", "bg-green-500"],
                  ].map(([p, color]) => (
                    <div key={p} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${color}`}
                        />
                        <span className="text-sm">{p}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {
                          ((sprint as any).tasks || []).filter(
                            (t: any) => t.priority === p
                          ).length
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="flex justify-end items-center gap-3 mt-6">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-indigo-600 text-white"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function HealthBar({ value }: { value?: number | string }) {
  const v = typeof value === "number" ? value : Number(value) || 0;
  const pct = Math.max(0, Math.min(100, Math.round(v)));
  return (
    <div>
      <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1">{pct}% healthy</div>
    </div>
  );
}

export const SprintSettingsModal = SprintSettingsModal2;

export default SprintSettingsModal2;
