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

type CreateCharacterStep4Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  bodyTypes: VariantOption[];
  breastSizes: VariantOption[];
  loading: boolean;
};

const CreateCharacterStep4: React.FC<CreateCharacterStep4Props> = ({
  watch,
  setValue,
  errors,
  bodyTypes,
  breastSizes,
  loading,
}) => {
  const selectedBodyTypeId = watch("bodyTypeId");
  const selectedBreastSizeId = watch("breastSizeId");

  return (
    <div className="flex flex-col items-center">
      {/* Body Type Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Choose Body Type
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {loading ? (
          <CardSelectableSkeleton
            count={5}
            aspectRatio="portrait"
            size="md"
            className="w-28 sm:w-32"
          />
        ) : (
          bodyTypes.map((option) => (
            <CardSelectable
              key={option.id}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc ?? undefined}
              label={option.label}
              selected={selectedBodyTypeId === option.id}
              onClick={() =>
                setValue("bodyTypeId", option.id, { shouldValidate: true })
              }
              aspectRatio="portrait"
              size="md"
              className="w-28 sm:w-32"
            />
          ))
        )}
      </div>

      {errors.bodyTypeId && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.bodyTypeId.message}
        </p>
      )}

      {/* Breast Size Section */}
      <h2 className="text-foreground mt-4 mb-6 text-2xl font-bold">
        Choose Breast Size
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {loading ? (
          <CardSelectableSkeleton
            count={4}
            aspectRatio="portrait"
            size="md"
            className="w-32 sm:w-36"
          />
        ) : (
          breastSizes.map((option) => (
            <CardSelectable
              key={option.id}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc ?? undefined}
              label={option.label}
              selected={selectedBreastSizeId === option.id}
              onClick={() =>
                setValue("breastSizeId", option.id, { shouldValidate: true })
              }
              aspectRatio="portrait"
              size="md"
              className="w-32 sm:w-36"
            />
          ))
        )}
      </div>

      {errors.breastSizeId && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.breastSizeId.message}
        </p>
      )}
    </div>
  );
};

export default CreateCharacterStep4;
