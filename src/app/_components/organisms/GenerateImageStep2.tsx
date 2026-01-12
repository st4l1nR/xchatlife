"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import toast from "react-hot-toast";
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
  Dices,
  Coins,
} from "lucide-react";
import { IMAGE_GENERATION_COST } from "@/lib/constants";
import { Button } from "../atoms/button";
import CardSuggestion from "../molecules/CardSuggestion";
import CardGeneratedImage from "../molecules/CardGeneratedImage";
import DialogAuth, { type DialogAuthVariant } from "./DialogAuth";
import DialogUpgrade from "./DialogUpgrade";
import { useApp } from "@/app/_contexts/AppContext";
import { api } from "@/trpc/react";
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

type Suggestion = {
  id: string;
  label: string;
  imageSrc: string;
  prompt: string;
};

const SUGGESTIONS: Record<SuggestionCategoryId, Suggestion[]> = {
  outfit: [
    {
      id: "bikini",
      label: "Bikini",
      imageSrc: "/images/suggestions/outfit/bikini.webp",
      prompt: "wearing a sexy bikini",
    },
    {
      id: "skirt",
      label: "Skirt",
      imageSrc: "/images/suggestions/outfit/skirt.webp",
      prompt: "wearing a stylish skirt",
    },
    {
      id: "lingerie",
      label: "Lingerie",
      imageSrc: "/images/suggestions/outfit/lingerie.webp",
      prompt: "wearing elegant lace lingerie",
    },
    {
      id: "crop-top",
      label: "Crop top",
      imageSrc: "/images/suggestions/outfit/crop-top.webp",
      prompt: "wearing a cute crop top",
    },
    {
      id: "leather",
      label: "Leather",
      imageSrc: "/images/suggestions/outfit/leather.webp",
      prompt: "wearing a sleek leather outfit",
    },
    {
      id: "mini-skirt",
      label: "Mini-skirt",
      imageSrc: "/images/suggestions/outfit/mini-skirt.webp",
      prompt: "wearing a flirty mini-skirt",
    },
    {
      id: "satin-robe",
      label: "Satin Robe",
      imageSrc: "/images/suggestions/outfit/satin-robe.webp",
      prompt: "wearing a luxurious satin robe",
    },
    {
      id: "jeans",
      label: "Jeans",
      imageSrc: "/images/suggestions/outfit/jeans.webp",
      prompt: "wearing tight-fitting jeans",
    },
    {
      id: "jumpsuit",
      label: "Jumpsuit",
      imageSrc: "/images/suggestions/outfit/jumpsuit.webp",
      prompt: "wearing a fashionable jumpsuit",
    },
    {
      id: "sundress",
      label: "Sundress",
      imageSrc: "/images/suggestions/outfit/sundress.webp",
      prompt: "wearing a flowy sundress",
    },
  ],
  action: [
    {
      id: "working-out",
      label: "Working out",
      imageSrc: "/images/suggestions/action/working-out.webp",
      prompt: "working out intensely",
    },
    {
      id: "dining",
      label: "Dining",
      imageSrc: "/images/suggestions/action/dining.webp",
      prompt: "enjoying a fine dining experience",
    },
    {
      id: "tanning",
      label: "Tanning",
      imageSrc: "/images/suggestions/action/tanning.webp",
      prompt: "tanning under the sun",
    },
    {
      id: "walking",
      label: "Walking",
      imageSrc: "/images/suggestions/action/walking.webp",
      prompt: "walking gracefully",
    },
  ],
  pose: [
    {
      id: "standing",
      label: "Standing",
      imageSrc: "/images/suggestions/pose/standing.webp",
      prompt: "standing confidently",
    },
    {
      id: "sitting",
      label: "Sitting",
      imageSrc: "/images/suggestions/pose/sitting.webp",
      prompt: "sitting elegantly",
    },
    {
      id: "squatting",
      label: "Squatting",
      imageSrc: "/images/suggestions/pose/squatting.webp",
      prompt: "in a squatting pose",
    },
    {
      id: "stretching",
      label: "Stretching",
      imageSrc: "/images/suggestions/pose/stretching.webp",
      prompt: "stretching sensually",
    },
    {
      id: "kneeling",
      label: "Kneeling",
      imageSrc: "/images/suggestions/pose/kneeling.webp",
      prompt: "kneeling gracefully",
    },
  ],
  accessories: [
    {
      id: "necklace",
      label: "Necklace",
      imageSrc: "/images/suggestions/accessories/necklace.webp",
      prompt: "wearing a beautiful necklace",
    },
    {
      id: "earrings",
      label: "Earrings",
      imageSrc: "/images/suggestions/accessories/earrings.webp",
      prompt: "wearing elegant earrings",
    },
    {
      id: "glasses",
      label: "Glasses",
      imageSrc: "/images/suggestions/accessories/glasses.webp",
      prompt: "wearing stylish glasses",
    },
    {
      id: "choker",
      label: "Choker",
      imageSrc: "/images/suggestions/accessories/choker.webp",
      prompt: "wearing a sleek choker",
    },
    {
      id: "hat",
      label: "Hat",
      imageSrc: "/images/suggestions/accessories/hat.webp",
      prompt: "wearing a fashionable hat",
    },
    {
      id: "sunglasses",
      label: "Sunglasses",
      imageSrc: "/images/suggestions/accessories/sunglasses.webp",
      prompt: "wearing cool sunglasses",
    },
  ],
  scene: [
    {
      id: "garden",
      label: "Garden",
      imageSrc: "/images/suggestions/scene/garden.webp",
      prompt: "in a beautiful garden",
    },
    {
      id: "beach",
      label: "Beach",
      imageSrc: "/images/suggestions/scene/beach.webp",
      prompt: "at a sunny beach",
    },
    {
      id: "bedroom",
      label: "Bedroom",
      imageSrc: "/images/suggestions/scene/bedroom.webp",
      prompt: "in a cozy bedroom",
    },
    {
      id: "gym",
      label: "Gym",
      imageSrc: "/images/suggestions/scene/gym.webp",
      prompt: "at the gym",
    },
    {
      id: "bar",
      label: "Bar",
      imageSrc: "/images/suggestions/scene/bar.webp",
      prompt: "at a stylish bar",
    },
    {
      id: "kitchen",
      label: "Kitchen",
      imageSrc: "/images/suggestions/scene/kitchen.webp",
      prompt: "in the kitchen",
    },
    {
      id: "restaurant",
      label: "Restaurant",
      imageSrc: "/images/suggestions/scene/restaurant.webp",
      prompt: "at an elegant restaurant",
    },
    {
      id: "balcony",
      label: "Balcony",
      imageSrc: "/images/suggestions/scene/balcony.webp",
      prompt: "on a scenic balcony",
    },
    {
      id: "bathtub",
      label: "Bathtub",
      imageSrc: "/images/suggestions/scene/bathtub.webp",
      prompt: "in a relaxing bathtub",
    },
    {
      id: "street",
      label: "Street",
      imageSrc: "/images/suggestions/scene/street.webp",
      prompt: "on a city street",
    },
  ],
};

