"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import ListCardStory from "./ListCardStory";
import type { StoryProfile } from "./ListCardStory";

import "swiper/css";
import "swiper/css/free-mode";

export type ListBubbleStoryProps = {
  className?: string;
  layout?: "row" | "swiper";
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
  layout = "row",
  loading = false,
  profiles,
  size = "md",
  emptyStateTitle = "No stories found",
  emptyStateDescription = "There are no stories to display at this time.",
}) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  const isSwiper = layout === "swiper";
  const sizeStyles = sizes[size];
  const skeletonSize = skeletonSizes[size];

  // Responsive breakpoints for swiper
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // Determine slides per view based on breakpoint and size
  const getSlidesPerView = () => {
    const baseViews = {
      sm: { mobile: 5.5, tablet: 8.5, desktop: 12.5 },
      md: { mobile: 4.5, tablet: 6.5, desktop: 10.5 },
      lg: { mobile: 3.5, tablet: 5.5, desktop: 8.5 },
    };
    const views = baseViews[size];
    if (isMobile) return views.mobile;
    if (isTablet) return views.tablet;
    if (isDesktop) return views.desktop;
    return views.desktop;
  };

  const handleBubbleClick = (index: number) => {
    setSelectedProfileIndex(index);
    setIsStoryOpen(true);
  };

  const handleCloseStory = () => {
    setIsStoryOpen(false);
  };

  // Render a single bubble item
  const renderBubbleItem = (profile: StoryProfile, index: number) => (
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
  );

  // Render swiper content
  const renderSwiperContent = () => (
    <Swiper
      modules={[FreeMode]}
      slidesPerView={getSlidesPerView()}
      spaceBetween={16}
      freeMode={{ enabled: true, sticky: false }}
      className="w-full"
    >
      {profiles.map((profile, index) => (
        <SwiperSlide key={profile.id} className="w-auto!">
          {renderBubbleItem(profile, index)}
        </SwiperSlide>
      ))}
    </Swiper>
  );

  // Render row content
  const renderRowContent = () => (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {profiles.map((profile, index) => renderBubbleItem(profile, index))}
    </div>
  );

  // Render skeleton item
  const renderSkeletonItem = (index: number) => (
    <div key={index} className="flex shrink-0 flex-col items-center gap-1.5">
      <div
        className={clsx(
          "bg-muted animate-pulse rounded-full",
          skeletonSize.container,
        )}
      />
      <div
        className={clsx("bg-muted animate-pulse rounded", skeletonSize.text)}
      />
    </div>
  );

  // Render swiper skeleton
  const renderSwiperSkeleton = () => (
    <div className="flex gap-4">
      {Array.from({ length: Math.ceil(getSlidesPerView()) }).map((_, index) =>
        renderSkeletonItem(index),
      )}
    </div>
  );

  // Render row skeleton
  const renderRowSkeleton = () => (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 6 }).map((_, index) => renderSkeletonItem(index))}
    </div>
  );

  return (
    <>
      <WrapperLoader
        className={className}
        loading={loading}
        totalDocs={profiles.length}
      >
        {/* Content */}
        {isSwiper ? renderSwiperContent() : renderRowContent()}

        {/* Loading skeleton */}
        {isSwiper ? renderSwiperSkeleton() : renderRowSkeleton()}

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
