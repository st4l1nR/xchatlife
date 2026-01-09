"use client";

import React from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import CardSelectable from "../molecules/CardSelectable";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type CreateCharacterStep3Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  characterType: CharacterFormData["characterType"];
  style: CharacterFormData["style"];
};

// Helper to get variant key
const getVariantKey = (characterType: string, style: string) =>
  `${characterType}-${style}`;

// Base paths
const GIRLS_REALISTIC_BASE = "/images/create-character/girls/realistic/step-3";
const GIRLS_ANIME_BASE = "/images/create-character/girls/anime/step 3";

// Hair Style Options by variant
const HAIR_STYLE_OPTIONS: Record<
  string,
  {
    value: CharacterFormData["hairStyle"];
    label: string;
    imageSrc: string;
    videoSrc?: string;
  }[]
> = {
  "girls-realistic": [
    {
      value: "straight",
      label: "Straight",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-style/straight/de1d672d-1896-48b9-aa83-84df2bb514ef.png`,
      videoSrc: `${GIRLS_REALISTIC_BASE}/hair-style/straight/307bddcb-f017-4ddc-8f65-b611f250d529 (1).mp4`,
    },
    {
      value: "bangs",
      label: "Bangs",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-style/bangs/5540f73a-ff06-480f-9418-a9dba56da77e.png`,
      videoSrc: `${GIRLS_REALISTIC_BASE}/hair-style/bangs/832a3920-77c5-4041-9b04-0b4490d0545b (1).mp4`,
    },
    {
      value: "curly",
      label: "Curly",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-style/curly/b654873f-70b8-48a9-8326-c4323436de04.png`,
      videoSrc: `${GIRLS_REALISTIC_BASE}/hair-style/curly/22860e41-09c4-4326-b0bd-2e23a4e70dd8 (1).mp4`,
    },
    {
      value: "bun",
      label: "Bun",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-style/bun/6fec3766-e730-47f6-8495-ae2fba450c15.png`,
      videoSrc: `${GIRLS_REALISTIC_BASE}/hair-style/bun/5869df15-6371-46af-9013-05ae33f02f57 (1).mp4`,
    },
    {
      value: "short",
      label: "Short",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-style/short/e8edbf12-39d9-4f14-bed5-38fd67904f7c.png`,
      videoSrc: `${GIRLS_REALISTIC_BASE}/hair-style/short/55bce468-1b98-4281-a99b-59bf472c0e42 (1).mp4`,
    },
    {
      value: "ponytail",
      label: "Ponytail",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-style/ponytail/220259e7-08e7-40e2-9db2-ecdaf71b7349.png`,
      videoSrc: `${GIRLS_REALISTIC_BASE}/hair-style/ponytail/43954e0a-1ce8-443c-9ade-e5f641f85dd1 (1).mp4`,
    },
  ],
  "girls-anime": [
    {
      value: "straight",
      label: "Straight",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Style/Straight/44915b17-29fe-4e12-8be7-cacfcadd75f4.webp`,
      videoSrc: `${GIRLS_ANIME_BASE}/Hair Style/Straight/d8c37d81-db05-4785-99ae-b0454c00879e.mp4`,
    },
    {
      value: "bangs",
      label: "Bangs",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Style/Bangs/f85947a4-2062-461c-bbf9-9e1397ba5578.webp`,
      videoSrc: `${GIRLS_ANIME_BASE}/Hair Style/Bangs/ed97c631-bc23-465e-97f9-f08f309ca188.mp4`,
    },
    {
      value: "curly",
      label: "Curly",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Style/Curly/f034e303-8cd0-43f5-94a3-4df8c1e0cbec.webp`,
      videoSrc: `${GIRLS_ANIME_BASE}/Hair Style/Curly/81060c3c-ec6d-452b-a85f-bb30fdff6c2f.mp4`,
    },
    {
      value: "bun",
      label: "Bun",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Style/Bun/85e4d528-a190-4854-9cff-81def64d6700.webp`,
      videoSrc: `${GIRLS_ANIME_BASE}/Hair Style/Bun/82f6672d-f1bd-4d8b-88c9-789131cbd2ee.mp4`,
    },
    {
      value: "short",
      label: "Short",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Style/Short/99b1f311-d9d7-43e5-aa95-6c96c11e15be.webp`,
      videoSrc: `${GIRLS_ANIME_BASE}/Hair Style/Short/298083a1-6793-4804-849a-7838372b4e1c.mp4`,
    },
    {
      value: "ponytail",
      label: "Ponytail",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Style/Ponytail/b04dfc9a-fe02-4aae-a77d-9e7cc9dcace6.webp`,
      videoSrc: `${GIRLS_ANIME_BASE}/Hair Style/Ponytail/01aeaf81-7c31-4e67-8b46-64b0ab2b37a9.mp4`,
    },
  ],
  // Trans realistic reuses girls realistic
  "trans-realistic": [], // Will fallback to girls-realistic
};

// Hair Color Options by variant
const HAIR_COLOR_OPTIONS: Record<
  string,
  { value: CharacterFormData["hairColor"]; label: string; imageSrc: string }[]
