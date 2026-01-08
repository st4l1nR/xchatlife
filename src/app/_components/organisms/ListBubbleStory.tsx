"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import ListCardStory from "./ListCardStory";
import type { StoryProfile } from "./ListCardStory";

export type ListBubbleStoryProps = {
  className?: string;
  loading?: boolean;
  profiles: StoryProfile[];
  size?: "sm" | "md" | "lg";
  emptyStateTitle?: string;
  emptyStateDescription?: string;
};

const sizes = {
  sm: {
    container: "size-12",
    imageSize: 48,
    border: "border-2",
    text: "text-xs",
    maxWidth: "max-w-14",
  },
  md: {
    container: "size-16",
    imageSize: 64,
    border: "border-[3px]",
    text: "text-sm",
    maxWidth: "max-w-18",
  },
  lg: {
    container: "size-20",
    imageSize: 80,
    border: "border-4",
    text: "text-base",
    maxWidth: "max-w-22",
  },
};

const skeletonSizes = {
  sm: {
    container: "size-12",
    text: "w-10 h-3",
  },
  md: {
    container: "size-16",
    text: "w-12 h-3.5",
  },
  lg: {
    container: "size-20",
    text: "w-14 h-4",
  },
};

const ListBubbleStory: React.FC<ListBubbleStoryProps> = ({
  className,
  loading = false,
  profiles,
  size = "md",
  emptyStateTitle = "No stories found",
  emptyStateDescription = "There are no stories to display at this time.",
}) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  const sizeStyles = sizes[size];
  const skeletonSize = skeletonSizes[size];

  const handleBubbleClick = (index: number) => {
    setSelectedProfileIndex(index);
    setIsStoryOpen(true);
  };

  const handleCloseStory = () => {
    setIsStoryOpen(false);
  };

  return (
    <>
      <WrapperLoader
        className={className}
        loading={loading}
        totalDocs={profiles.length}
      >
        {/* Content */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {profiles.map((profile, index) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleBubbleClick(index)}
              className="group flex shrink-0 flex-col items-center gap-1.5"
              aria-label={`View ${profile.name}'s story`}
            >
              {/* Border ring container */}
              <div
                className={clsx(
                  "rounded-full p-0.5 transition-transform duration-200 group-hover:scale-105",
                  sizeStyles.border,
                  "border-primary",
                )}
              >
                {/* Image container */}
                <div
                  className={clsx(
                    "bg-muted overflow-hidden rounded-full",
                    sizeStyles.container,
                  )}
                >
                  <Image
                    src={profile.avatarSrc ?? "/images/girl-poster.webp"}
                    alt={profile.name}
                    width={sizeStyles.imageSize}
                    height={sizeStyles.imageSize}
                    className="size-full object-cover"
                  />
                </div>
              </div>

              {/* Name label */}
              <span
                className={clsx(
                  "text-foreground truncate text-center",
                  sizeStyles.text,
                  sizeStyles.maxWidth,
                )}
              >
                {profile.name}
              </span>
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <div
                className={clsx(
                  "bg-muted animate-pulse rounded-full",
                  skeletonSize.container,
                )}
              />
              <div
                className={clsx(
                  "bg-muted animate-pulse rounded",
                  skeletonSize.text,
                )}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        <CardEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
        />
      </WrapperLoader>

      {/* Story viewer */}
      <ListCardStory
        isOpen={isStoryOpen}
        profiles={profiles}
        initialProfileIndex={selectedProfileIndex}
        onClose={handleCloseStory}
        onProfileChange={setSelectedProfileIndex}
      />
    </>
  );
};

export default ListBubbleStory;
