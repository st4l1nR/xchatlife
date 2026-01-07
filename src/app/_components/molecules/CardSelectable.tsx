"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Check } from "lucide-react";

export type CardSelectableProps = {
  className?: string;
  imageSrc?: string;
  videoSrc?: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  aspectRatio?: "square" | "portrait" | "landscape";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  hoverDelay?: number;
};

const aspectRatioClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

const sizeClasses = {
  sm: "min-w-24",
  md: "min-w-32",
  lg: "min-w-48",
};

const CardSelectable: React.FC<CardSelectableProps> = ({
  className,
  imageSrc,
  videoSrc,
  label,
  selected = false,
  onClick,
  aspectRatio = "portrait",
  size = "md",
  disabled = false,
  hoverDelay = 500,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoSrc) {
      hoverTimerRef.current = setTimeout(() => {
        setShouldPlayVideo(true);
      }, hoverDelay);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShouldPlayVideo(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (shouldPlayVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser
      });
    }
  }, [shouldPlayVideo]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200",
        aspectRatioClasses[aspectRatio],
        sizeClasses[size],
        "bg-muted",
        // Selected state
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "ring-1 ring-transparent hover:ring-border",
        // Disabled state
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "cursor-pointer",
        className,
      )}
    >
      {/* Image (poster) */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={label}
          fill
          unoptimized
          className={clsx(
            "object-cover transition-all duration-300",
            !disabled && "group-hover:scale-105",
            videoSrc && shouldPlayVideo ? "opacity-0" : "opacity-100",
          )}
          sizes="(max-width: 640px) 100vw, 200px"
        />
      )}

      {/* Video (plays on hover after delay) */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            shouldPlayVideo ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Checkmark indicator */}
      {selected && (
        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Label */}
      <div className="absolute right-0 bottom-0 left-0 p-3">
        <span className="text-sm font-semibold text-white drop-shadow-md">
          {label}
        </span>
      </div>
    </button>
  );
};

export default CardSelectable;
