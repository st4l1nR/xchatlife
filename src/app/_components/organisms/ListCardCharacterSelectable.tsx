"use client";

import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import CardCharacterSelectable from "../molecules/CardCharacterSelectable";
import type { CardCharacterSelectableProps } from "../molecules/CardCharacterSelectable";

export type ListCardCharacterSelectableProps = {
  className?: string;
  loading?: boolean;
  items: Omit<CardCharacterSelectableProps, "selected" | "onSelect">[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  // Selection
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

const ListCardCharacterSelectable: React.FC<ListCardCharacterSelectableProps> =
  ({
    className,
    loading = false,
    items,
    emptyStateTitle = "No characters found",
    emptyStateDescription = "There are no characters to display at this time.",
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    selectedId,
    onSelect,
  }) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for infinite scroll
    useEffect(() => {
      if (!onLoadMore || !hasNextPage) return;

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
    }, [onLoadMore, hasNextPage, isFetchingNextPage]);

    // Render grid content
    const renderContent = () => (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {items.map((item) => (
          <CardCharacterSelectable
            key={item.id}
            {...item}
            selected={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}

        {/* Load more sentinel */}
        {hasNextPage && (
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

    // Render skeleton
    const renderSkeleton = () => (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-muted aspect-3/4 w-full animate-pulse rounded-2xl"
          >
            <div className="flex h-full flex-col justify-end p-4">
              <div className="bg-muted-foreground/20 h-8 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <WrapperLoader
        className={clsx("pb-24", className)}
        loading={loading}
        totalDocs={items.length}
      >
        {/* Content */}
        {renderContent()}

        {/* Loading skeleton */}
        {renderSkeleton()}

        {/* Empty state */}
        <CardEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
        />
      </WrapperLoader>
    );
  };

export default ListCardCharacterSelectable;
