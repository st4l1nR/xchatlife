"use client";

import React, { useState } from "react";
import clsx from "clsx";
import ListCardReel from "../organisms/ListCardReel";
import DialogAuth from "../organisms/DialogAuth";
import type { DialogAuthVariant } from "../organisms/DialogAuth";
import type { CardReelProps } from "../molecules/CardReel";
import { authClient } from "@/server/better-auth/client";

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
   * Whether the user is logged in (override for Storybook)
   */
  isLoggedIn?: boolean;
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
      isLoggedIn: false,
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
      isLoggedIn: false,
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
      isLoggedIn: false,
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
      isLoggedIn: false,
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
      isLoggedIn: false,
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
      isLoggedIn: false,
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
  isLoggedIn: isLoggedInProp,
  onAuthRequired: onAuthRequiredProp,
}) => {
  // Auth state from better-auth
  const { data: session } = authClient.useSession();
  const isLoggedIn = isLoggedInProp ?? !!session?.user;

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  // Use mock data if provided, otherwise use default mock (for now)
  const data = mock ?? defaultMockData;

  // Local state for like toggles
  const [reels, setReels] = useState<CardReelProps[]>(data.reels);

  const handleLikeToggle = (id: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likeCount: reel.isLiked ? reel.likeCount - 1 : reel.likeCount + 1,
            }
          : reel,
      ),
    );
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
        loading={false}
        items={reelsWithHandlers}
        isLoggedIn={isLoggedIn}
        onAuthRequired={handleAuthRequired}
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
