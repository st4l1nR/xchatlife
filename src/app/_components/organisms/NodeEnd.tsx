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
      className={clsx(
        "flex items-center justify-center rounded-full bg-destructive px-6 py-2 text-sm font-medium text-destructive-foreground shadow-md transition-all",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-background !bg-destructive"
      />
      <span>End</span>
    </div>
  );
};

export default memo(NodeEnd);
