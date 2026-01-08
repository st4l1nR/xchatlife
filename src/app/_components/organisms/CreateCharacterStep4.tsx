"use client";

import React from "react";
import type { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import CardSelectable from "../molecules/CardSelectable";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type CreateCharacterStep4Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  characterType: CharacterFormData["characterType"];
  style: CharacterFormData["style"];
};

// Helper to get variant key
const getVariantKey = (characterType: string, style: string) => `${characterType}-${style}`;

// Base paths
const GIRLS_REALISTIC_BASE = "/images/create-character/girls/realistic/step-4";
const GIRLS_ANIME_BASE = "/images/create-character/girls/anime/step 4";
const TRANS_REALISTIC_BASE = "/images/create-character/trans/realistic/step 4";

// Body Type Options by variant
const BODY_TYPE_OPTIONS: Record<string, { value: CharacterFormData["bodyType"]; label: string; imageSrc: string }[]> = {
  "girls-realistic": [
    { value: "skinny", label: "Skinny", imageSrc: `${GIRLS_REALISTIC_BASE}/body-type/Skinny.png` },
    { value: "athletic", label: "Athletic", imageSrc: `${GIRLS_REALISTIC_BASE}/body-type/Athletic.png` },
    { value: "average", label: "Average", imageSrc: `${GIRLS_REALISTIC_BASE}/body-type/Average.png` },
    { value: "curvy", label: "Curvy", imageSrc: `${GIRLS_REALISTIC_BASE}/body-type/Curvy.png` },
    { value: "bbw", label: "BBW", imageSrc: `${GIRLS_REALISTIC_BASE}/body-type/BBW.png` },
  ],
  "girls-anime": [
    { value: "skinny", label: "Skinny", imageSrc: `${GIRLS_ANIME_BASE}/Body Type/Skinny.webp` },
    { value: "athletic", label: "Athletic", imageSrc: `${GIRLS_ANIME_BASE}/Body Type/Athletic.webp` },
    { value: "average", label: "Average", imageSrc: `${GIRLS_ANIME_BASE}/Body Type/Average.webp` },
    { value: "curvy", label: "Curvy", imageSrc: `${GIRLS_ANIME_BASE}/Body Type/Curvy.webp` },
    // No BBW for anime
  ],
  "trans-realistic": [
    { value: "skinny", label: "Skinny", imageSrc: `${TRANS_REALISTIC_BASE}/Body Type/Skinny.png` },
    { value: "athletic", label: "Athletic", imageSrc: `${TRANS_REALISTIC_BASE}/Body Type/Athletic.png` },
    { value: "average", label: "Average", imageSrc: `${TRANS_REALISTIC_BASE}/Body Type/Average.png` },
    { value: "curvy", label: "Curvy", imageSrc: `${TRANS_REALISTIC_BASE}/Body Type/Curvy.png` },
    { value: "bbw", label: "BBW", imageSrc: `${TRANS_REALISTIC_BASE}/Body Type/BBW.png` },
  ],
};

// Breast Size Options by variant
const BREAST_SIZE_OPTIONS: Record<string, { value: CharacterFormData["breastSize"]; label: string; imageSrc: string }[]> = {
  "girls-realistic": [
    { value: "small", label: "Small", imageSrc: `${GIRLS_REALISTIC_BASE}/breast-size/Small.png` },
    { value: "medium", label: "Medium", imageSrc: `${GIRLS_REALISTIC_BASE}/breast-size/Medium.png` },
    { value: "large", label: "Large", imageSrc: `${GIRLS_REALISTIC_BASE}/breast-size/Large.png` },
    { value: "extra_large", label: "Extra Large", imageSrc: `${GIRLS_REALISTIC_BASE}/breast-size/Extra Large.png` },
  ],
  "girls-anime": [
    { value: "small", label: "Small", imageSrc: `${GIRLS_ANIME_BASE}/Breast Size/Small.webp` },
    { value: "medium", label: "Medium", imageSrc: `${GIRLS_ANIME_BASE}/Breast Size/Medium.webp` },
    { value: "large", label: "Large", imageSrc: `${GIRLS_ANIME_BASE}/Breast Size/Large.webp` },
    { value: "extra_large", label: "Extra Large", imageSrc: `${GIRLS_ANIME_BASE}/Breast Size/Extra Large.webp` },
  ],
  // Trans realistic reuses girls realistic breast size
  "trans-realistic": [], // Will fallback to girls-realistic
};

const CreateCharacterStep4: React.FC<CreateCharacterStep4Props> = ({
  watch,
  setValue,
  errors,
  characterType,
  style,
}) => {
  const selectedBodyType = watch("bodyType");
  const selectedBreastSize = watch("breastSize");

  const variantKey = getVariantKey(characterType ?? "girls", style ?? "realistic");

  // Get body type options for the current variant
  const bodyTypeOptions = BODY_TYPE_OPTIONS[variantKey] || BODY_TYPE_OPTIONS["girls-realistic"] || [];

  // Trans realistic reuses girls realistic breast size options
  const breastSizeVariantKey = variantKey === "trans-realistic" ? "girls-realistic" : variantKey;
  const breastSizeOptions = BREAST_SIZE_OPTIONS[breastSizeVariantKey] || BREAST_SIZE_OPTIONS["girls-realistic"] || [];

  return (
    <div className="flex flex-col items-center">
      {/* Body Type Section */}
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Choose Body Type
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {bodyTypeOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedBodyType === option.value}
            onClick={() => setValue("bodyType", option.value, { shouldValidate: true })}
            aspectRatio="portrait"
            size="md"
            className="w-28 sm:w-32"
          />
        ))}
      </div>

      {errors.bodyType && (
        <p className="mb-6 text-destructive text-base/6 sm:text-sm/6">{errors.bodyType.message}</p>
      )}

      {/* Breast Size Section */}
      <h2 className="mb-6 mt-4 text-2xl font-bold text-foreground">
        Choose Breast Size
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {breastSizeOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedBreastSize === option.value}
            onClick={() => setValue("breastSize", option.value, { shouldValidate: true })}
            aspectRatio="portrait"
            size="md"
            className="w-32 sm:w-36"
          />
        ))}
      </div>

      {errors.breastSize && (
        <p className="mb-6 text-destructive text-base/6 sm:text-sm/6">{errors.breastSize.message}</p>
      )}
    </div>
  );
};

export default CreateCharacterStep4;
