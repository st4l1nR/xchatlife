"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../../molecules/CardSelectable";
import type { CharacterFormData } from "./types";

type StepBodyProps = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
};

const STEP4_BASE = "/images/create-character/girls/realistic/step-4";

const bodyTypeOptions = [
  {
    value: "skinny" as const,
    label: "Skinny",
    imageSrc: `${STEP4_BASE}/body-type/Skinny.png`,
  },
  {
    value: "athletic" as const,
    label: "Athletic",
    imageSrc: `${STEP4_BASE}/body-type/Athletic.png`,
  },
  {
    value: "average" as const,
    label: "Average",
    imageSrc: `${STEP4_BASE}/body-type/Average.png`,
  },
  {
    value: "curvy" as const,
    label: "Curvy",
    imageSrc: `${STEP4_BASE}/body-type/Curvy.png`,
  },
  {
    value: "bbw" as const,
    label: "BBW",
    imageSrc: `${STEP4_BASE}/body-type/BBW.png`,
  },
];

const breastSizeOptions = [
  {
    value: "small" as const,
    label: "Small",
    imageSrc: `${STEP4_BASE}/breast-size/Small.png`,
  },
  {
    value: "medium" as const,
    label: "Medium",
    imageSrc: `${STEP4_BASE}/breast-size/Medium.png`,
  },
  {
    value: "large" as const,
    label: "Large",
    imageSrc: `${STEP4_BASE}/breast-size/Large.png`,
  },
  {
    value: "extra-large" as const,
    label: "Extra Large",
    imageSrc: `${STEP4_BASE}/breast-size/Extra Large.png`,
  },
];

const StepBody: React.FC<StepBodyProps> = ({ watch, setValue, errors }) => {
  const selectedBodyType = watch("bodyType");
  const selectedBreastSize = watch("breastSize");

  return (
    <div className="flex flex-col items-center">
      {/* Body Type Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Choose Body Type
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {bodyTypeOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedBodyType === option.value}
            onClick={() =>
              setValue("bodyType", option.value, { shouldValidate: true })
            }
            aspectRatio="portrait"
            size="md"
            className="w-28 sm:w-32"
          />
        ))}
      </div>

      {errors.bodyType && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.bodyType.message}
        </p>
      )}

      {/* Breast Size Section */}
      <h2 className="text-foreground mt-4 mb-6 text-2xl font-bold">
        Choose Breast Size
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {breastSizeOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedBreastSize === option.value}
            onClick={() =>
              setValue("breastSize", option.value, { shouldValidate: true })
            }
            aspectRatio="portrait"
            size="md"
            className="w-32 sm:w-36"
          />
        ))}
      </div>

      {errors.breastSize && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.breastSize.message}
        </p>
      )}
    </div>
  );
};

export default StepBody;
