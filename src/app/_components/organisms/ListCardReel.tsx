"use client";

import React, { useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import CardReel from "../molecules/CardReel";
import type { CardReelProps } from "../molecules/CardReel";

// ============================================================================
// Types
// ============================================================================

export type ListCardReelProps = {
  className?: string;
  loading: boolean;
  items: CardReelProps[];
  onAuthRequired?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

// ============================================================================
// Component
// ============================================================================

const ListCardReel: React.FC<ListCardReelProps> = ({
  className,
  loading,
  items,
  onAuthRequired,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !onLoadMore || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // Load more when user is within 2 screens of the bottom
    if (scrollHeight - scrollTop - clientHeight < clientHeight * 2) {
      onLoadMore();
    }
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Loading state - show skeleton that mimics CardReel
  if (loading && items.length === 0) {
    return (
      <div className="scrollbar-none h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black">
        <div className="flex flex-col">
          <div className="relative flex h-screen w-full snap-start snap-always items-center justify-center">
            <div className="h-full w-full max-w-[450px] py-2">
              {/* Skeleton CardReel */}
              <div className="relative flex h-full max-h-[90vh] w-full items-center justify-center">
                {/* Skeleton video container */}
                <div className="relative aspect-[9/16] h-full max-h-full overflow-hidden rounded-2xl bg-zinc-800">
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800" />

                  {/* Gradient overlay skeleton */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Bottom content skeleton */}
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar skeleton */}
                      <div className="size-12 animate-pulse rounded-full bg-zinc-600" />
                      <div className="flex flex-col gap-1.5">
                        {/* Name skeleton */}
                        <div className="h-6 w-24 animate-pulse rounded bg-zinc-600" />
                        {/* Button skeleton */}
                        <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right sidebar skeleton */}
                <div className="flex flex-col items-center gap-1 self-end px-2 pb-4">
                  {/* Heart icon skeleton */}
                  <div className="size-8 animate-pulse rounded-full bg-zinc-600" />
                  {/* Like count skeleton */}
                  <div className="h-4 w-8 animate-pulse rounded bg-zinc-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!items.length) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground">No reels found</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className={clsx(
        "scrollbar-none h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black",
        className,
      )}
    >
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div
            key={item.id ?? index}
            className="relative flex h-screen w-full snap-start snap-always items-center justify-center"
          >
            <div className="h-full w-full max-w-[450px] py-2">
              <CardReel {...item} onAuthRequired={onAuthRequired} />
            </div>
          </div>
        ))}

        {/* Loading more indicator */}
        {(isFetchingNextPage || (loading && items.length > 0)) && (
          <div className="flex h-screen w-full items-center justify-center">
            <div className="text-muted-foreground animate-pulse">
              Loading more...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCardReel;
