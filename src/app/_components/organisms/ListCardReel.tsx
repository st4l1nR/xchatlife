"use client";

import React from "react";
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
  isLoggedIn: boolean;
  onAuthRequired?: () => void;
};

// ============================================================================
// Component
// ============================================================================

const ListCardReel: React.FC<ListCardReelProps> = ({
  className,
  loading,
  items,
  isLoggedIn,
  onAuthRequired,
}) => {
  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
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
              <CardReel
                {...item}
                isLoggedIn={isLoggedIn}
                onAuthRequired={onAuthRequired}
              />
            </div>
          </div>
        ))}

        {/* Loading more indicator */}
        {loading && items.length > 0 && (
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
