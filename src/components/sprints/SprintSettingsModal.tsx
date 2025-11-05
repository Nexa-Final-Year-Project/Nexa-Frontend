import React, { useEffect } from "react";
import { Modal } from "../ui/modal/Modal";
import { Button } from "../ui/button";
import { Sprint as SprintType } from "@/types/sprint";
import { format, parseISO } from "date-fns";
import { Calendar, Users, Target } from "lucide-react";
import { useForm } from "@mantine/form";
import { SPRINT_FORM_FIELDS } from "@/lib/constants/sprints/sprints";
import { FormField } from "../ui/form/FormField";

interface SprintSettingsModalProps {
  open: boolean;
  onClose: () => void;
  sprint: SprintType | null;
  onSave: (updatedSprint: SprintType) => void;
}

export const SprintSettingsModal: React.FC<SprintSettingsModalProps> = ({
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
      form.setValues({
        name: sprint.name || sprint.sprintName || "",
        goals: sprint.goals || [],
        startDate: sprint.startDate || "",
        endDate: sprint.endDate || "",
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

  if (!sprint) return null;

  return (
    <Modal title="Sprint Settings" open={open} onOpenChange={onClose} size="lg">
      <div className="space-y-6">
        {/* Sprint Overview */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Sprint Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(parseISO(sprint.startDate), "MMM d")} -{" "}
                {format(parseISO(sprint.endDate), "MMM d")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{form.values.goals.length} Goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Project: {sprint.project || sprint.projectId}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          {SPRINT_FORM_FIELDS.map((field) => (
            <FormField key={field.name} field={field} form={form} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};
