"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type GalleryMediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnailSrc?: string;
  alt?: string;
};

export type GalleryPrivateContentProps = {
  className?: string;
  items: GalleryMediaItem[];
  initialIndex?: number;
  onItemChange?: (item: GalleryMediaItem, index: number) => void;
};

// ============================================================================
// Main Component
// ============================================================================

const GalleryPrivateContent: React.FC<GalleryPrivateContentProps> = ({
  className,
  items,
  initialIndex = 0,
  onItemChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selectedItem = items[selectedIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      onItemChange?.(items[newIndex]!, newIndex);
    }
  }, [selectedIndex, items, onItemChange]);

  const goToNext = useCallback(() => {
    if (selectedIndex < items.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      onItemChange?.(items[newIndex]!, newIndex);
    }
  }, [selectedIndex, items, onItemChange]);

  // Select specific item
  const selectItem = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        setSelectedIndex(index);
        onItemChange?.(items[index]!, index);
      }
    },
    [items, onItemChange],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Auto-scroll selected thumbnail into view
  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedIndex]);

  // Auto-play video when selected
  useEffect(() => {
    if (selectedItem?.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser
      });
    }
  }, [selectedItem]);

  // Handle empty state
  if (items.length === 0) {
    return (
      <div
        className={clsx(
          "flex h-full items-center justify-center p-4",
          className,
        )}
      >
        <p className="text-muted-foreground">No media items to display</p>
      </div>
    );
  }

  const canGoPrevious = selectedIndex > 0;
  const canGoNext = selectedIndex < items.length - 1;

  return (
    <div className={clsx("flex h-full gap-4", className)}>
      {/* Left: Main Preview */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Previous button */}
        <button
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          aria-label="Previous item"
          className={clsx(
            "absolute left-2 z-10 flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity",
            canGoPrevious
              ? "cursor-pointer hover:bg-black/70"
              : "cursor-not-allowed opacity-50",
          )}
        >
          <ChevronLeft className="size-6" />
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          disabled={!canGoNext}
          aria-label="Next item"
          className={clsx(
            "absolute right-2 z-10 flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity",
            canGoNext
              ? "cursor-pointer hover:bg-black/70"
              : "cursor-not-allowed opacity-50",
          )}
        >
          <ChevronRight className="size-6" />
        </button>

        {/* Main media container */}
        <div className="bg-muted relative aspect-[4/5] h-full max-h-full w-auto overflow-hidden rounded-lg">
          {selectedItem?.type === "video" ? (
            <video
              ref={videoRef}
              key={selectedItem.id}
              src={selectedItem.src}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              key={selectedItem?.id}
              src={selectedItem?.src ?? ""}
              alt={selectedItem?.alt ?? "Gallery image"}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          )}
        </div>
      </div>

      {/* Right: Thumbnail Grid - hidden on mobile */}
      <div className="scrollbar-none hidden w-[280px] shrink-0 overflow-y-auto p-2 md:block">
        <div className="grid grid-cols-2 gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              onClick={() => selectItem(index)}
              aria-label={`View ${item.alt ?? `item ${index + 1}`}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              className={clsx(
                "bg-muted relative aspect-[4/5] cursor-pointer overflow-hidden rounded-lg transition-all",
                selectedIndex === index
                  ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                  : "hover:opacity-80",
              )}
            >
              <Image
                src={item.thumbnailSrc ?? item.src}
                alt={item.alt ?? `Thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="140px"
              />
              {/* Video play indicator */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary flex size-8 items-center justify-center rounded-full text-white">
                    <Play className="size-4 fill-current" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPrivateContent;
