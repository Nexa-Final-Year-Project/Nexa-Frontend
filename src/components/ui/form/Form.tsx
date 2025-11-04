"use client";

import { useForm } from "@mantine/form"; // or swap with react-hook-form
import { useState } from "react";
// Assuming "@/components/ui/button" is the component where you want the cursor style
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import type { FormField as FormFieldType } from "@/types/form";
import { useTheme } from "next-themes";

export const Form = ({
  fields,
  onSubmit,
  initialValues,
  submitButtonText = "Submit",
}: {
  fields: FormFieldType[];
  onSubmit: (values: Record<string, any>) => Promise<void>;
  initialValues: Record<string, any>;
  submitButtonText?: string;
}) => {
  const { theme } = useTheme();
  const form = useForm({ initialValues });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className={`space-y-6 ${theme === "light" ? "text-black" : "text-white"}`}
    >
      {fields.map((field) => (
        <FormField key={field.name} field={field} form={form} />
      ))}

      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          disabled={loading}
          // Added cursor-pointer class to ensure the button is clickable
          className="max-w-sm w-full cursor-pointer"
        >
          {loading ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};
