"use client";

import React, { useState, useRef } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { Zap, Gamepad2 } from "lucide-react";
import { Button } from "../atoms/button";

export type CardCharacterProps = {
  className?: string;
  // Required
  name: string;
  age: number;
  href: string;
  imageSrc: string;
  // Optional
  videoSrc?: string;
  description?: string;
  isNew?: boolean;
  isLive?: boolean;
  playWithMeHref?: string;
};

const CardCharacter: React.FC<CardCharacterProps> = ({
  className,
  name,
  age,
  href,
  imageSrc,
  videoSrc,
  description,
  isNew = false,
  isLive = false,
  playWithMeHref,
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

  return (
    <Link
      href={href}
      className={clsx(
        "group bg-muted relative block aspect-[3/4] w-full overflow-hidden rounded-2xl",
        className,
      )}
      aria-label={`View ${name}'s profile`}
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

      {/* New badge */}
      {isNew && (
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
          <Zap className="h-3 w-3" />
          New
        </div>
      )}

      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          LIVE
        </div>
      )}

      {/* Content */}
      <div className="absolute right-0 bottom-0 left-0 p-4">
        {/* Name and age */}
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{name}</span>
          <span className="text-lg text-white/70">{age}</span>
        </div>

        {/* Description */}
        {description && (
          <p className="mb-3 line-clamp-2 text-sm text-white/80">
            {description}
          </p>
        )}

        {/* Play with me button */}
        {playWithMeHref && (
          <Button
            href={playWithMeHref}
            color="primary"
            className="w-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Gamepad2 data-slot="icon" />
            Play with me
          </Button>
        )}
      </div>
    </Link>
  );
};

export default CardCharacter;
