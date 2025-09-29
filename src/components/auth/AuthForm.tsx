// components/ui/auth/AuthForm.tsx
"use client";

import { Form } from "@/components/ui/form/Form";
import { FormField } from "@/types/form";
import { Button } from "@mantine/core";
import { motion } from "framer-motion";

interface AuthFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const AuthForm = ({
  fields,
  onSubmit,
  submitButtonText,
  isLoading = false,
  error,
  className = "",
}: AuthFormProps) => {
  const initialValues = Object.fromEntries(
    fields.map(field => [field.name, ""])
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-sm text-red-300 bg-red-500/20 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <Form
        fields={fields}
        onSubmit={onSubmit}
        initialValues={initialValues}
        submitButtonText={submitButtonText}

      />
      
    </div>
  );
};