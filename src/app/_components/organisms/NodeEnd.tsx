"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";

// ============================================================================
// Types
// ============================================================================

export type NodeEndData = Record<string, never>;

export type NodeEndProps = NodeProps & {
  data: NodeEndData;
  selected?: boolean;
};

// ============================================================================
// Component
// ============================================================================

const NodeEnd: React.FC<NodeEndProps> = ({ selected }) => {
  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label="End node - conclusion of the flow"
      className={clsx(
        "bg-destructive text-destructive-foreground flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium shadow-md transition-all",
        selected && "ring-ring ring-offset-background ring-2 ring-offset-2",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!border-background !bg-destructive !h-3 !w-3 !border-2"
        aria-label="Connect from previous node"
      />
      <span>End</span>
    </div>
  );
};

export default memo(NodeEnd);
