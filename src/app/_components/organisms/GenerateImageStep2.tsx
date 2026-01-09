"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  Edit3,
  Circle,
  Grid2X2,
  Layers,
  LayoutGrid,
  Gem,
} from "lucide-react";
import { Button } from "../atoms/button";
import CardSuggestion from "../molecules/CardSuggestion";
import CardGeneratedImage from "../molecules/CardGeneratedImage";
import DialogAuth, { type DialogAuthVariant } from "./DialogAuth";
import { useApp } from "@/app/_contexts/AppContext";
import type { SelectedCharacter } from "./GenerateImageStep1";

// Mock suggestion data
const SUGGESTION_CATEGORIES = [
  { id: "outfit", label: "Outfit" },
  { id: "action", label: "Action" },
  { id: "pose", label: "Pose" },
  { id: "accessories", label: "Accessories" },
  { id: "scene", label: "Scene" },
] as const;

type SuggestionCategoryId = (typeof SUGGESTION_CATEGORIES)[number]["id"];

const MOCK_SUGGESTIONS: Record<
  SuggestionCategoryId,
  Array<{ id: string; label: string; imageSrc: string }>
> = {
  outfit: [
    { id: "bikini", label: "Bikini", imageSrc: "/images/girl-poster.webp" },
    { id: "skirt", label: "Skirt", imageSrc: "/images/girl-poster.webp" },
    { id: "lingerie", label: "Lingerie", imageSrc: "/images/girl-poster.webp" },
    { id: "crop-top", label: "Crop top", imageSrc: "/images/girl-poster.webp" },
    { id: "leather", label: "Leather", imageSrc: "/images/girl-poster.webp" },
    {
      id: "mini-skirt",
      label: "Mini-skirt",
      imageSrc: "/images/girl-poster.webp",
    },
    { id: "satin", label: "Satin", imageSrc: "/images/girl-poster.webp" },
  ],
  action: [
    { id: "sitting", label: "Sitting", imageSrc: "/images/girl-poster.webp" },
    { id: "standing", label: "Standing", imageSrc: "/images/girl-poster.webp" },
    { id: "walking", label: "Walking", imageSrc: "/images/girl-poster.webp" },
    { id: "dancing", label: "Dancing", imageSrc: "/images/girl-poster.webp" },
    { id: "lying", label: "Lying", imageSrc: "/images/girl-poster.webp" },
  ],
  pose: [
    { id: "front", label: "Front", imageSrc: "/images/girl-poster.webp" },
    { id: "side", label: "Side", imageSrc: "/images/girl-poster.webp" },
    { id: "back", label: "Back", imageSrc: "/images/girl-poster.webp" },
    { id: "close-up", label: "Close-up", imageSrc: "/images/girl-poster.webp" },
  ],
  accessories: [
    { id: "glasses", label: "Glasses", imageSrc: "/images/girl-poster.webp" },
    { id: "hat", label: "Hat", imageSrc: "/images/girl-poster.webp" },
    { id: "earrings", label: "Earrings", imageSrc: "/images/girl-poster.webp" },
    { id: "necklace", label: "Necklace", imageSrc: "/images/girl-poster.webp" },
  ],
  scene: [
    { id: "bedroom", label: "Bedroom", imageSrc: "/images/girl-poster.webp" },
    { id: "beach", label: "Beach", imageSrc: "/images/girl-poster.webp" },
    { id: "office", label: "Office", imageSrc: "/images/girl-poster.webp" },
    { id: "outdoors", label: "Outdoors", imageSrc: "/images/girl-poster.webp" },
    { id: "studio", label: "Studio", imageSrc: "/images/girl-poster.webp" },
  ],
};

const IMAGE_COUNT_OPTIONS = [
  { value: 1 as const, icon: Circle, premium: false },
  { value: 4 as const, icon: Grid2X2, premium: false },
  { value: 16 as const, icon: Layers, premium: true },
  { value: 32 as const, icon: Layers, premium: true },
  { value: 64 as const, icon: LayoutGrid, premium: true },
];

type ImageCount = (typeof IMAGE_COUNT_OPTIONS)[number]["value"];

type GeneratedImage = {
  id: string;
  src: string;
  canBeVideo: boolean;
};

export type GenerateImageStep2Props = {
  className?: string;
  character: SelectedCharacter;
  onBack: () => void;
};

