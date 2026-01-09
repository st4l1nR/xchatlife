"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../molecules/CardSelectable";
import { Slider } from "../atoms/slider";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type CreateCharacterStep2Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  characterType: CharacterFormData["characterType"];
  style: CharacterFormData["style"];
};

// Helper to get variant key
const getVariantKey = (characterType: string, style: string) =>
  `${characterType}-${style}`;

const ETHNICITY_OPTIONS: Record<
  string,
  {
    value: CharacterFormData["ethnicity"];
    label: string;
    imageSrc: string;
    videoSrc?: string;
  }[]
> = {
  "girls-realistic": [
    {
      value: "caucasian",
      label: "Caucasian",
      imageSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/caucasian/e4925ead-1657-4d96-8e70-e786a4ffe918.png",
      videoSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/caucasian/20e1acad-bbb5-47b7-8616-2553150b4fbb (2).mp4",
    },
    {
      value: "asian",
      label: "Asian",
      imageSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/asian/28b125a6-97ec-4d9b-8571-1c110900ad5f.png",
      videoSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/asian/fcfd01a9-5832-4002-ab6b-3e55a3cd679e (1).mp4",
    },
    {
      value: "black",
      label: "Black / Afro",
      imageSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/afro/80b37dc8-d48d-4a85-8bc8-ed7d0cc32e2e.png",
      videoSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/afro/60f76612-3927-4987-8b15-c93c75fff8f6 (1).mp4",
    },
    {
      value: "latina",
      label: "Latina",
      imageSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/latina/925bb491-89a1-4fef-bc5f-c419a826dd13.png",
      videoSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/latina/609a26cc-b20f-4bf3-9431-dc6aa8abebbd (1).mp4",
    },
    {
      value: "arab",
      label: "Arab",
      imageSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/arab/bdb83fef-7285-40ef-af8a-72aa88b19d48 (1).jpg",
      videoSrc:
        "/images/create-character/girls/realistic/step-2-ethnicity/arab/4558188a-87e0-42a3-b1e2-013fa7bc2313 (1).mp4",
    },
  ],
  "girls-anime": [
    {
      value: "caucasian",
      label: "Caucasian",
      imageSrc:
        "/images/create-character/girls/anime/step 2/Caucasian/79a9ec4e-b4ca-46c6-8de0-ee08e8477eeb.webp",
      videoSrc:
        "/images/create-character/girls/anime/step 2/Caucasian/7a0c3227-76c3-4d18-ac56-090bc2d2654f.mp4",
    },
    {
      value: "asian",
      label: "Asian",
      imageSrc:
        "/images/create-character/girls/anime/step 2/Asian/e1242dae-74ff-4799-9bdf-194ef3a3d15b.webp",
      videoSrc:
        "/images/create-character/girls/anime/step 2/Asian/33ba66f7-e71d-4d7a-b5ba-98065009f723.mp4",
    },
    {
      value: "latina",
      label: "Latina",
      imageSrc:
        "/images/create-character/girls/anime/step 2/Latina/4ca2bec0-4fbb-42ea-91dd-18094488bc18.webp",
      videoSrc:
        "/images/create-character/girls/anime/step 2/Latina/1d112cd8-de80-4bda-b49d-a2b1fda3c26f.mp4",
    },
  ],
  "trans-realistic": [
    {
      value: "caucasian",
      label: "Caucasian",
      imageSrc:
        "/images/create-character/trans/realistic/step 2 Ethnicity/Caucasian.png",
    },
    {
      value: "asian",
      label: "Asian",
      imageSrc:
        "/images/create-character/trans/realistic/step 2 Ethnicity/Asian.png",
    },
    {
      value: "latina",
      label: "Latina",
      imageSrc:
        "/images/create-character/trans/realistic/step 2 Ethnicity/Latina.png",
    },
  ],
};

const CreateCharacterStep2: React.FC<CreateCharacterStep2Props> = ({
  watch,
  setValue,
  errors,
  characterType,
  style,
}) => {
  const selectedEthnicity = watch("ethnicity");
  const age = watch("age") ?? 21;

  const variantKey = getVariantKey(
    characterType ?? "girls",
    style ?? "realistic",
  );
  const ethnicityOptions =
    ETHNICITY_OPTIONS[variantKey] || ETHNICITY_OPTIONS["girls-realistic"] || [];

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

export default CreateCharacterStep2;
