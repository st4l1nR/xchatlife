"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Heart } from "lucide-react";
import { Avatar } from "../atoms/avatar";
import { Button } from "../atoms/button";

// ============================================================================
// Types
// ============================================================================

export type CardReelOverlayProps = {
  className?: string;
  // Content
  name: string;
  avatarSrc?: string;
  // Like state
  likeCount: number;
  isLiked?: boolean;
  onLikeToggle?: () => void;
  // Auth & Chat
  isLoggedIn: boolean;
  chatUrl?: string;
  onChatClick?: () => void;
  onAuthRequired?: () => void;
};

// ============================================================================
// Helpers
// ============================================================================

function formatLikeCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// ============================================================================
// Component
// ============================================================================

const CardReelOverlay: React.FC<CardReelOverlayProps> = ({
  className,
  name,
  avatarSrc,
  likeCount,
  isLiked = false,
  onLikeToggle,
  isLoggedIn,
  chatUrl,
  onChatClick,
  onAuthRequired,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }

    onChatClick?.();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    onLikeToggle?.();
  };

  return (
    <div className={clsx("pointer-events-none absolute inset-0", className)}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Bottom content */}
      <div className="pointer-events-auto absolute right-0 bottom-0 left-0 flex items-end justify-between p-4">
        {/* Left section - Avatar, Name, Chat button */}
        <div className="flex items-center gap-3">
          <Avatar
            src={avatarSrc}
            alt={name}
            initials={name.charAt(0).toUpperCase()}
            className="size-14 border-2 border-white/20"
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xl font-bold text-white">{name}</span>
            <Button
              color="primary"
              href={isLoggedIn ? chatUrl : undefined}
              onClick={handleChatClick}
            >
              Chat Now
            </Button>
          </div>
        </div>

        {/* Right section - Like button */}
        <button
          type="button"
          onClick={handleLikeClick}
          className="flex flex-col items-center gap-1"
        >
          <Heart
            className={clsx(
              "size-7 transition-all duration-200",
              isLiked
                ? "fill-red-500 text-red-500"
                : "fill-transparent text-white",
              isAnimating && "animate-like-bounce",
            )}
            style={
              isAnimating
                ? {
                    animation: "likeAnimation 300ms ease-out",
                  }
                : undefined
            }
          />
          <span className="text-sm font-medium text-white">
            {formatLikeCount(likeCount)}
          </span>
        </button>
      </div>

      {/* Inline keyframes for like animation */}
      <style jsx>{`
        @keyframes likeAnimation {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CardReelOverlay;
