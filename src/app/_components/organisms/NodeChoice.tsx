"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";

// ============================================================================
// Types
// ============================================================================

export type NodeChoiceData = {
  text: string;
  index?: number;
};

export type NodeChoiceProps = NodeProps & {
  data: NodeChoiceData;
  selected?: boolean;
};

// ============================================================================
// Component
// ============================================================================

const NodeChoice: React.FC<NodeChoiceProps> = ({ data, selected }) => {
  const { text, index } = data;

  const ariaLabel =
    index !== undefined ? `Choice ${index}: ${text}` : `Choice: ${text}`;

  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={clsx(
        "border-border bg-muted flex max-w-56 min-w-40 items-center gap-2 rounded-lg border px-4 py-3 shadow-md transition-all",
        selected && "ring-primary ring-2",
      )}
    >
      {/* Target handle (input) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!border-background !bg-muted-foreground !h-3 !w-3 !border-2"
        aria-label="Connect from previous node"
      />

      {/* Index badge */}
      {index !== undefined && (
        <span className="bg-primary/20 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {index}
        </span>
      )}

      {/* Choice text */}
      <span className="text-foreground flex-1 text-sm">{text}</span>

      {/* Source handle (output) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!border-background !bg-primary !h-3 !w-3 !border-2"
        aria-label="Connect to next node"
      />
    </div>
  );
};

export default memo(NodeChoice);
