"use client";

import React, { useState } from "react";
import clsx from "clsx";
import ListCardReel from "../organisms/ListCardReel";
import DialogAuth from "../organisms/DialogAuth";
import type { DialogAuthVariant } from "../organisms/DialogAuth";
import type { CardReelProps } from "../molecules/CardReel";
import { api } from "@/trpc/react";

// ============================================================================
// Types
// ============================================================================

export type DiscoverPageMockData = {
  reels: CardReelProps[];
};

export type DiscoverPageProps = {
  className?: string;
  /**
   * Optional mock data for Storybook and development
   * When provided, uses mock data instead of fetching from API
   */
  mock?: DiscoverPageMockData;
  /**
   * Callback when auth is required (override for Storybook)
   */
  onAuthRequired?: () => void;
};

// ============================================================================
// Default Mock Data
// ============================================================================

export const defaultMockData: DiscoverPageMockData = {
  reels: [
    {
      id: "1",
      name: "Amelia",
      avatarSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
      likeCount: 5322,
      isLiked: false,
      chatUrl: "/chat/amelia",
    },
    {
      id: "2",
      name: "Sofia",
      avatarSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
      likeCount: 12400,
      isLiked: true,
      chatUrl: "/chat/sofia",
    },
    {
      id: "3",
      name: "Luna",
      avatarSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
      likeCount: 890,
      isLiked: false,
      chatUrl: "/chat/luna",
    },
    {
      id: "4",
      name: "Mia",
      avatarSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
      likeCount: 45600,
      isLiked: false,
      chatUrl: "/chat/mia",
    },
    {
      id: "5",
      name: "Isabella",
      avatarSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
      likeCount: 8900,
      isLiked: true,
      chatUrl: "/chat/isabella",
    },
    {
      id: "6",
      name: "Emma",
      avatarSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
      likeCount: 3200,
      isLiked: false,
      chatUrl: "/chat/emma",
    },
  ],
};

// ============================================================================
// Component
// ============================================================================

const DiscoverPage: React.FC<DiscoverPageProps> = ({
  className,
  mock,
  onAuthRequired: onAuthRequiredProp,
}) => {
  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  // Fetch reels from API with infinite scroll
  const {
    data: reelsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.reel.getInfinite.useInfiniteQuery(
    { limit: 20 },
    {
      enabled: !mock,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // Track like states separately to preserve them across fetches
  // Value is the delta: 1 if liked (adds 1 to count), 0 if not liked
  const [likeDeltas, setLikeDeltas] = useState<Map<string, number>>(new Map());

  // Flatten pages into single array and map to CardReelProps format
  const apiReels: CardReelProps[] =
    reelsData?.pages.flatMap((page) =>
      page.items.map((item) => {
        const delta = likeDeltas.get(item.id) ?? 0;
        return {
          id: item.id,
          name: item.name,
          avatarSrc: item.avatarSrc,
          videoSrc: item.videoSrc,
          posterSrc: item.posterSrc,
          likeCount: item.likeCount + delta,
          isLiked: delta > 0,
          chatUrl: item.chatUrl,
        };
      }),
    ) ?? [];

  // Use mock data if provided, otherwise use API data
  const reels = mock ? mock.reels : apiReels;

  const handleLikeToggle = (id: string) => {
    setLikeDeltas((prev) => {
      const newMap = new Map(prev);
      const currentDelta = newMap.get(id) ?? 0;
      // Toggle: 0 -> 1 (like), 1 -> 0 (unlike)
      newMap.set(id, currentDelta === 0 ? 1 : 0);
      return newMap;
    });
  };

  const handleAuthRequired = () => {
    if (onAuthRequiredProp) {
      onAuthRequiredProp();
    } else {
      setAuthDialogOpen(true);
    }
  };

  // Add like toggle handlers to reels
  const reelsWithHandlers = reels.map((reel) => ({
    ...reel,
    onLikeToggle: () => handleLikeToggle(reel.id!),
  }));

  return (
    <div className={clsx("h-screen w-full", className)}>
      <ListCardReel
        loading={isLoading && !mock}
        items={reelsWithHandlers}
        onAuthRequired={handleAuthRequired}
        hasNextPage={!mock && hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />

      {/* Auth dialog for non-logged-in users */}
      {!onAuthRequiredProp && (
        <DialogAuth
          open={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
          variant={authVariant}
          onVariantChange={setAuthVariant}
        />
      )}
    </div>
  );
};

export default DiscoverPage;
