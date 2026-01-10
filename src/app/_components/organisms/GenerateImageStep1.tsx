"use client";

import React, { useState } from "react";
import clsx from "clsx";
import {
  ArrowLeft,
  Venus,
  Sparkles,
  Mars,
  Transgender,
  Wand2,
} from "lucide-react";
import { Button } from "../atoms/button";
import Tooltip from "../atoms/tooltip";
import ListCardCharacterSelectable from "./ListCardCharacterSelectable";
import BannerSelectCharacter from "../molecules/BannerSelectCharacter";
import { api } from "@/trpc/react";

const CATEGORY_TABS = [
  {
    label: "Girls",
    value: "girl" as const,
    style: "realistic" as const,
    icon: Venus,
  },
  {
    label: "Anime",
    value: "anime" as const,
    style: "anime" as const,
    icon: Sparkles,
  },
  {
    label: "Guys",
    value: "men" as const,
    style: "realistic" as const,
    icon: Mars,
  },
  {
    label: "Trans",
    value: "trans" as const,
    style: "realistic" as const,
    icon: Transgender,
  },
] as const;

type CategoryValue = (typeof CATEGORY_TABS)[number]["value"];

export type SelectedCharacter = {
  id: string;
  name: string;
  imageSrc: string;
  videoSrc?: string;
};

export type GenerateImageStep1Props = {
  className?: string;
  onBack?: () => void;
  onSelectCharacter: (character: SelectedCharacter) => void;
};

const GenerateImageStep1: React.FC<GenerateImageStep1Props> = ({
  className,
  onBack,
  onSelectCharacter,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("girl");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  );

  // Get the current category config
  const currentCategory = CATEGORY_TABS.find(
    (tab) => tab.value === activeCategory,
  );
  const style = currentCategory?.style;
  const gender = activeCategory === "anime" ? "girl" : activeCategory;

  // Fetch characters with infinite scroll
  const {
    data: charactersData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.character.getInfinite.useInfiniteQuery(
    { limit: 16, style, gender },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // Flatten paginated data
  const characters = charactersData?.pages.flatMap((page) => page.items) ?? [];

  // Map to selectable card format
  const selectableItems = characters.map((char) => ({
    id: char.id ?? char.href,
    name: char.name,
    imageSrc: char.imageSrc,
    videoSrc: char.videoSrc,
  }));

  const handleSelect = (id: string) => {
    setSelectedCharacterId(id === selectedCharacterId ? null : id);
  };

  const handleConfirmSelection = () => {
    const selectedChar = selectableItems.find(
      (c) => c.id === selectedCharacterId,
    );
    if (selectedChar) {
      onSelectCharacter(selectedChar);
    }
  };

  return (
    <div className={clsx("relative flex min-h-screen flex-col", className)}>
      {/* Header */}
      <header className="bg-background/95 border-border sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto w-full max-w-5xl px-4">
          {/* Top row - Back button, tabs, title, create button */}
          <div className="flex items-center gap-4 py-3">
            {/* Back button */}
            <Button plain onClick={onBack} className="shrink-0">
              <ArrowLeft className="size-5" />
            </Button>

            {/* Filter tabs - desktop only */}
            <div className="bg-muted hidden items-center gap-1 rounded-full p-1 sm:flex">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setActiveCategory(tab.value);
                      setSelectedCharacterId(null);
                    }}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Title section */}
            <div className="ml-2 flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <Sparkles className="text-primary size-4 sm:size-5" />
                <h1 className="text-foreground text-sm font-bold sm:text-base">
                  Generate Image
                </h1>
              </div>
              <p className="text-muted-foreground hidden text-xs sm:block">
                Choose character
              </p>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Create AI Character button */}
            <Tooltip content="Create AI Character" placement="bottom">
              <Button plain href="/create-character" className="shrink-0">
                <Wand2 className="size-5" />
              </Button>
            </Tooltip>
          </div>

          {/* Filter tabs - mobile only */}
          <div className="scrollbar-none flex gap-1 overflow-x-auto pb-3 sm:hidden">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tab.value);
                    setSelectedCharacterId(null);
                  }}
                  className={clsx(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Character grid */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4">
        <ListCardCharacterSelectable
          items={selectableItems}
          loading={isLoading}
          selectedId={selectedCharacterId}
          onSelect={handleSelect}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          emptyStateTitle="No characters found"
          emptyStateDescription="Try selecting a different category."
        />
      </main>

      {/* Bottom selection banner */}
      <BannerSelectCharacter
        isVisible={!!selectedCharacterId}
        onSelect={handleConfirmSelection}
      />
    </div>
  );
};

export default GenerateImageStep1;
