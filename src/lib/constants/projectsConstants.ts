import { FormField } from "@/types/form";

export const PROJECT_FIELDS: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Project Name",
    required: true,
    validation: (value: string) =>
      value.trim().length > 0 ? null : "Name is required",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    placeholder: "Project Description",
    required: true,
    validation: (value: string) =>
      value.trim().length > 0 ? null : "Description is required",
  },
];

export const PROJECTS = [
  //add some projects here
  {
    name: "Project One",
    description: "This is the first project.",
  },
  {
    name: "Project Two",
    description: "This is the second project.",
    starred: true,
  },
  {
    name: "Project Three",
    description: "This is the third project.",
    starred: true,
  },
  {
    name: "Project Four",
    description: "This is the fourth project.",
  },
  {
    name: "Project Five",
    description: "This is the fifth project.",
  },
];
