"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";

// ============================================================================
// Types
// ============================================================================

export type NodeStartData = Record<string, never>;

export type NodeStartProps = NodeProps & {
  data: NodeStartData;
  selected?: boolean;
};

// ============================================================================
// Component
// ============================================================================

const NodeStart: React.FC<NodeStartProps> = ({ selected }) => {
  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label="Start node - beginning of the flow"
      className={clsx(
        "bg-primary text-primary-foreground flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium shadow-md transition-all",
        selected && "ring-ring ring-offset-background ring-2 ring-offset-2",
      )}
    >
      <span>Start</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-background !bg-primary !h-3 !w-3 !border-2"
        aria-label="Connect to next node"
      />
    </div>
  );
};

export default memo(NodeStart);
