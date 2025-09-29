import { UseFormReturnType } from "@mantine/form";

export type InputType =
  | "text"
  | "textarea"
  | "email"
  | "password"
  | "select"
  | "date"
  | "checkbox"
  | "number"
  | "radio"
  | "list"
  | "chip"
  | "file"
  | "custom";

export interface FormField {
  type: InputType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  span?: number;
  accept?: string; // For file inputs
  disabled?: boolean;
  multiple?: boolean; // For select and file inputs
  addButtonLabel?: string; // For list and chip inputs
  validation?: (value: any) => string | null; // Custom validation function
  render?: (form: UseFormReturnType<any>) => React.ReactNode; // For custom rendering
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (values: any) => void;
  form: UseFormReturnType<any>;
  spacing?: "sm" | "md" | "lg";
  submitButtonText?: string;
  validate?: (values: any) => Record<string, string>; // Async validation
}

export interface FormStep {
  title: string;
  fields: FormField[];
}

export interface FormStepperProps {
  steps: FormStep[];
  onSubmit: (values: any) => Promise<void> | void;
  initialValues: any;
}
