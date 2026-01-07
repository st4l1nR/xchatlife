import React from "react";
import clsx from "clsx";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import CardCharacter from "../molecules/CardCharacter";
import type { CardCharacterProps } from "../molecules/CardCharacter";

export type ListCardCharacterProps = {
  className?: string;
  layout?: "row" | "grid";
  loading?: boolean;
  items: CardCharacterProps[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
};

const ListCardCharacter: React.FC<ListCardCharacterProps> = ({
  className,
  layout = "grid",
  loading = false,
  items,
  emptyStateTitle = "No characters found",
  emptyStateDescription = "There are no characters to display at this time.",
}) => {
  const isGrid = layout === "grid";

  return (
    <WrapperLoader
      className={className}
      loading={loading}
      totalDocs={items.length}
    >
      {/* Content */}
      <div
        className={clsx(
          isGrid
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "flex gap-4 overflow-x-auto pb-4",
        )}
      >
        {items.map((item, index) => (
          <CardCharacter
            key={item.href || index}
            {...item}
            className={clsx(!isGrid && "w-64 shrink-0")}
          />
        ))}
      </div>

      {/* Loading skeleton */}
      <div
        className={clsx(
          isGrid
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "flex gap-4 overflow-x-auto pb-4",
        )}
      >
        {Array.from({ length: isGrid ? 8 : 4 }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              "bg-muted aspect-3/4 animate-pulse rounded-2xl",
              isGrid ? "w-full" : "w-64 shrink-0",
            )}
          >
            <div className="flex h-full flex-col justify-end p-4">
              <div className="bg-muted-foreground/20 mb-2 h-6 w-24 rounded" />
              <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
            </div>
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

export default ListCardCharacter;
