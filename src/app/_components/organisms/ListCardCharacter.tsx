"use client";

import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import CardCharacter from "../molecules/CardCharacter";
import type { CardCharacterProps } from "../molecules/CardCharacter";

import "swiper/css";
import "swiper/css/free-mode";

export type ListCardCharacterProps = {
  className?: string;
  layout?: "row" | "grid" | "swiper";
  loading?: boolean;
  items: CardCharacterProps[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

const ListCardCharacter: React.FC<ListCardCharacterProps> = ({
  className,
  layout = "grid",
  loading = false,
  items,
  emptyStateTitle = "No characters found",
  emptyStateDescription = "There are no characters to display at this time.",
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  const isGrid = layout === "grid";
  const isSwiper = layout === "swiper";
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints for swiper
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // Determine slides per view based on breakpoint
  const getSlidesPerView = () => {
    if (isMobile) return 2.2;
    if (isTablet) return 3.2;
    if (isDesktop) return 4.2;
    return 4.2;
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasNextPage || !isGrid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasNextPage, isFetchingNextPage, isGrid]);

  // Render swiper layout
  const renderSwiperContent = () => (
    <Swiper
      modules={[FreeMode]}
      slidesPerView={getSlidesPerView()}
      spaceBetween={12}
      freeMode={{ enabled: true, sticky: false }}
      className="w-full"
    >
      {items.map((item, index) => (
        <SwiperSlide key={item.href || index}>
          <CardCharacter {...item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  // Render swiper skeleton
  const renderSwiperSkeleton = () => (
    <div className="flex gap-3">
      {Array.from({ length: Math.ceil(getSlidesPerView()) }).map((_, index) => (
        <div
          key={index}
          className="bg-muted aspect-3/4 w-full animate-pulse rounded-2xl"
          style={{ flex: `0 0 calc(${100 / getSlidesPerView()}% - 10px)` }}
        >
          <div className="flex h-full flex-col justify-end p-4">
            <div className="bg-muted-foreground/20 mb-2 h-6 w-24 rounded" />
            <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render grid/row content
  const renderDefaultContent = () => (
    <div
      className={clsx(
        isGrid
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "flex gap-3 overflow-x-auto pb-4",
      )}
    >
      {items.map((item, index) => (
        <CardCharacter
          key={item.href || index}
          {...item}
          className={clsx(!isGrid && "w-40 shrink-0 md:w-44")}
        />
      ))}

      {/* Load more sentinel (only for grid layout) */}
      {isGrid && hasNextPage && (
        <div
          ref={sentinelRef}
          className="col-span-full flex justify-center py-8"
        >
          {isFetchingNextPage && (
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          )}
        </div>
      )}
    </div>
  );

  // Render grid/row skeleton
  const renderDefaultSkeleton = () => (
    <div
      className={clsx(
        isGrid
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "flex gap-3 overflow-x-auto pb-4",
      )}
    >
      {Array.from({ length: isGrid ? 8 : 5 }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "bg-muted aspect-3/4 animate-pulse rounded-2xl",
            isGrid ? "w-full" : "w-40 shrink-0 md:w-44",
          )}
        >
          <div className="flex h-full flex-col justify-end p-4">
            <div className="bg-muted-foreground/20 mb-2 h-6 w-24 rounded" />
            <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <WrapperLoader
      className={className}
      loading={loading}
      totalDocs={items.length}
    >
      {/* Content */}
      {isSwiper ? renderSwiperContent() : renderDefaultContent()}

      {/* Loading skeleton */}
      {isSwiper ? renderSwiperSkeleton() : renderDefaultSkeleton()}

      {/* Empty state */}
      <CardEmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
      />
    </WrapperLoader>
  );
};

export default ListCardCharacter;
