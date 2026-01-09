"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import clsx from "clsx";
import CardSelectable from "../molecules/CardSelectable";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type CreateCharacterStep1Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
};

// R2 base URL
const R2_BASE = "https://pub-5085e00501634df38e5783f95d3fc3a8.r2.dev";

// Style options for each character type (using "girl" to match Prisma CharacterGender enum)
// posterUrl/videoUrl are R2 URLs for database storage, imageSrc/videoSrc are local for preview
const STYLE_OPTIONS = {
  girl: {
    realistic: {
      value: "realistic" as const,
      label: "Realistic",
      imageSrc:
        "/images/create-character/girls/realistic/step-1/276307461-4943cc8c-0300-4916-8c9c-5dbdeb5c8aab-webp90 (1).webp",
      videoSrc:
        "/images/create-character/girls/realistic/step-1/276307461-9eed0f84-9c12-4662-8ec4-6723eda29420 (1).mp4",
      posterUrl: `${R2_BASE}/seed/characters/276307461-4943cc8c-0300-4916-8c9c-5dbdeb5c8aab-webp90%20(1).webp`,
      videoUrl: `${R2_BASE}/seed/characters/276307461-9eed0f84-9c12-4662-8ec4-6723eda29420%20(1).mp4`,
      disabled: false,
    },
    anime: {
      value: "anime" as const,
      label: "Anime",
      imageSrc:
        "/images/create-character/girls/anime/step-1/249369779-ac2fc07d-9a74-4f9d-8e62-d9903128f452-webp90 (1).webp",
      videoSrc:
        "/images/create-character/girls/anime/step-1/249369779-944123a4-da88-42bc-8d11-fd183dbd8449 (1).mp4",
      posterUrl: `${R2_BASE}/seed/characters/249369779-ac2fc07d-9a74-4f9d-8e62-d9903128f452-webp90%20(1).webp`,
      videoUrl: `${R2_BASE}/seed/characters/249369779-944123a4-da88-42bc-8d11-fd183dbd8449%20(1).mp4`,
      disabled: false,
    },
  },
  trans: {
    realistic: {
      value: "realistic" as const,
      label: "Realistic",
      imageSrc:
        "/images/create-character/trans/realistic/step 1/a27b9a04-a900-46e1-a13e-bef80005294f.jpg",
      videoSrc:
        "/images/create-character/trans/realistic/step 1/e53ff50c-3be5-404a-8c9c-a6369e243945.mp4",
      posterUrl: `${R2_BASE}/seed/characters/a27b9a04-a900-46e1-a13e-bef80005294f.jpg`,
      videoUrl: `${R2_BASE}/seed/characters/e53ff50c-3be5-404a-8c9c-a6369e243945.mp4`,
      disabled: false,
    },
    anime: {
      value: "anime" as const,
      label: "Anime",
      imageSrc:
        "/images/create-character/trans/anime/step 1/028f58c3-0134-49e2-bf4f-ced82716a7d6.jpg",
      videoSrc:
        "/images/create-character/trans/anime/step 1/4fc1f5dd-8b9f-48d0-b012-b45d4e8ea46c.mp4",
      posterUrl: `${R2_BASE}/seed/characters/028f58c3-0134-49e2-bf4f-ced82716a7d6.jpg`,
      videoUrl: `${R2_BASE}/seed/characters/4fc1f5dd-8b9f-48d0-b012-b45d4e8ea46c.mp4`,
      disabled: true,
      comingSoon: true,
    },
  },
} as const;

const CHARACTER_TYPE_OPTIONS = [
  { value: "girl" as const, label: "Girls" },
  { value: "trans" as const, label: "Trans" },
] as const;

const CreateCharacterStep1: React.FC<CreateCharacterStep1Props> = ({
  watch,
  setValue,
  errors,
}) => {
  const selectedStyle = watch("style");
  const characterType = watch("characterType") ?? "girl";

  const currentStyleOptions = STYLE_OPTIONS[characterType];

  const resetFormFields = () => {
    // Reset all subsequent form fields to undefined when variant changes
    setValue(
      "ethnicity",
      undefined as unknown as CharacterFormData["ethnicity"],
    );
    setValue("age", 21);
    setValue(
      "hairStyle",
      undefined as unknown as CharacterFormData["hairStyle"],
    );
    setValue(
      "hairColor",
      undefined as unknown as CharacterFormData["hairColor"],
    );
    setValue("eyeColor", undefined as unknown as CharacterFormData["eyeColor"]);
    setValue("bodyType", undefined as unknown as CharacterFormData["bodyType"]);
    setValue(
      "breastSize",
      undefined as unknown as CharacterFormData["breastSize"],
    );
    setValue("name", undefined as unknown as CharacterFormData["name"]);
    setValue(
      "personality",
      undefined as unknown as CharacterFormData["personality"],
    );
    setValue(
      "relationship",
      undefined as unknown as CharacterFormData["relationship"],
    );
    setValue(
      "occupation",
      undefined as unknown as CharacterFormData["occupation"],
    );
    setValue("kinks", []);
    setValue("voice", undefined as unknown as CharacterFormData["voice"]);
  };

  const handleCharacterTypeChange = (
    newType: CharacterFormData["characterType"],
  ) => {
    if (newType === characterType) return;

    setValue("characterType", newType, { shouldValidate: true });
    // Reset style when changing character type if current style is disabled in new type
    const newOptions = STYLE_OPTIONS[newType];
    if (selectedStyle && newOptions[selectedStyle]?.disabled) {
      setValue("style", "realistic", { shouldValidate: true });
    }
    // Reset all form fields when changing character type
    resetFormFields();
  };

  const handleStyleChange = (newStyle: CharacterFormData["style"]) => {
    if (newStyle === selectedStyle) return;

    setValue("style", newStyle, { shouldValidate: true });

    // Set posterUrl and videoUrl from the selected style option (R2 URLs for database)
    const styleOption = currentStyleOptions[newStyle];
    setValue("posterUrl", styleOption.posterUrl);
    setValue("videoUrl", styleOption.videoUrl);

    // Reset all form fields when changing style
    resetFormFields();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Character Type Toggle */}
      <div className="bg-muted mb-6 flex items-center gap-1 rounded-full p-1">
        {CHARACTER_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleCharacterTypeChange(option.value)}
            className={clsx(
              "rounded-full px-6 py-2 text-sm font-medium transition-all",
              characterType === option.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <h2 className="text-foreground mb-8 text-2xl font-bold">
        Create my AI {characterType === "girl" ? "Girl" : "Trans"}
      </h2>

      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
        {Object.values(currentStyleOptions).map((option) => {
          const isDisabled = "disabled" in option && option.disabled;
          const isComingSoon = "comingSoon" in option && option.comingSoon;

          return (
            <div key={option.value} className="relative">
              <CardSelectable
                imageSrc={option.imageSrc}
                videoSrc={option.videoSrc}
                label={option.label}
                selected={selectedStyle === option.value}
                onClick={() => {
                  if (!isDisabled) {
                    handleStyleChange(option.value);
                  }
                }}
                aspectRatio="portrait"
                size="lg"
                className={clsx(
                  "w-64 sm:w-72",
                  isDisabled && "cursor-not-allowed opacity-50",
                )}
                disabled={isDisabled}
              />
              {isComingSoon && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
                  <span className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {errors.style && (
        <p className="text-destructive mt-4 text-base/6 sm:text-sm/6">
          {errors.style.message}
        </p>
      )}
    </div>
  );
};

export default CreateCharacterStep1;
