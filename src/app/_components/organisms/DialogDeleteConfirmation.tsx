import React from "react";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";

export type DialogDeleteConfirmationProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  itemType: "reel" | "story" | "private content" | "character";
  itemName?: string;
};

const DialogDeleteConfirmation: React.FC<DialogDeleteConfirmationProps> = ({
  className,
  open,
  onClose,
  onConfirm,
  loading = false,
  itemType,
  itemName,
}) => {
  const displayItemType =
    itemType === "private content" ? "private content" : itemType;

  return (
    <Dialog className={clsx("", className)} open={open} onClose={onClose}>
      <DialogTitle className="flex items-center gap-2">
        <AlertTriangle className="text-destructive h-5 w-5" />
        Delete {displayItemType}
      </DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this {displayItemType}
        {itemName ? ` "${itemName}"` : ""}? This action cannot be undone.
      </DialogDescription>
      <DialogBody />
      <DialogActions>
        <Button plain onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteConfirmation;
