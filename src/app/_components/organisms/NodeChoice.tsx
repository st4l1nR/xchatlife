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

  return (
    <div
      className={clsx(
        "flex min-w-40 max-w-56 items-center gap-2 rounded-lg border border-border bg-muted px-4 py-3 shadow-md transition-all",
        selected && "ring-2 ring-primary",
      )}
    >
      {/* Target handle (input) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
      />

      {/* Index badge */}
      {index !== undefined && (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
          {index}
        </span>
      )}

      {/* Choice text */}
      <span className="flex-1 text-sm text-foreground">{text}</span>

      {/* Source handle (output) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-background !bg-primary"
      />
    </div>
  );
};

export default memo(NodeChoice);
