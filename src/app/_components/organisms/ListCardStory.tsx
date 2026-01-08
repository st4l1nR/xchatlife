"use client";

import React, { useState, useCallback } from "react";
import CardStory from "./CardStory";
import type { StoryMedia } from "./CardStory";

// ============================================================================
// Types
// ============================================================================

export type StoryProfile = {
  id: string;
  name: string;
  avatarSrc?: string;
  timestamp?: string;
  media: StoryMedia[];
};

export type ListCardStoryProps = {
  className?: string;
  // Data
  profiles: StoryProfile[];
  initialProfileIndex?: number;
  // State
  isOpen: boolean;
  // Actions
  onClose: () => void;
  onProfileChange?: (profileIndex: number) => void;
  onAllStoriesComplete?: () => void;
};

// ============================================================================
// Component
// ============================================================================

const ListCardStory: React.FC<ListCardStoryProps> = ({
  className,
  profiles,
  initialProfileIndex = 0,
  isOpen,
  onClose,
  onProfileChange,
  onAllStoriesComplete,
}) => {
  // State
  const [currentProfileIndex, setCurrentProfileIndex] =
    useState(initialProfileIndex);

  // Current profile
  const currentProfile = profiles[currentProfileIndex];

  // ============================================================================
  // Handlers
  // ============================================================================

  const handlePrevProfile = useCallback(() => {
    if (currentProfileIndex > 0) {
      const newIndex = currentProfileIndex - 1;
      setCurrentProfileIndex(newIndex);
      onProfileChange?.(newIndex);
    }
  }, [currentProfileIndex, onProfileChange]);

  const handleNextProfile = useCallback(() => {
    if (currentProfileIndex < profiles.length - 1) {
      const newIndex = currentProfileIndex + 1;
      setCurrentProfileIndex(newIndex);
      onProfileChange?.(newIndex);
    } else {
      // All stories complete
      onAllStoriesComplete?.();
      onClose();
    }
  }, [
    currentProfileIndex,
    profiles.length,
    onProfileChange,
    onAllStoriesComplete,
    onClose,
  ]);

  const handleStoryComplete = useCallback(() => {
    // Auto-advance to next profile when current story ends
    handleNextProfile();
  }, [handleNextProfile]);

  // ============================================================================
  // Render
  // ============================================================================

  // Don't render if not open or no profiles
  if (!isOpen || !currentProfile) {
    return null;
  }

  return (
    <CardStory
      key={currentProfile.id} // Force remount on profile change to reset state
      className={className}
      name={currentProfile.name}
      avatarSrc={currentProfile.avatarSrc}
      timestamp={currentProfile.timestamp}
      media={currentProfile.media}
      hasPrevProfile={currentProfileIndex > 0}
      hasNextProfile={currentProfileIndex < profiles.length - 1}
      onPrevProfile={handlePrevProfile}
      onNextProfile={handleNextProfile}
      onClose={onClose}
      onStoryComplete={handleStoryComplete}
    />
  );
};

export default ListCardStory;
