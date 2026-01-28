"use client";

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
import type { NodeVariant } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export interface DialogDeleteNodeProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  nodeVariant?: NodeVariant;
  nodeName?: string;
  hasChildren?: boolean;
}

// ============================================================================
// Component
// ============================================================================

const DialogDeleteNode: React.FC<DialogDeleteNodeProps> = ({
  className,
  open,
  onClose,
  onConfirm,
  loading = false,
  nodeVariant = "scene",
  nodeName,
  hasChildren = false,
}) => {
  // Get display name for the node type
  const nodeTypeName =
    nodeVariant === "scene"
      ? "scene"
      : nodeVariant === "branch"
        ? "choice"
        : nodeVariant === "jump"
          ? "jump"
          : nodeVariant === "end"
            ? "ending"
            : "node";

  return (
    <Dialog className={clsx("", className)} open={open} onClose={onClose}>
      <DialogTitle className="flex items-center gap-2">
        <AlertTriangle className="text-destructive h-5 w-5" />
        Delete {nodeTypeName}
      </DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this {nodeTypeName}
        {nodeName ? ` "${nodeName}"` : ""}?
        {hasChildren && (
          <span className="text-destructive mt-2 block font-medium">
            Warning: This will also delete all connected downstream nodes.
          </span>
        )}
        <span className="mt-2 block">This action cannot be undone.</span>
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

export default DialogDeleteNode;
