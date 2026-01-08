"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "../atoms/avatar";

// ============================================================================
// Types
// ============================================================================

export type StoryMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  duration?: number; // in seconds, default 5 for images
};

export type CardStoryProps = {
  className?: string;
  // Profile info
  name: string;
  avatarSrc?: string;
  timestamp?: string; // e.g., "about 18 hours"
  // Media content
  media: StoryMedia[];
  initialIndex?: number;
  // Navigation between profiles
  onPrevProfile?: () => void;
  onNextProfile?: () => void;
  hasPrevProfile?: boolean;
  hasNextProfile?: boolean;
  // Actions
  onClose?: () => void;
  onStoryComplete?: () => void;
};

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_IMAGE_DURATION = 5; // seconds
const PROGRESS_UPDATE_INTERVAL = 16; // ms (~60fps for smooth animation)

// ============================================================================
// Component
// ============================================================================

const CardStory: React.FC<CardStoryProps> = ({
  className,
  name,
  avatarSrc,
  timestamp,
  media,
  initialIndex = 0,
  onPrevProfile,
  onNextProfile,
  hasPrevProfile = false,
  hasNextProfile = false,
  onClose,
  onStoryComplete,
}) => {
  // State
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Current media item
  const currentMedia = media[currentIndex];

  // ============================================================================
  // Handlers
  // ============================================================================

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMediaEnd = useCallback(() => {
    clearTimer();
    setProgress(0);

    // Check if there are more media items
    if (currentIndex < media.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Story complete - go to next profile or call onStoryComplete
      if (hasNextProfile && onNextProfile) {
        onNextProfile();
      } else {
        onStoryComplete?.();
      }
    }
  }, [
    currentIndex,
    media.length,
    hasNextProfile,
    onNextProfile,
    onStoryComplete,
    clearTimer,
  ]);

  const handlePrev = useCallback(() => {
    clearTimer();
    setProgress(0);

    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    if (currentIndex > 0) {
      // Go to previous media in current story
      setCurrentIndex((prev) => prev - 1);
    } else if (hasPrevProfile && onPrevProfile) {
      // Go to previous profile's story
      onPrevProfile();
    }
  }, [currentIndex, hasPrevProfile, onPrevProfile, clearTimer]);

  const handleNext = useCallback(() => {
    clearTimer();
    setProgress(0);

    if (currentIndex < media.length - 1) {
      // Go to next media in current story
      setCurrentIndex((prev) => prev + 1);
    } else if (hasNextProfile && onNextProfile) {
      // Go to next profile's story
      onNextProfile();
    } else {
      // No more stories
      onStoryComplete?.();
    }
  }, [
    currentIndex,
    media.length,
    hasNextProfile,
    onNextProfile,
    onStoryComplete,
    clearTimer,
  ]);

  // Touch hold to pause
  const handleTouchStart = useCallback(() => {
    setIsPaused(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPaused(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  }, []);

  // Video event handlers
  const handleVideoLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current && videoDuration > 0) {
      const videoProgress =
        (videoRef.current.currentTime / videoDuration) * 100;
      setProgress(videoProgress);
    }
  }, [videoDuration]);

  const handleVideoEnded = useCallback(() => {
    handleMediaEnd();
  }, [handleMediaEnd]);

  // ============================================================================
  // Effects
  // ============================================================================

  // Auto-advance for images
  useEffect(() => {
    if (!currentMedia || currentMedia.type === "video" || isPaused) {
      return;
    }

    const duration = (currentMedia.duration ?? DEFAULT_IMAGE_DURATION) * 1000;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_UPDATE_INTERVAL / duration) * 100;
        if (next >= 100) {
          handleMediaEnd();
          return 0;
        }
        return next;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    return () => {
      clearTimer();
    };
  }, [currentIndex, currentMedia, isPaused, handleMediaEnd, clearTimer]);

  // Reset state when media changes
  useEffect(() => {
    setProgress(0);
    setVideoDuration(0);

    // Auto-play video when media changes
    if (currentMedia?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  }, [currentIndex, currentMedia]);

  // ============================================================================
  // Progress calculation helper
  // ============================================================================

  const getSegmentProgress = (index: number): number => {
    if (index < currentIndex) return 100;
    if (index > currentIndex) return 0;
    return progress;
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (!currentMedia) {
    return null;
  }

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black",
        className,
      )}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Story container with 9:16 aspect ratio */}
      <div className="relative h-full w-full max-w-[calc(100vh*9/16)] sm:h-[calc(100vh-2rem)] sm:max-h-[900px] sm:overflow-hidden sm:rounded-xl">
        {/* Media container */}
        <div className="absolute inset-0">
          {currentMedia.type === "video" ? (
            <video
              ref={videoRef}
              key={currentMedia.id}
              src={currentMedia.src}
              autoPlay
              muted
              playsInline
              onLoadedMetadata={handleVideoLoadedMetadata}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              key={currentMedia.id}
              src={currentMedia.src}
              alt={`${name}'s story ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Gradient overlay for header readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Header section */}
        <div className="absolute inset-x-0 top-0 z-10">
          {/* Progress bars */}
          <div className="flex gap-1 px-4 pt-3">
            {media.map((item, index) => (
              <div
                key={item.id}
                className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white"
                  style={{
                    width: `${getSegmentProgress(index)}%`,
                    transition:
                      index === currentIndex ? "width 16ms linear" : "none",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Profile info and close button */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={avatarSrc}
                alt={name}
                initials={name.charAt(0).toUpperCase()}
                className="size-10 border-2 border-white/20"
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{name}</span>
                {timestamp && (
                  <span className="text-sm text-white/70">{timestamp}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Close story"
            >
              <X className="size-6 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation zones */}
        <div className="absolute inset-0 flex">
          {/* Left zone - previous */}
          <button
            type="button"
            className="h-full w-[30%] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            aria-label="Previous story"
          />

          {/* Right zone - next */}
          <button
            type="button"
            className="h-full w-[70%] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            aria-label="Next story"
          />
        </div>
      </div>

      {/* Chevron navigation - positioned outside story container but close to it */}
      {/* Left chevron - previous */}
      {(hasPrevProfile || currentIndex > 0) && (
        <button
          type="button"
          className="absolute top-1/2 left-[calc(50%-min(50%,calc(100vh*9/32))-2.5rem)] z-20 -translate-y-1/2 rounded-full p-1.5 text-white/70 transition-all hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          aria-label="Previous"
        >
          <ChevronLeft className="size-8" />
        </button>
      )}

      {/* Right chevron - next */}
      {(hasNextProfile || currentIndex < media.length - 1) && (
        <button
          type="button"
          className="absolute top-1/2 right-[calc(50%-min(50%,calc(100vh*9/32))-2.5rem)] z-20 -translate-y-1/2 rounded-full p-1.5 text-white/70 transition-all hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          aria-label="Next"
        >
          <ChevronRight className="size-8" />
        </button>
      )}
    </div>
  );
};

export default CardStory;
