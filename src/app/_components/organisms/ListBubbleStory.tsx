import React from "react";
import clsx from "clsx";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import BubbleStory from "../molecules/BubbleStory";
import type { BubbleStoryProps } from "../molecules/BubbleStory";

export type ListBubbleStoryProps = {
  className?: string;
  loading?: boolean;
  items: BubbleStoryProps[];
  size?: "sm" | "md" | "lg";
  emptyStateTitle?: string;
  emptyStateDescription?: string;
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
  items,
  size = "md",
  emptyStateTitle = "No stories found",
  emptyStateDescription = "There are no stories to display at this time.",
}) => {
  const skeletonSize = skeletonSizes[size];

  return (
    <WrapperLoader
      className={className}
      loading={loading}
      totalDocs={items.length}
    >
      {/* Content */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item, index) => (
          <BubbleStory
            key={item.href || index}
            {...item}
            size={size}
            className="shrink-0"
          />
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
  );
};

export default ListBubbleStory;
