"use client";

import { Button } from "@/components/ui/button/Button";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Form } from "../form/Form";
import { ReactNode } from "react";
import { FormField } from "@/types/form";

interface ModalProps {
  triggerText?: string;
  hideTrigger?: boolean;
  triggerVariant?: "default" | "outline" | "ghost" | "link";
  triggerIcon?: ReactNode;
  title: string;
  description?: string;
  formFields?: FormField[];
  initialValues?: Record<string, unknown>;
  submitButtonText?: string;
  onSubmit?: (values: Record<string, unknown>) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  footerContent?: ReactNode;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  // New controlled props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const sizeClasses = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[600px]",
  lg: "sm:max-w-[800px]",
  xl: "sm:max-w-[1100px]",
};

export function Modal({
  triggerText = "Open Dialog",
  hideTrigger = false,
  triggerVariant = "outline",
  triggerIcon,
  title,
  description,
  formFields,
  initialValues = {},
  submitButtonText = "Submit",
  onSubmit = () => {},
  showHeader = true,
  showFooter = false,
  footerContent,
  children,
  size = "sm",
  // Controlled state
  open,
  onOpenChange,
}: ModalProps) {
  const { theme } = useTheme();
  const titleColorClass = theme === "light" ? "text-black" : "text-white";
  // When using controlled mode, we shouldn't render the trigger at all
  const shouldRenderTrigger = !hideTrigger && open === undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {shouldRenderTrigger && (
        <DialogTrigger asChild>
          <Button variant={triggerVariant}>
            {triggerIcon && <span className="mr-2">{triggerIcon}</span>}
            {triggerText}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={`${sizeClasses[size]} max-h-[85vh] flex flex-col`}
      >
        {showHeader && (
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className={titleColorClass}>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
          {formFields ? (
            <Form
              key={open ? "form-open" : "form-closed"}
              fields={formFields}
              onSubmit={(values) => {
                onSubmit(values);
                onOpenChange?.(false); // Close after submit
              }}
              initialValues={initialValues}
              submitButtonText={submitButtonText}
            />
          ) : (
            children
          )}
        </div>

        {showFooter && (
          <DialogFooter>
            {footerContent || (
              <>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{submitButtonText}</Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
