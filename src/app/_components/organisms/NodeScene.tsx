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

  return (
    <div
      className={clsx(
        "relative w-56 overflow-hidden rounded-lg border border-border bg-muted shadow-md transition-all",
        selected && "ring-2 ring-primary",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
      />

      {/* Scenery thumbnail */}
      {sceneryImageSrc && (
        <div className="relative h-24 w-full">
          <Image
            src={sceneryImageSrc}
            alt="Scene background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/80" />
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
              className="size-8 border-2 border-background shadow-sm"
            />
            {characterName && (
              <span className="text-sm font-medium text-foreground">
                {characterName}
              </span>
            )}
          </div>
        )}

        {/* Dialogue preview */}
        {dialogue && (
          <p
            className={clsx(
              "text-sm text-foreground",
              (characterName ?? characterAvatarSrc) && "mt-2",
            )}
          >
            {truncateText(dialogue, MAX_DIALOGUE_LENGTH)}
          </p>
        )}

        {/* Fallback for empty scene */}
        {!dialogue && !characterName && !sceneryImageSrc && (
          <p className="text-sm italic text-muted-foreground">Empty scene</p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
      />
    </div>
  );
};

export default memo(NodeScene);
