"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import DropdownVisualNovelNodes from "../molecules/DropdownVisualNovelNodes";
import type { NodeVariant } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export type NodeChoiceData = {
  text: string;
  index?: number;
  label?: string;
  onAddNode?: (variant: NodeVariant) => void;
  isEndOfPath?: boolean;
};

export type NodeChoiceProps = NodeProps & {
  data: NodeChoiceData;
  selected?: boolean;
};

// ============================================================================
// Component
// ============================================================================

const NodeChoice: React.FC<NodeChoiceProps> = ({ id, data, selected }) => {
  const { text, index, label, onAddNode, isEndOfPath } = data;

  // Use label if provided (for branch variant), otherwise use text
  const displayText = label ?? text;

  const ariaLabel =
    index !== undefined
      ? `Choice ${index}: ${displayText}`
      : `Choice: ${displayText}`;

  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={clsx(
        "border-border bg-muted relative flex h-10 w-20 items-center justify-center gap-1 rounded-lg border px-2 py-1 shadow-md transition-all",
        selected && "ring-primary ring-2",
      )}
    >
      {/* Target handle (input) - top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!border-background !bg-muted-foreground !h-3 !w-3 !border-2"
        aria-label="Connect from previous node"
      />

      {/* Choice text - truncated for small node */}
      <span className="text-foreground truncate text-xs font-medium">
        {displayText}
      </span>

      {/* Source handle (output) - bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-background !bg-primary !h-3 !w-3 !border-2"
        aria-label="Connect to next node"
      />

      {/* Add node button - positioned below the node */}
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

export default memo(NodeChoice);
