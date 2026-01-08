"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../../molecules/CardSelectable";
import { Slider } from "../../atoms/slider";
import type { CharacterFormData } from "./types";

type StepEthnicityAgeProps = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
};

const ethnicityOptions = [
  {
    value: "caucasian" as const,
    label: "Caucasian",
    imageSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/caucasian/e4925ead-1657-4d96-8e70-e786a4ffe918.png",
    videoSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/caucasian/20e1acad-bbb5-47b7-8616-2553150b4fbb (2).mp4",
  },
  {
    value: "asian" as const,
    label: "Asian",
    imageSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/asian/28b125a6-97ec-4d9b-8571-1c110900ad5f.png",
    videoSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/asian/fcfd01a9-5832-4002-ab6b-3e55a3cd679e (1).mp4",
  },
  {
    value: "black" as const,
    label: "Black / Afro",
    imageSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/afro/80b37dc8-d48d-4a85-8bc8-ed7d0cc32e2e.png",
    videoSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/afro/60f76612-3927-4987-8b15-c93c75fff8f6 (1).mp4",
  },
  {
    value: "latina" as const,
    label: "Latina",
    imageSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/latina/925bb491-89a1-4fef-bc5f-c419a826dd13.png",
    videoSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/latina/609a26cc-b20f-4bf3-9431-dc6aa8abebbd (1).mp4",
  },
  {
    value: "arab" as const,
    label: "Arab",
    imageSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/arab/bdb83fef-7285-40ef-af8a-72aa88b19d48 (1).jpg",
    videoSrc:
      "/images/create-character/girls/realistic/step-2-ethnicity/arab/4558188a-87e0-42a3-b1e2-013fa7bc2313 (1).mp4",
  },
];

const StepEthnicityAge: React.FC<StepEthnicityAgeProps> = ({
  watch,
  setValue,
  errors,
}) => {
  const selectedEthnicity = watch("ethnicity");
  const age = watch("age") ?? 21;

  return (
    <div className="flex flex-col items-center">
      {/* Ethnicity Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Choose Ethnicity
      </h2>

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {ethnicityOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            videoSrc={option.videoSrc}
            label={option.label}
            selected={selectedEthnicity === option.value}
            onClick={() =>
              setValue("ethnicity", option.value, { shouldValidate: true })
            }
            aspectRatio="portrait"
            size="md"
            className="w-32 sm:w-36"
          />
        ))}
      </div>

      {errors.ethnicity && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.ethnicity.message}
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

export default StepEthnicityAge;
