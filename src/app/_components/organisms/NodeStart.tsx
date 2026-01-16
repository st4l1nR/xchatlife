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
      className={clsx(
        "flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
      )}
    >
      <span>Start</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-background !bg-primary"
      />
    </div>
  );
};

export default memo(NodeStart);
