"use client";

import React, { useState, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";

export type CardCharacterSelectableProps = {
  className?: string;
  // Required
  id: string;
  name: string;
  imageSrc: string;
  // Optional
  videoSrc?: string;
  // Selection
  selected?: boolean;
  onSelect?: (id: string) => void;
};

const CardCharacterSelectable: React.FC<CardCharacterSelectableProps> = ({
  className,
  id,
  name,
  imageSrc,
  videoSrc,
  selected = false,
  onSelect,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    onSelect?.(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "group bg-muted relative block aspect-[3/4] w-full overflow-hidden rounded-2xl transition-all duration-200",
        // Selection ring
        selected
          ? "ring-primary ring-offset-background ring-2 ring-offset-2"
          : "ring-1 ring-transparent",
        className,
      )}
      aria-label={`Select ${name}`}
      aria-pressed={selected}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image (poster) */}
      <Image
        src={imageSrc}
        alt={name}
        fill
        unoptimized
        className={clsx(
          "object-cover transition-opacity duration-300",
          videoSrc && isHovering ? "opacity-0" : "opacity-100",
        )}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Video (plays on hover) */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Name at bottom */}
      <div className="absolute right-0 bottom-0 left-0 p-4">
        <span
          className={clsx(
            "block rounded-md px-3 py-1.5 text-center text-lg font-bold text-white transition-colors",
            selected ? "bg-muted/80" : "bg-black/30",
          )}
        >
          {name}
        </span>
      </div>
    </button>
  );
};

export default CardCharacterSelectable;
