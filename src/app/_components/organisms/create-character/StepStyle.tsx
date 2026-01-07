"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../../molecules/CardSelectable";
import type { CharacterFormData } from "./types";

type StepStyleProps = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
};

const styleOptions = [
  {
    value: "realistic" as const,
    label: "Realistic",
    imageSrc:
      "/images/create-character/girls/realistic/step-1/276307461-4943cc8c-0300-4916-8c9c-5dbdeb5c8aab-webp90 (1).webp",
    videoSrc:
      "/images/create-character/girls/realistic/step-1/276307461-9eed0f84-9c12-4662-8ec4-6723eda29420 (1).mp4",
  },
  {
    value: "anime" as const,
    label: "Anime",
    imageSrc:
      "/images/create-character/girls/anime/step-1/249369779-ac2fc07d-9a74-4f9d-8e62-d9903128f452-webp90 (1).webp",
    videoSrc:
      "/images/create-character/girls/anime/step-1/249369779-944123a4-da88-42bc-8d11-fd183dbd8449 (1).mp4",
  },
];

const StepStyle: React.FC<StepStyleProps> = ({ watch, setValue, errors }) => {
  const selectedStyle = watch("style");

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-foreground mb-8 text-2xl font-bold">
        Create my AI Girl
      </h2>

      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
        {styleOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            videoSrc={option.videoSrc}
            label={option.label}
            selected={selectedStyle === option.value}
            onClick={() =>
              setValue("style", option.value, { shouldValidate: true })
            }
            aspectRatio="portrait"
            size="lg"
            className="w-64 sm:w-72"
          />
        ))}
      </div>

      {errors.style && (
        <p className="mt-4 text-destructive text-base/6 sm:text-sm/6">{errors.style.message}</p>
      )}
    </div>
  );
};

export default StepStyle;
