"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../molecules/CardSelectable";
import CardSelectableSkeleton from "../atoms/CardSelectableSkeleton";
import type {
  CharacterFormData,
  VariantOption,
} from "../pages/CreateCharacterPage";

type CreateCharacterStep3Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  hairStyles: VariantOption[];
  hairColors: VariantOption[];
  eyeColors: VariantOption[];
  loading: boolean;
};

const CreateCharacterStep3: React.FC<CreateCharacterStep3Props> = ({
  watch,
  setValue,
  errors,
  hairStyles,
  hairColors,
  eyeColors,
  loading,
}) => {
  const selectedHairStyleId = watch("hairStyleId");
  const selectedHairColorId = watch("hairColorId");
  const selectedEyeColorId = watch("eyeColorId");

  return (
    <div className="flex flex-col items-center">
      {/* Hair Style Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Choose Hair Style
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {loading ? (
          <CardSelectableSkeleton
            count={6}
            aspectRatio="portrait"
            size="sm"
            className="w-24 sm:w-28"
          />
        ) : (
          hairStyles.map((option) => (
            <CardSelectable
              key={option.id}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc ?? undefined}
              label={option.label}
              selected={selectedHairStyleId === option.id}
              onClick={() =>
                setValue("hairStyleId", option.id, { shouldValidate: true })
              }
              aspectRatio="portrait"
              size="sm"
              className="w-24 sm:w-28"
            />
          ))
        )}
      </div>

      {errors.hairStyleId && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.hairStyleId.message}
        </p>
      )}

      {/* Hair Color Section */}
      <h2 className="text-foreground mt-4 mb-6 text-2xl font-bold">
        Choose Hair Color
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {loading ? (
          <CardSelectableSkeleton
            count={5}
            aspectRatio="portrait"
            size="sm"
            className="w-24 sm:w-28"
          />
        ) : (
          hairColors.map((option) => (
            <CardSelectable
              key={option.id}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc ?? undefined}
              label={option.label}
              selected={selectedHairColorId === option.id}
              onClick={() =>
                setValue("hairColorId", option.id, { shouldValidate: true })
              }
              aspectRatio="portrait"
              size="sm"
              className="w-24 sm:w-28"
            />
          ))
        )}
      </div>

      {errors.hairColorId && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.hairColorId.message}
        </p>
      )}

      {/* Eye Color Section */}
      <h2 className="text-foreground mt-4 mb-6 text-2xl font-bold">
        Choose Eye Color
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {loading ? (
          <CardSelectableSkeleton
            count={3}
            aspectRatio="landscape"
            size="md"
            className="w-32 sm:w-36"
          />
        ) : (
          eyeColors.map((option) => (
            <CardSelectable
              key={option.id}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc ?? undefined}
              label={option.label}
              selected={selectedEyeColorId === option.id}
              onClick={() =>
                setValue("eyeColorId", option.id, { shouldValidate: true })
              }
              aspectRatio="landscape"
              size="md"
              className="w-32 sm:w-36"
            />
          ))
        )}
      </div>

      {errors.eyeColorId && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.eyeColorId.message}
        </p>
      )}
    </div>
  );
};

export default CreateCharacterStep3;
