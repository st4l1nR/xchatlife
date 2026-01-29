"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import DropdownVisualNovelNodes from "../molecules/DropdownVisualNovelNodes";
import type { NodeVariant } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export type NodeStartData = {
  onAddNode?: (variant: NodeVariant) => void;
  isEndOfPath?: boolean;
};

export type NodeStartProps = NodeProps & {
  data: NodeStartData;
  selected?: boolean;
};

// ============================================================================
// Component
// ============================================================================

const NodeStart: React.FC<NodeStartProps> = ({ id, data, selected }) => {
  const { onAddNode, isEndOfPath } = data;

  return (
    <div className="relative">
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

      {/* Add node button */}
      {onAddNode && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
          <DropdownVisualNovelNodes
            parentNodeId={id}
            isEndOfPath={isEndOfPath}
            onSelect={onAddNode}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default memo(NodeStart);