> = {
  "girls-realistic": [
    {
      value: "brunette",
      label: "Brunette",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-color/Brunette.png`,
    },
    {
      value: "blonde",
      label: "Blonde",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-color/Blonde.png`,
    },
    {
      value: "black",
      label: "Black",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-color/Black.png`,
    },
    {
      value: "redhead",
      label: "Redhead",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-color/Redhead.png`,
    },
    {
      value: "pink",
      label: "Pink",
      imageSrc: `${GIRLS_REALISTIC_BASE}/hair-color/Pink.png`,
    },
  ],
  "girls-anime": [
    {
      value: "black",
      label: "Black",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Black.webp`,
    },
    {
      value: "blonde",
      label: "Blonde",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Blonde.webp`,
    },
    {
      value: "blue",
      label: "Blue",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Blue.webp`,
    },
    {
      value: "multicolor",
      label: "Multicolor",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Multicolor.webp`,
    },
    {
      value: "pink",
      label: "Pink",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Pink.webp`,
    },
    {
      value: "purple",
      label: "Purple",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Purple.webp`,
    },
    {
      value: "redhead",
      label: "Redhead",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/Redhead.webp`,
    },
    {
      value: "white",
      label: "White",
      imageSrc: `${GIRLS_ANIME_BASE}/Hair Color/White.webp`,
    },
  ],
  // Trans realistic reuses girls realistic
  "trans-realistic": [], // Will fallback to girls-realistic
};

// Eye Color Options by variant
const EYE_COLOR_OPTIONS: Record<
  string,
  { value: CharacterFormData["eyeColor"]; label: string; imageSrc: string }[]
> = {
  "girls-realistic": [
    {
      value: "brown",
      label: "Brown",
      imageSrc: `${GIRLS_REALISTIC_BASE}/eye-color/Brown.png`,
    },
    {
      value: "blue",
      label: "Blue",
      imageSrc: `${GIRLS_REALISTIC_BASE}/eye-color/Blue.png`,
    },
    {
      value: "green",
      label: "Green",
      imageSrc: `${GIRLS_REALISTIC_BASE}/eye-color/Green.png`,
    },
  ],
  "girls-anime": [
    {
      value: "brown",
      label: "Brown",
      imageSrc: `${GIRLS_ANIME_BASE}/Eye Color/Brown.webp`,
    },
    {
      value: "blue",
      label: "Blue",
      imageSrc: `${GIRLS_ANIME_BASE}/Eye Color/Blue.webp`,
    },
    {
      value: "green",
      label: "Green",
      imageSrc: `${GIRLS_ANIME_BASE}/Eye Color/Green.webp`,
    },
    {
      value: "red",
      label: "Red",
      imageSrc: `${GIRLS_ANIME_BASE}/Eye Color/Red.webp`,
    },
    {
      value: "yellow",
      label: "Yellow",
      imageSrc: `${GIRLS_ANIME_BASE}/Eye Color/Yellow.webp`,
    },
  ],
  // Trans realistic reuses girls realistic
  "trans-realistic": [], // Will fallback to girls-realistic
};

const CreateCharacterStep3: React.FC<CreateCharacterStep3Props> = ({
  watch,
  setValue,
  errors,
  characterType,
  style,
}) => {
  const selectedHairStyle = watch("hairStyle");
  const selectedHairColor = watch("hairColor");
  const selectedEyeColor = watch("eyeColor");

  const variantKey = getVariantKey(
    characterType ?? "girls",
    style ?? "realistic",
  );

  // Trans realistic reuses girls realistic options
  const effectiveVariantKey =
    variantKey === "trans-realistic" ? "girls-realistic" : variantKey;

  const hairStyleOptions =
    HAIR_STYLE_OPTIONS[effectiveVariantKey] ||
    HAIR_STYLE_OPTIONS["girls-realistic"] ||
    [];
  const hairColorOptions =
    HAIR_COLOR_OPTIONS[effectiveVariantKey] ||
    HAIR_COLOR_OPTIONS["girls-realistic"] ||
    [];
  const eyeColorOptions =
    EYE_COLOR_OPTIONS[effectiveVariantKey] ||
    EYE_COLOR_OPTIONS["girls-realistic"] ||
    [];

  return (
    <div className="flex flex-col items-center">
      {/* Hair Style Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
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
            onClick={() =>
              setValue("hairStyle", option.value, { shouldValidate: true })
            }
            aspectRatio="portrait"
            size="sm"
            className="w-24 sm:w-28"
          />
        ))}
      </div>

      {errors.hairStyle && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.hairStyle.message}
        </p>
      )}

      {/* Hair Color Section */}
      <h2 className="text-foreground mt-4 mb-6 text-2xl font-bold">
        Choose Hair Color
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {hairColorOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedHairColor === option.value}
            onClick={() =>
              setValue("hairColor", option.value, { shouldValidate: true })
            }
            aspectRatio="portrait"
            size="sm"
            className="w-24 sm:w-28"
          />
        ))}
      </div>

      {errors.hairColor && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.hairColor.message}
        </p>
      )}

      {/* Eye Color Section */}
      <h2 className="text-foreground mt-4 mb-6 text-2xl font-bold">
        Choose Eye Color
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {eyeColorOptions.map((option) => (
          <CardSelectable
            key={option.value}
            imageSrc={option.imageSrc}
            label={option.label}
            selected={selectedEyeColor === option.value}
            onClick={() =>
              setValue("eyeColor", option.value, { shouldValidate: true })
            }
            aspectRatio="landscape"
            size="md"
            className="w-32 sm:w-36"
          />
        ))}
      </div>

      {errors.eyeColor && (
        <p className="text-destructive mb-6 text-base/6 sm:text-sm/6">
          {errors.eyeColor.message}
        </p>
      )}
    </div>
  );
};

export default CreateCharacterStep3;
