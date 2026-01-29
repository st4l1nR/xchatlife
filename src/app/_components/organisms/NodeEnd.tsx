"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";

// ============================================================================
// Types
// ============================================================================

export type EndingType = "good" | "neutral" | "bad" | "secret";

export type NodeEndData = {
  label?: string;
  endingType?: EndingType;
};

export type NodeEndProps = NodeProps & {
  data: NodeEndData;
  selected?: boolean;
};

// ============================================================================
// Constants
// ============================================================================

const ENDING_TYPE_STYLES: Record<
  EndingType,
  { bg: string; text: string; border: string; ring: string }
> = {
  good: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
    ring: "ring-green-500",
  },
  neutral: {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-600",
    ring: "ring-gray-500",
  },
  bad: {
    bg: "bg-destructive",
    text: "text-destructive-foreground",
    border: "border-destructive",
    ring: "ring-destructive",
  },
  secret: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
    ring: "ring-purple-500",
  },
};

// ============================================================================
// Component
// ============================================================================

const NodeEnd: React.FC<NodeEndProps> = ({ data, selected }) => {
  const { label, endingType = "neutral" } = data;
  const displayLabel = label ?? "End";
  const styles = ENDING_TYPE_STYLES[endingType];

  const ariaLabel = `End node: ${displayLabel} (${endingType} ending)`;

  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={clsx(
        "flex flex-col items-center justify-center rounded-full px-6 py-2 text-sm font-medium shadow-md transition-all",
        styles.bg,
        styles.text,
        selected &&
          `ring-offset-background ring-2 ring-offset-2 ${styles.ring}`,
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={clsx(
          "!border-background !h-3 !w-3 !border-2",
          styles.bg.replace("bg-", "!bg-"),
        )}
        aria-label="Connect from previous node"
      />
      <span>{displayLabel}</span>
      {endingType !== "neutral" && (
        <span className="text-xs opacity-80">{endingType}</span>
      )}
    </div>
  );
};

export default memo(NodeEnd);
