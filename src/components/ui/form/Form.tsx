"use client";

import { useForm } from "@mantine/form"; // or swap with react-hook-form
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import type { FormField as FormFieldType } from "@/types/form";

export const Form = ({
  fields,
  onSubmit,
  initialValues,
  submitText = "Submit",
}: {
  fields: FormFieldType[];
  onSubmit: (values: Record<string, any>) => Promise<void>;
  initialValues: Record<string, any>;
  submitText?: string;
}) => {
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
    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
      {fields.map((field) => (
        <FormField key={field.name} field={field} form={form} />
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </Button>
    </form>
  );
};
