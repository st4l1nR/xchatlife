"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import Image from "next/image";
import { Avatar } from "../atoms/avatar";

// ============================================================================
// Types
// ============================================================================

export type NodeSceneData = {
  characterName?: string;
  characterAvatarSrc?: string;
  dialogue?: string;
  sceneryImageSrc?: string;
};

export type NodeSceneProps = NodeProps & {
  data: NodeSceneData;
  selected?: boolean;
};

// ============================================================================
// Constants
// ============================================================================

const MAX_DIALOGUE_LENGTH = 50;

// ============================================================================
// Helper
// ============================================================================

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

// ============================================================================
// Component
// ============================================================================

const NodeScene: React.FC<NodeSceneProps> = ({ data, selected }) => {
  const { characterName, characterAvatarSrc, dialogue, sceneryImageSrc } = data;

  const ariaLabel = characterName
    ? `Scene: ${characterName}${dialogue ? ` says "${dialogue.slice(0, 30)}${dialogue.length > 30 ? "..." : ""}"` : ""}`
    : dialogue
      ? `Scene: ${dialogue.slice(0, 50)}${dialogue.length > 50 ? "..." : ""}`
      : "Empty scene";

  return (
    <div
      role="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={clsx(
        "border-border bg-muted relative w-56 overflow-hidden rounded-lg border shadow-md transition-all",
        selected && "ring-primary ring-2",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!border-background !bg-muted-foreground !h-3 !w-3 !border-2"
        aria-label="Connect from previous node"
      />

      {/* Scenery thumbnail */}
      {sceneryImageSrc && (
        <div className="relative h-24 w-full">
          <Image
            src={sceneryImageSrc}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="to-muted/80 absolute inset-0 bg-gradient-to-b from-transparent" />
        </div>
      )}

      {/* Content section */}
      <div className={clsx("p-3", !sceneryImageSrc && "pt-4")}>
        {/* Character badge */}
        {(characterName ?? characterAvatarSrc) && (
          <div
            className={clsx(
              "flex items-center gap-2",
              sceneryImageSrc && "-mt-6",
            )}
          >
            <Avatar
              src={characterAvatarSrc}
              alt={characterName ?? "Character"}
              initials={characterName?.charAt(0).toUpperCase()}
              className="border-background size-8 border-2 shadow-sm"
            />
            {characterName && (
              <span className="text-foreground text-sm font-medium">
                {characterName}
              </span>
            )}
          </div>
        )}

        {/* Dialogue preview */}
        {dialogue && (
          <p
            className={clsx(
              "text-foreground text-sm",
              (characterName ?? characterAvatarSrc) && "mt-2",
            )}
          >
            {truncateText(dialogue, MAX_DIALOGUE_LENGTH)}
          </p>
        )}

        {/* Fallback for empty scene */}
        {!dialogue && !characterName && !sceneryImageSrc && (
          <p className="text-muted-foreground text-sm italic">Empty scene</p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-background !bg-muted-foreground !h-3 !w-3 !border-2"
        aria-label="Connect to next node"
      />
    </div>
  );
};

export default memo(NodeScene);