const IMAGE_COUNT_OPTIONS = [
  { value: 1 as const, icon: Circle, premium: false },
  { value: 4 as const, icon: Grid2X2, premium: true },
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
  const [numberOfImages, setNumberOfImages] = useState<ImageCount>(1);
  const [prompt, setPrompt] = useState(
    "Sitting on a leather sofa, wearing a fur jacket, wearing lace underwear, gazing seductively at the viewer.",
  );
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [showHighlightVideo, setShowHighlightVideo] = useState(true);

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  // Upgrade dialog state
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const currentSuggestions = SUGGESTIONS[activeCategory];

  const addSuggestionToPrompt = (suggestion: Suggestion) => {
    setPrompt((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return suggestion.prompt;
      // Add comma if the prompt doesn't end with punctuation
      const needsComma = !trimmed.endsWith(",") && !trimmed.endsWith(".");
      return `${trimmed}${needsComma ? "," : ""} ${suggestion.prompt}`;
    });
  };

  const generateRandomPrompt = () => {
    const categories = Object.keys(SUGGESTIONS) as SuggestionCategoryId[];

    // Shuffle and pick 3-5 random categories (prefer longer prompts)
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 categories
    const selected = shuffled.slice(0, count);

    // Pick one random suggestion from each category
    const parts = selected.map((category) => {
      const suggestions = SUGGESTIONS[category];
      const random =
        suggestions[Math.floor(Math.random() * suggestions.length)]!;
      return random.prompt;
    });

    // Combine with proper grammar
    const combined = parts.join(", ");
    return combined.charAt(0).toUpperCase() + combined.slice(1) + ".";
  };

  const handleRandomPrompt = () => {
    setPrompt(generateRandomPrompt());
  };

  // tRPC mutation for image generation
  const generateMutation = api.image.generate.useMutation({
    onSuccess: (result) => {
      // Map API response to display format
      const newImages: GeneratedImage[] = result.data.map((img) => ({
        id: img.id,
        src: img.media.url,
        canBeVideo: img.canConvertToVideo,
      }));
      setGeneratedImages((prev) => [...newImages, ...prev]);
      toast.success(`Generated ${newImages.length} image(s) successfully!`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerate = async () => {
    // Check auth
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    // Check subscription for multiple images (4+)
    if (numberOfImages > 1 && !hasActiveSubscription) {
      setUpgradeDialogOpen(true);
      return;
    }

    // Call the API
    generateMutation.mutate({
      prompt,
      numberOfImages,
      characterId: character.id,
    });
  };

  // Use mutation pending state for loading
  const isGenerating = generateMutation.isPending;

  // Calculate token cost based on number of images
  const tokenCost = numberOfImages * IMAGE_GENERATION_COST;

  return (
    <div className={clsx("flex min-h-screen flex-col", className)}>
      {/* Header - Single row */}
      <header className="bg-background/95 border-border sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Back button */}
          <Button plain onClick={onBack} className="shrink-0">
            <ArrowLeft className="size-5" />
          </Button>

          {/* Title - centered with flex-1 */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <Sparkles className="text-primary size-5" />
            <h1 className="text-foreground text-base font-bold sm:text-lg">
              Generate Image
            </h1>
          </div>

          {/* Spacer to balance the back button */}
          <div className="w-10 shrink-0" />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {/* Character preview and prompt */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
          {/* Character image */}
          <div className="relative mx-auto aspect-square w-52 shrink-0 md:mx-0 md:aspect-auto md:w-[40%]">
            <div className="bg-muted relative h-full overflow-hidden rounded-xl">
              <Image
                src={character.imageSrc}
                alt={character.name}
                fill
                unoptimized
                className="object-cover object-top"
                sizes="192px"
              />

              {/* V2 badge */}
              <div className="bg-primary text-primary-foreground absolute top-2 left-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold">
                <Eye className="size-3" />
                V2
              </div>

              {/* Name overlay */}
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <span className="text-sm font-bold text-white">
                  {character.name}
                </span>
              </div>
            </div>
          </div>

          {/* Prompt input - 60% width */}
          <div className="md:w-[60%]">
            <div className="relative h-full">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
                maxLength={2000}
                className="bg-muted text-foreground placeholder:text-muted-foreground border-border focus:ring-primary h-full min-h-64 w-full resize-none rounded-xl border p-4 pr-10 pb-10 text-sm focus:ring-2 focus:outline-none"
                placeholder="Describe the image you want to generate..."
              />
              <Edit3 className="text-muted-foreground absolute top-4 right-4 size-4" />
              <div className="absolute right-4 bottom-4 flex items-center gap-3">
                <span
                  className={clsx(
                    "text-xs",
                    prompt.length >= 2000
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {prompt.length}/2000
                </span>
                <button
                  type="button"
                  onClick={handleRandomPrompt}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Generate random prompt"
                >
                  <Dices className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions section */}
        <div className="mb-8">
          <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="text-foreground text-base font-semibold">
              Suggestions
            </h2>

            {/* Category tabs */}
            <div className="flex gap-4 overflow-x-auto sm:mx-auto">
              {SUGGESTION_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={clsx(
                    "border-b-2 pb-1 text-sm font-medium whitespace-nowrap transition-colors",
                    activeCategory === category.id
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-transparent",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestion cards */}
          <div className="scrollbar-muted flex gap-3 overflow-x-auto pb-2">
            {currentSuggestions.map((suggestion) => (
              <CardSuggestion
                key={suggestion.id}
                id={suggestion.id}
                label={suggestion.label}
                imageSrc={suggestion.imageSrc}
                onClick={() => addSuggestionToPrompt(suggestion)}
              />
            ))}
          </div>
        </div>

        {/* Number of images selector */}
        <div className="mb-8">
          <h2 className="text-foreground mb-4 text-base font-semibold">
            Number of images
          </h2>

          <div className="flex flex-wrap gap-3">
            {IMAGE_COUNT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = numberOfImages === option.value;
              const showPremiumBadge = option.premium && !hasActiveSubscription;

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
                    <Gem className="text-primary absolute -top-1 -right-1 size-4" />
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
          <span className="ml-2 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <Coins className="size-3.5" />
            <span>{tokenCost}</span>
          </span>
        </Button>

        {/* Generated images section */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-foreground text-lg font-bold">
                Generated Images
              </h2>

              {/* Toggle for video-capable images */}
              <label className="relative flex cursor-pointer items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Show images you can turn into video
                </span>
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
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

            <p className="text-muted-foreground mb-4 text-sm">
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

      {/* Upgrade dialog */}
      <DialogUpgrade
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
      />
    </div>
  );
};

export default GenerateImageStep2;
