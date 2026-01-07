"use client";

import React from "react";
import type { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import CardSelectable from "../../molecules/CardSelectable";
import type { CharacterFormData } from "./types";

type StepAppearanceProps = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
};

const STEP3_BASE = "/images/create-character/girls/realistic/step-3";

const hairStyleOptions = [
  {
    value: "straight" as const,
    label: "Straight",
    imageSrc: `${STEP3_BASE}/hair-style/straight/de1d672d-1896-48b9-aa83-84df2bb514ef.png`,
    videoSrc: `${STEP3_BASE}/hair-style/straight/307bddcb-f017-4ddc-8f65-b611f250d529 (1).mp4`,
  },
  {
    value: "bangs" as const,
    label: "Bangs",
    imageSrc: `${STEP3_BASE}/hair-style/bangs/5540f73a-ff06-480f-9418-a9dba56da77e.png`,
    videoSrc: `${STEP3_BASE}/hair-style/bangs/832a3920-77c5-4041-9b04-0b4490d0545b (1).mp4`,
  },
  {
    value: "curly" as const,
    label: "Curly",
    imageSrc: `${STEP3_BASE}/hair-style/curly/b654873f-70b8-48a9-8326-c4323436de04.png`,
    videoSrc: `${STEP3_BASE}/hair-style/curly/22860e41-09c4-4326-b0bd-2e23a4e70dd8 (1).mp4`,
  },
  {
    value: "bun" as const,
    label: "Bun",
    imageSrc: `${STEP3_BASE}/hair-style/bun/6fec3766-e730-47f6-8495-ae2fba450c15.png`,
    videoSrc: `${STEP3_BASE}/hair-style/bun/5869df15-6371-46af-9013-05ae33f02f57 (1).mp4`,
  },
  {
    value: "short" as const,
    label: "Short",
    imageSrc: `${STEP3_BASE}/hair-style/short/e8edbf12-39d9-4f14-bed5-38fd67904f7c.png`,
    videoSrc: `${STEP3_BASE}/hair-style/short/55bce468-1b98-4281-a99b-59bf472c0e42 (1).mp4`,
  },
  {
    value: "ponytail" as const,
    label: "Ponytail",
    imageSrc: `${STEP3_BASE}/hair-style/ponytail/220259e7-08e7-40e2-9db2-ecdaf71b7349.png`,
    videoSrc: `${STEP3_BASE}/hair-style/ponytail/43954e0a-1ce8-443c-9ade-e5f641f85dd1 (1).mp4`,
  },
];

const hairColorOptions = [
  { value: "brunette" as const, label: "Brunette", imageSrc: `${STEP3_BASE}/hair-color/Brunette.png` },
  { value: "blonde" as const, label: "Blonde", imageSrc: `${STEP3_BASE}/hair-color/Blonde.png` },
  { value: "black" as const, label: "Black", imageSrc: `${STEP3_BASE}/hair-color/Black.png` },
  { value: "redhead" as const, label: "Redhead", imageSrc: `${STEP3_BASE}/hair-color/Redhead.png` },
  { value: "pink" as const, label: "Pink", imageSrc: `${STEP3_BASE}/hair-color/Pink.png` },
];

const eyeColorOptions = [
  { value: "brown" as const, label: "Brown", imageSrc: `${STEP3_BASE}/eye-color/Brown.png` },
  { value: "blue" as const, label: "Blue", imageSrc: `${STEP3_BASE}/eye-color/Blue.png` },
  { value: "green" as const, label: "Green", imageSrc: `${STEP3_BASE}/eye-color/Green.png` },
];

const StepAppearance: React.FC<StepAppearanceProps> = ({
  watch,
  setValue,
  errors,
}) => {
  const selectedHairStyle = watch("hairStyle");
  const selectedHairColor = watch("hairColor");
  const selectedEyeColor = watch("eyeColor");

  return (
    <div className="flex flex-col items-center">
      {/* Hair Style Section */}
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Choose Hair Style
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {hairStyleOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            videoSrc={option.videoSrc}
            label={option.label}
            selected={selectedHairStyle === option.value}
            onClick={() => setValue("hairStyle", option.value, { shouldValidate: true })}
            aspectRatio="portrait"
            size="sm"
            className="w-24 sm:w-28"
          />
        ))}
      </div>

      {errors.hairStyle && (
        <p className="mb-6 text-destructive text-base/6 sm:text-sm/6">{errors.hairStyle.message}</p>
      )}

      {/* Hair Color Section */}
      <h2 className="mb-6 mt-4 text-2xl font-bold text-foreground">
        Choose Hair Color
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {hairColorOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedHairColor === option.value}
            onClick={() => setValue("hairColor", option.value, { shouldValidate: true })}
            aspectRatio="portrait"
            size="sm"
            className="w-24 sm:w-28"
          />
        ))}
      </div>

      {errors.hairColor && (
        <p className="mb-6 text-destructive text-base/6 sm:text-sm/6">{errors.hairColor.message}</p>
      )}

      {/* Eye Color Section */}
      <h2 className="mb-6 mt-4 text-2xl font-bold text-foreground">
        Choose Eye Color
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {eyeColorOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedEyeColor === option.value}
            onClick={() => setValue("eyeColor", option.value, { shouldValidate: true })}
            aspectRatio="landscape"
            size="md"
            className="w-32 sm:w-36"
          />
        ))}
      </div>

      {errors.eyeColor && (
        <p className="mb-6 text-destructive text-base/6 sm:text-sm/6">{errors.eyeColor.message}</p>
      )}
    </div>
  );
};

export default StepAppearance;
