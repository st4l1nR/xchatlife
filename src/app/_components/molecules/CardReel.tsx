"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Heart } from "lucide-react";
import { Avatar } from "../atoms/avatar";
import { Button } from "../atoms/button";

// ============================================================================
// Types
// ============================================================================

export type CardReelProps = {
  className?: string;
  id?: string;
  // Content
  name: string;
  avatarSrc?: string;
  videoSrc: string;
  posterSrc?: string;
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

const CardReel: React.FC<CardReelProps> = ({
  className,
  name,
  avatarSrc,
  videoSrc,
  posterSrc,
  likeCount,
  isLiked = false,
  onLikeToggle,
  isLoggedIn,
  chatUrl,
  onChatClick,
  onAuthRequired,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Autoplay video when visible using Intersection Observer
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay may be blocked by browser
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

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

    // Require auth for liking
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    onLikeToggle?.();
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative flex h-full max-h-[90vh] w-full items-center justify-center",
        className,
      )}
    >
      {/* Video container */}
      <div className="bg-muted relative aspect-[9/16] h-full max-h-full overflow-hidden rounded-2xl">
        {/* Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Bottom content - Avatar, Name, Chat button */}
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={avatarSrc}
              alt={name}
              initials={name.charAt(0).toUpperCase()}
              className="size-12 border-2 border-white/20"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-lg font-bold text-white">{name}</span>
              <Button
                color="primary"
                href={isLoggedIn ? chatUrl : undefined}
                onClick={handleChatClick}
              >
                Chat Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar - Like button at bottom */}
      <div className="flex flex-col items-center gap-1 self-end px-2 pb-4">
        <button
          type="button"
          onClick={handleLikeClick}
          className="flex flex-col items-center gap-1"
        >
          <Heart
            className={clsx(
              "size-8 transition-all duration-200",
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

export default CardReel;
