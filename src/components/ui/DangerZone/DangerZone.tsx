import React, { useState } from "react";
import { AlertCircle, Trash2, ShieldAlert } from "lucide-react";
import { Input } from "../input/Input";
import { Button } from "../button";
import { Modal } from "../modal/Modal";

interface DangerZoneModalProps {
  title: string;
  description: string;
  actionLabel: string;
  confirmText: string;
  onConfirm: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDestructive?: boolean;
  warningMessage?: string;
}

export const DangerZoneModal: React.FC<DangerZoneModalProps> = ({
  title,
  description,
  actionLabel,
  confirmText,
  onConfirm,
  open,
  onOpenChange,
  isDestructive = true,
  warningMessage = "This action cannot be undone. This will permanently delete this item and all of its data.",
}) => {
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleConfirmClick = () => {
    if (confirmationInput === confirmText) {
      onConfirm();
      setConfirmationInput("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setConfirmationInput("");
    onOpenChange(false);
  };

  const isConfirmButtonDisabled = confirmationInput !== confirmText;

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setConfirmationInput("");
        }
        onOpenChange(isOpen);
      }}
      title={title}
      size="md"
      hideTrigger
      showHeader={false}
      showFooter={false}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg text-destructive mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {warningMessage && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{warningMessage}</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">
            Type{" "}
            <span className="font-bold text-destructive">"{confirmText}"</span>{" "}
            to confirm
          </p>
          <Input
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={confirmText}
            autoFocus
            className="w-full"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "primary"}
            onClick={handleConfirmClick}
            disabled={isConfirmButtonDisabled}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
