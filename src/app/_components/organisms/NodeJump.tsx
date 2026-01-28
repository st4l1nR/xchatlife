"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type NodeJumpData = {
  label?: string;
  targetNodeId?: string;
  targetNodeLabel?: string;
};

export type NodeJumpProps = NodeProps & {
  data: NodeJumpData;
  selected?: boolean;
};

// ============================================================================
// Component
// ============================================================================

const NodeJump: React.FC<NodeJumpProps> = ({ data, selected }) => {
  const { label, targetNodeLabel } = data;

  const displayLabel = label ?? "Jump";
  const ariaLabel = targetNodeLabel
    ? `Jump to ${targetNodeLabel}`
    : `Jump node: ${displayLabel}`;

  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={clsx(
        "flex min-w-28 items-center gap-2 rounded-lg border px-4 py-3 shadow-md transition-all",
        "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
        selected && "ring-2 ring-blue-500",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!border-background !h-3 !w-3 !border-2 !bg-blue-500"
        aria-label="Connect from previous node"
      />

      {/* Icon */}
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <RotateCcw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {displayLabel}
        </span>
        {targetNodeLabel && (
          <span className="text-xs text-blue-600 dark:text-blue-400">
            to: {targetNodeLabel}
          </span>
        )}
      </div>

      {/* Note: Jump nodes typically don't have output handles since they redirect */}
    </div>
  );
};

export default memo(NodeJump);
