"use client";

import { ReactNode } from "react";
import { CircleAlertIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title: string;
  description: string;
  triggerLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "destructive";
  onConfirm?: () => void;
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  triggerLabel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon = <CircleAlertIcon className="opacity-80" size={16} />,
  variant = "outline",
  onConfirm,
  hideTrigger = false,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <AlertDialogTrigger asChild>
          <Button variant={variant}>{triggerLabel}</Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            {icon}
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