const GenerateImageStep2: React.FC<GenerateImageStep2Props> = ({
  className,
  character,
  onBack,
}) => {
  const { isAuthenticated, hasActiveSubscription } = useApp();

  const [activeCategory, setActiveCategory] =
    useState<SuggestionCategoryId>("outfit");
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [numberOfImages, setNumberOfImages] = useState<ImageCount>(1);
  const [prompt, setPrompt] = useState(
    "Sitting on a leather sofa, wearing a fur jacket, wearing lace underwear, gazing seductively at the viewer.",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [showHighlightVideo, setShowHighlightVideo] = useState(true);

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  const currentSuggestions = MOCK_SUGGESTIONS[activeCategory];

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestionId)
        ? prev.filter((id) => id !== suggestionId)
        : [...prev, suggestionId],
    );
  };

  // Mock generate function
  const handleGenerate = async () => {
    // Check auth
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    setIsGenerating(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock images
    const newImages: GeneratedImage[] = Array.from(
      { length: numberOfImages },
      (_, i) => ({
        id: `generated-${Date.now()}-${i}`,
        src: "/images/girl-poster.webp",
        canBeVideo: Math.random() > 0.5,
      }),
    );

    setGeneratedImages((prev) => [...newImages, ...prev]);
    setIsGenerating(false);
  };

  // Calculate token cost based on number of images
  const tokenCost = numberOfImages;

  return (
    <div className={clsx("flex min-h-screen flex-col", className)}>
      {/* Header - Single row */}
      <header className="bg-background/95 sticky top-0 z-40 border-b border-border backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Back button */}
          <Button plain onClick={onBack} className="shrink-0">
            <ArrowLeft className="size-5" />
          </Button>

          {/* Title - centered with flex-1 */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h1 className="text-base font-bold text-foreground sm:text-lg">
              Generate Image
            </h1>
          </div>

          {/* Spacer to balance the back button */}
          <div className="w-10 shrink-0" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6">
        {/* Character preview and prompt */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
          {/* Character image */}
          <div className="relative mx-auto w-40 shrink-0 md:mx-0 md:w-48">
            <div className="bg-muted relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src={character.imageSrc}
                alt={character.name}
                fill
                unoptimized
                className="object-cover"
                sizes="192px"
              />

              {/* V2 badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                <Eye className="size-3" />
                V2
              </div>

              {/* Name overlay */}
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <span className="text-base font-bold text-white">
                  {character.name}
                </span>
              </div>
            </div>
          </div>

          {/* Prompt input */}
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-muted text-foreground placeholder:text-muted-foreground min-h-32 w-full resize-none rounded-xl border border-border p-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe the image you want to generate..."
              />
              <Edit3 className="absolute top-4 right-4 size-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Suggestions section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-base font-semibold text-foreground">
              Suggestions
            </h2>

            {/* Category tabs */}
            <div className="flex gap-4 overflow-x-auto">
              {SUGGESTION_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={clsx(
                    "whitespace-nowrap border-b-2 pb-1 text-sm font-medium transition-colors",
                    activeCategory === category.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestion cards */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {currentSuggestions.map((suggestion) => (
              <CardSuggestion
                key={suggestion.id}
                id={suggestion.id}
                label={suggestion.label}
                imageSrc={suggestion.imageSrc}
                selected={selectedSuggestions.includes(suggestion.id)}
                onClick={() => toggleSuggestion(suggestion.id)}
              />
            ))}
          </div>
        </div>

        {/* Number of images selector */}
        <div className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Number of images
          </h2>

          <div className="flex flex-wrap gap-3">
            {IMAGE_COUNT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = numberOfImages === option.value;
              const showPremiumBadge =
                option.premium && !hasActiveSubscription;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNumberOfImages(option.value)}
                  className={clsx(
                    "relative flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{option.value}</span>

                  {/* Premium badge */}
                  {showPremiumBadge && (
                    <Gem className="absolute -top-1 -right-1 size-4 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        <Button
          color="primary"
          onClick={handleGenerate}
          loading={isGenerating}
          className="w-full py-3 text-base font-semibold"
        >
          <Sparkles className="size-4" data-slot="icon" />
          Generate Image
          <span className="ml-2 flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            <span className="text-amber-400">*</span>
            {tokenCost}
          </span>
        </Button>

        {/* Generated images section */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Generated Images
              </h2>

              {/* Toggle for video-capable images */}
              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Show images you can turn into video
                </span>
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  New
                </span>
                <input
                  type="checkbox"
                  checked={showHighlightVideo}
                  onChange={(e) => setShowHighlightVideo(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={clsx(
                    "relative h-6 w-11 rounded-full transition-colors",
                    showHighlightVideo ? "bg-primary" : "bg-muted",
                  )}
                >
                  <div
                    className={clsx(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      showHighlightVideo ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </div>
              </label>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Here, you can find your images. You can leave the page or start a
              new series while others are still loading.
            </p>

            {/* Images grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {isGenerating &&
                Array.from({ length: numberOfImages }).map((_, i) => (
                  <CardGeneratedImage
                    key={`loading-${i}`}
                    id={`loading-${i}`}
                    src=""
                    isLoading
                  />
                ))}
              {generatedImages
                .filter((img) => !showHighlightVideo || img.canBeVideo)
                .map((image) => (
                  <CardGeneratedImage
                    key={image.id}
                    id={image.id}
                    src={image.src}
                    canBeVideo={image.canBeVideo}
                  />
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Auth dialog */}
      <DialogAuth
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        variant={authVariant}
        onVariantChange={setAuthVariant}
      />
    </div>
  );
};

export default GenerateImageStep2;
