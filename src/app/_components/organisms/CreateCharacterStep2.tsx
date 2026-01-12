"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../molecules/CardSelectable";
import CardSelectableSkeleton from "../atoms/CardSelectableSkeleton";
import { Slider } from "../atoms/slider";
import type {
  CharacterFormData,
  VariantOption,
} from "../pages/CreateCharacterPage";

type CreateCharacterStep2Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  ethnicities: VariantOption[];
  loading: boolean;
};

const CreateCharacterStep2: React.FC<CreateCharacterStep2Props> = ({
  watch,
  setValue,
  errors,
  ethnicities,
  loading,
}) => {
  const selectedEthnicityId = watch("ethnicityId");
  const age = watch("age") ?? 21;

  return (
    <div className="flex flex-col items-center">
      {/* Ethnicity Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Choose Ethnicity
      </h2>

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {loading ? (
          <CardSelectableSkeleton
            count={5}
            aspectRatio="portrait"
            size="md"
            className="w-32 sm:w-36"
          />
        ) : (
          ethnicities.map((option) => (
            <CardSelectable
              key={option.id}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc ?? undefined}
              label={option.label}
              selected={selectedEthnicityId === option.id}
              onClick={() =>
                setValue("ethnicityId", option.id, { shouldValidate: true })
              }
              aspectRatio="portrait"
              size="md"
              className="w-32 sm:w-36"
            />
          ))
        )}
      </div>

      {errors.ethnicityId && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.ethnicityId.message}
        </p>
      )}

      {/* Age Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">Choose Age</h2>

      <div className="bg-muted w-full max-w-lg rounded-xl p-6">
        <Slider
          min={18}
          max={55}
          value={age}
          onChange={(value) => setValue("age", value, { shouldValidate: true })}
          showValue
          valueLabel="Years"
          minLabel="18"
          maxLabel="55+"
        />
      </div>

      {errors.age && (
        <p className="text-destructive mt-4 text-base/6 sm:text-sm/6">
          {errors.age.message}
        </p>
      )}
    </div>
  );
};

export default CreateCharacterStep2;
