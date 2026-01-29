"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import Image from "next/image";
import { Avatar } from "../atoms/avatar";
import DropdownVisualNovelNodes from "../molecules/DropdownVisualNovelNodes";
import type { NodeVariant } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export type NodeSceneData = {
  label?: string;
  characterName?: string;
  characterAvatarSrc?: string;
  dialogue?: string;
  sceneryImageSrc?: string;
  media?: {
    type: "image" | "video";
    url: string;
    file?: File;
  };
  onAddNode?: (variant: NodeVariant) => void;
  isEndOfPath?: boolean;
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

const NodeScene: React.FC<NodeSceneProps> = ({ id, data, selected }) => {
  const {
    label,
    characterName,
    characterAvatarSrc,
    dialogue,
    sceneryImageSrc,
    media,
    onAddNode,
    isEndOfPath,
  } = data;

  // Get the image URL from either sceneryImageSrc or media
  const imageUrl =
    sceneryImageSrc ?? (media?.type === "image" ? media.url : undefined);
  const videoUrl = media?.type === "video" ? media.url : undefined;
  const hasMedia = imageUrl ?? videoUrl;

  const ariaLabel = label
    ? `Scene: ${label}`
    : characterName
      ? `Scene: ${characterName}${dialogue ? ` says "${dialogue.slice(0, 30)}${dialogue.length > 30 ? "..." : ""}"` : ""}`
      : dialogue
        ? `Scene: ${dialogue.slice(0, 50)}${dialogue.length > 50 ? "..." : ""}`
        : "Empty scene";

  return (
    <div className="relative pb-10">
      {/* Card container with overflow-hidden */}
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

        {/* Label badge */}
        {label && (
          <div className="bg-primary/10 border-border border-b px-3 py-1.5">
            <span className="text-primary text-xs font-medium">{label}</span>
          </div>
        )}

        {/* Scenery/Media thumbnail */}
        {imageUrl && (
          <div className="relative h-24 w-full">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
              unoptimized
            />
            <div className="to-muted/80 absolute inset-0 bg-gradient-to-b from-transparent" />
          </div>
        )}

        {/* Video thumbnail */}
        {videoUrl && !imageUrl && (
          <div className="relative h-24 w-full">
            <video
              src={videoUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
            <div className="to-muted/80 absolute inset-0 bg-gradient-to-b from-transparent" />
          </div>
        )}

        {/* Content section */}
        <div className={clsx("p-3", !hasMedia && !label && "pt-4")}>
          {/* Character badge */}
          {(characterName ?? characterAvatarSrc) && (
            <div
              className={clsx("flex items-center gap-2", hasMedia && "-mt-6")}
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
          {!dialogue && !characterName && !hasMedia && !label && (
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

      {/* Add node button - outside overflow-hidden container */}
      {onAddNode && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
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

export default memo(NodeScene);
