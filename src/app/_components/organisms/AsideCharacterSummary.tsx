"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Phone,
  Sparkles,
  Lock,
  BadgeCheck,
  Calendar,
  User,
  Globe,
  Languages,
  Briefcase,
  Gamepad2,
  Smile,
} from "lucide-react";
import { Button } from "../atoms/button";
import { useApp } from "@/app/_contexts/AppContext";

// ============================================================================
// Types
// ============================================================================

export type CharacterMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  posterSrc?: string;
};

export type CharacterAbout = {
  age?: number;
  bodyType?: string;
  ethnicity?: string;
  language?: string;
  relationshipStatus?: string;
  occupation?: string;
  hobbies?: string;
  personality?: string;
};

export type AsideCharacterSummaryProps = {
  className?: string;
  // Character info
  name: string;
  isVerified?: boolean;
  description?: string;
  // Media
  media: CharacterMedia[];
  // Like state
  isLiked?: boolean;
  onLikeToggle?: () => void;
  // Authentication
  onAuthRequired?: () => void;
  // Action callbacks
  onCallMe?: () => void;
  onGenerateImage?: () => void;
  onPrivateContent?: () => void;
  // About section
  about?: CharacterAbout;
};

// ============================================================================
// About Attribute Config
// ============================================================================

type AttributeConfig = {
  key: keyof CharacterAbout;
  label: string;
  icon: React.ReactNode;
};

const attributeConfigs: AttributeConfig[] = [
  { key: "age", label: "AGE", icon: <Calendar className="size-4" /> },
  { key: "bodyType", label: "BODY", icon: <User className="size-4" /> },
  { key: "ethnicity", label: "ETHNICITY", icon: <Globe className="size-4" /> },
  {
    key: "language",
    label: "LANGUAGE",
    icon: <Languages className="size-4" />,
  },
  {
    key: "relationshipStatus",
    label: "RELATIONSHIP",
    icon: <Heart className="size-4" />,
  },
  {
    key: "occupation",
    label: "OCCUPATION",
    icon: <Briefcase className="size-4" />,
  },
  { key: "hobbies", label: "HOBBIES", icon: <Gamepad2 className="size-4" /> },
  {
    key: "personality",
    label: "PERSONALITY",
    icon: <Smile className="size-4" />,
  },
];

// ============================================================================
// Component
// ============================================================================

const AsideCharacterSummary: React.FC<AsideCharacterSummaryProps> = ({
  className,
  name,
  isVerified = false,
  description,
  media,
  isLiked = false,
  onLikeToggle,
  onAuthRequired,
  onCallMe,
  onGenerateImage,
  onPrivateContent,
  about,
}) => {
  const { isAuthenticated } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = media[currentIndex];
  const hasMultipleMedia = media.length > 1;

  // Handle video autoplay when media changes
  useEffect(() => {
    if (currentMedia?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  }, [currentIndex, currentMedia]);

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Like handler with auth check
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    onLikeToggle?.();
  };

  // Get visible attributes
  const visibleAttributes = about
    ? attributeConfigs.filter((config) => about[config.key] !== undefined)
    : [];

  return (
    <aside
      className={clsx(
        "bg-muted scrollbar-none flex flex-col overflow-y-auto",
        className,
      )}
    >
      {/* Media Gallery */}
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden">
        {/* Current Media */}
        {currentMedia?.type === "video" ? (
          <video
            ref={videoRef}
            key={currentMedia.id}
            src={currentMedia.src}
            poster={currentMedia.posterSrc}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : currentMedia ? (
          <Image
            key={currentMedia.id}
            src={currentMedia.src}
            alt={`${name} - media ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : null}

        {/* Gradient overlay for buttons */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

        {/* Heart/Like Button */}
        <button
          type="button"
          onClick={handleLikeClick}
          className="absolute top-3 right-3 z-10 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            className={clsx(
              "size-6 transition-all duration-200",
              isLiked
                ? "fill-red-500 text-red-500"
                : "fill-transparent text-white",
            )}
            style={
              isAnimating
                ? {
                    animation: "likeAnimation 600ms ease-out",
                  }
                : undefined
            }
          />
          {/* Particle burst effect */}
          {isAnimating && isLiked && (
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
          )}
        </button>

        {/* Navigation Chevrons */}
        {hasMultipleMedia && (
          <>
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white"
                aria-label="Previous media"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {currentIndex < media.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white"
                aria-label="Next media"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </>
        )}

        {/* Dot Indicators */}
        {hasMultipleMedia && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {media.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  index === currentIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/70",
                )}
                aria-label={`Go to media ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Character Info */}
      <div className="flex flex-col gap-2 px-4 pt-4">
        {/* Name with verified badge */}
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-xl font-bold">{name}</h2>
          {isVerified && (
            <BadgeCheck className="size-5 fill-blue-500 text-white" />
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 px-4 py-4">
        <Button color="primary" className="w-full" onClick={onCallMe}>
          <Phone data-slot="icon" />
          Call Me
        </Button>
        <Button outline className="w-full" onClick={onGenerateImage}>
          <Sparkles data-slot="icon" />
          Generate Image
        </Button>
        <Button outline className="w-full" onClick={onPrivateContent}>
          <Lock data-slot="icon" />
          My Private Content
        </Button>
      </div>

      {/* About Section */}
      {visibleAttributes.length > 0 && (
        <div className="flex flex-col gap-4 px-4 pb-6">
          <h3 className="text-muted-foreground text-sm font-medium">
            About me:
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {visibleAttributes.map((config) => {
              const value = about?.[config.key];
              return (
                <div key={config.key} className="flex flex-col gap-0.5">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    {config.icon}
                    <span>{config.label}</span>
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline keyframes for like animation */}
      <style jsx>{`
        @keyframes likeAnimation {
          0% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.4);
          }
          30% {
            transform: scale(0.9);
          }
          45% {
            transform: scale(1.15);
          }
          60% {
            transform: scale(0.95);
          }
          75% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </aside>
  );
};

export default AsideCharacterSummary;
