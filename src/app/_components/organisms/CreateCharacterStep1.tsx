"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import clsx from "clsx";
import CardSelectable from "../molecules/CardSelectable";
import CardSelectableSkeleton from "../atoms/CardSelectableSkeleton";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type CharacterVariant = {
  id: string;
  name: string;
  label: string;
  gender: string;
  style: string;
  imageSrc: string | null;
  videoSrc: string | null;
  isActive: boolean;
  sortOrder: number;
};

type CreateCharacterStep1Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  variants: CharacterVariant[];
  loading: boolean;
};

const CHARACTER_TYPE_OPTIONS = [
  { value: "girl" as const, label: "Girls" },
  { value: "trans" as const, label: "Trans" },
] as const;

const CreateCharacterStep1: React.FC<CreateCharacterStep1Props> = ({
  watch,
  setValue,
  errors,
  variants,
  loading,
}) => {
  const selectedStyle = watch("style");
  const characterType = watch("characterType") ?? "girl";

  // Filter variants by current character type (gender)
  const currentVariants = variants.filter((v) => v.gender === characterType);

  const resetFormFields = () => {
    // Reset all subsequent form fields when variant changes
    setValue("ethnicityId", "");
    setValue("age", 21);
    setValue("hairStyleId", "");
    setValue("hairColorId", "");
    setValue("eyeColorId", "");
    setValue("bodyTypeId", "");
    setValue("breastSizeId", "");
    setValue("name", "");
    setValue("personalityId", "");
    setValue("relationshipId", "");
    setValue("occupationId", "");
    setValue("voice", "");
  };

  const handleCharacterTypeChange = (
    newType: CharacterFormData["characterType"],
  ) => {
    if (newType === characterType) return;

    setValue("characterType", newType, { shouldValidate: true });

    // Get variants for new type
    const newTypeVariants = variants.filter((v) => v.gender === newType);

    // Reset style when changing character type if current style is not available or inactive
    const currentStyleVariant = newTypeVariants.find(
      (v) => v.style === selectedStyle,
    );
    if (!currentStyleVariant || !currentStyleVariant.isActive) {
      // Find first active variant for new type
      const firstActive = newTypeVariants.find((v) => v.isActive);
      if (firstActive) {
        setValue("style", firstActive.style as CharacterFormData["style"], {
          shouldValidate: true,
        });
        setValue("posterUrl", firstActive.imageSrc ?? undefined);
        setValue("videoUrl", firstActive.videoSrc ?? undefined);
      }
    }

    // Reset all form fields when changing character type
    resetFormFields();
  };

  const handleStyleChange = (variant: CharacterVariant) => {
    if (variant.style === selectedStyle) return;

    setValue("style", variant.style as CharacterFormData["style"], {
      shouldValidate: true,
    });

    // Set posterUrl and videoUrl from the selected variant (R2 URLs for database)
    setValue("posterUrl", variant.imageSrc ?? undefined);
    setValue("videoUrl", variant.videoSrc ?? undefined);

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
        {loading ? (
          <CardSelectableSkeleton
            aspectRatio="portrait"
            size="lg"
            count={2}
            className="w-64 sm:w-72"
          />
        ) : (
          currentVariants.map((variant) => {
            const isDisabled = !variant.isActive;
            const isSelected = selectedStyle === variant.style;

            return (
              <div key={variant.id} className="relative">
                <CardSelectable
                  imageSrc={variant.imageSrc ?? ""}
                  videoSrc={variant.videoSrc ?? undefined}
                  label={variant.label}
                  selected={isSelected}
                  onClick={() => {
                    if (!isDisabled) {
                      handleStyleChange(variant);
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
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
                    <span className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
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
