// constants/authFormFields.ts
import { FormField } from "@/types/form";

export const LOGIN_FIELDS: FormField[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "your@email.com",
    required: true,
    validation: (value: string) =>
      /^\S+@\S+$/.test(value) ? null : "Invalid email address",
  },
  // {
  //   type: "password",
  //   name: "password",
  //   label: "Password",
  //   placeholder: "••••••••",
  //   required: true,
  //   validation: (value: string) =>
  //     value.length >= 6 ? null : "Password must be at least 6 characters",
  // },
];

export const REGISTER_FIELDS: FormField[] = [
  ...LOGIN_FIELDS,
  {
    type: "text",
    name: "name",
    label: "Full Name",
    placeholder: "John Doe",
    required: true,
    validation: (value: string) =>
      value.trim().length > 0 ? null : "Name is required",
  },
];

export const EMAIL_VERIFICATION_FIELDS: FormField[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "your@email.com",
    required: true,
    validation: (value: string) =>
      /^\S+@\S+$/.test(value) ? null : "Invalid email address",
  },
];

export const PASSWORD_RESET_FIELDS: FormField[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "your@email.com",
    required: true,
    validation: (value: string) =>
      /^\S+@\S+$/.test(value) ? null : "Invalid email address",
  },
];
