"use client";

import { useForm } from "@mantine/form"; // or swap with react-hook-form
import { useState, useEffect, useMemo } from "react";
// Assuming "@/components/ui/button" is the component where you want the cursor style
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import type { FormField as FormFieldType } from "@/types/form";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

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
  const isDark = theme === "dark";

  // Ensure all fields have defined initial values to prevent controlled/uncontrolled issues
  const safeInitialValues = useMemo(() => {
    const safe: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "list") {
        safe[field.name] = initialValues[field.name] ?? [];
      } else if (field.type === "checkbox") {
        safe[field.name] = initialValues[field.name] ?? false;
      } else {
        safe[field.name] = initialValues[field.name] ?? "";
      }
    });
    return safe;
  }, [fields, initialValues]);

  const form = useForm({ initialValues: safeInitialValues });
  const [loading, setLoading] = useState(false);

  // Reset form when initialValues change
  useEffect(() => {
    form.setValues(safeInitialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(safeInitialValues)]);

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
      className={`space-y-6 ${isDark ? "text-white" : "text-neutral-900"}`}
    >
      {fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FormField field={field} form={form} />
        </motion.div>
      ))}

      <motion.div
        className="flex justify-center pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: fields.length * 0.1 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-sm"
        >
          <Button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer relative overflow-hidden ${
              isDark
                ? "bg-white text-neutral-900 hover:bg-white/90"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            } font-medium py-3 rounded-xl transition-all duration-300 border-0`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className={`w-4 h-4 border-2 ${
                    isDark
                      ? "border-neutral-300 border-t-neutral-900"
                      : "border-white/30 border-t-white"
                  } rounded-full`}
                />
                Processing...
              </span>
            ) : (
              submitButtonText
            )}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
};
