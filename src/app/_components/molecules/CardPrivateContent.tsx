"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { ThumbsUp, Images, Lock, Gem } from "lucide-react";
import { Button } from "../atoms/button";

// ============================================================================
// Types
// ============================================================================

export type PrivateContentMediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnailSrc?: string;
};

export type CardPrivateContentProps = {
  className?: string;
  // Content
  imageSrc: string;
  description?: string;
  // Stats (shown inside image area at top-left)
  likeCount?: number;
  imageCount?: number;
  // Locked state
  locked?: boolean;
  tokenCost?: number;
  onUnlock?: () => void;
  isUnlocking?: boolean;
  // Unlocked interactions
  onClick?: () => void;
  // Bottom like count (shown outside card)
  bottomLikeCount?: number;
  // Media array for gallery view (when unlocked)
  media?: PrivateContentMediaItem[];
};

// ============================================================================
// Main Component
// ============================================================================

const CardPrivateContent: React.FC<CardPrivateContentProps> = ({
  className,
  imageSrc,
  description,
  likeCount,
  imageCount,
  locked = true,
  tokenCost,
  onUnlock,
  isUnlocking,
  onClick,
  bottomLikeCount,
}) => {
  const isClickable = !locked && onClick;

  return (
    <div className="bg-primary-foreground/20 rounded-2xl p-4">
      <div className={clsx("flex flex-col gap-2", className)}>
        {/* Card container */}
        <div
          className={clsx(
            "group relative w-full overflow-hidden rounded-2xl",
            isClickable && "cursor-pointer",
          )}
          onClick={isClickable ? onClick : undefined}
          role={isClickable ? "button" : undefined}
          tabIndex={isClickable ? 0 : undefined}
          onKeyDown={
            isClickable
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                  }
                }
              : undefined
          }
        >
          {/* Background image that covers entire card (blurred when locked) */}
          <Image
            src={imageSrc}
            alt={locked ? "Locked content preview" : description || "Content"}
            fill
            unoptimized
            className={clsx(
              "object-cover transition-all duration-300",
              locked && "scale-110 blur-lg",
              !locked && "group-hover:scale-105",
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          />

          {/* Dark overlay for locked state */}
          {locked && <div className="absolute inset-0 bg-black/40" />}

          {/* Gradient overlay for unlocked state */}
          {!locked && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          )}

          {/* Content wrapper */}
          <div className="relative flex flex-col">
            {/* Main content area with aspect ratio */}
            <div className="relative aspect-[4/5] w-full grow">
              {/* Stats badges (top-left inside image) */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {likeCount !== undefined && (
                  <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <ThumbsUp className="size-3.5" />
                    {likeCount}
                  </div>
                )}
                {imageCount !== undefined && (
                  <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Images className="size-3.5" />
                    {imageCount}
                  </div>
                )}
              </div>

              {/* Locked state content */}
              {locked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  {/* Lock icon */}
                  <div className="flex size-16 items-center justify-center rounded-full border-2 border-white/30 bg-black/30 backdrop-blur-sm">
                    <Lock className="size-7 text-white" />
                  </div>

                  {/* Token cost */}
                  {tokenCost !== undefined && (
                    <div className="text-primary flex items-center gap-1.5 text-sm font-semibold">
                      <Gem className="size-4" />
                      {tokenCost}
                    </div>
                  )}

                  {/* Description */}
                  {description && (
                    <p className="mt-1 line-clamp-2 text-center text-xs text-white/80">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* Unlocked state content */}
              {!locked && (
                <div className="absolute right-0 bottom-0 left-0 p-4">
                  {description && (
                    <p className="line-clamp-2 text-sm text-white/90">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Unlock button (at bottom of card) */}
            {locked ? (
              <div className="p-3">
                <Button
                  color="primary"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onUnlock?.();
                  }}
                  loading={isUnlocking}
                  className="w-full"
                >
                  <Lock data-slot="icon" className="size-4" />
                  Unlock
                </Button>
              </div>
            ) : (
              /* Spacer to maintain consistent card height */
              <div className="p-3">
                <div className="h-10" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom like count (outside card) */}
        {bottomLikeCount !== undefined && (
          <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
            <ThumbsUp className="size-3.5" />
            {bottomLikeCount.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPrivateContent;
