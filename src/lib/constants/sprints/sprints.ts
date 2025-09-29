import { FormField } from "@/types/form";

export const SPRINT_FORM_FIELDS: FormField[] = [
  {
    name: "name",
    label: "Sprint Name",
    type: "text",
    required: true,
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    required: true,
  },
  {
    name: "goals",
    label: "Goals",
    type: "list", // ✅ generalized list instead of textarea
    required: false,
    placeholder: "Add a goal",
    addButtonLabel: "Add Goal",
  },
];
