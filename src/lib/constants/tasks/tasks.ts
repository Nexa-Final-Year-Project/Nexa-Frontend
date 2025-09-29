export const TASK_FORM_FIELDS = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter task title",
    validation: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Enter task description",
    validation: {
      required: true,
      minLength: 10,
    },
  },
  {
    name: "assignee",
    label: "Assignee",
    type: "select",
    options: [], // This will be populated dynamically
    required: false,
  },
  {
    name: "dueDate",
    label: "Due Date",
    type: "date",
    required: false,
  },
  {
    name: "priority",
    label: "Priority",
    type: "radio",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
    required: false,
  },
  {
    name: "labels",
    label: "Labels",
    type: "multi-select",
    options: [], // This will be populated dynamically
    required: false,
  },
];
