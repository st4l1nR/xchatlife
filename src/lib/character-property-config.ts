import type { CharacterPropertyType } from "@/hooks/useCharacterPropertyQuery";

export type CharacterPropertyConfig = {
  propertyType: CharacterPropertyType;
  label: {
    singular: string;
    plural: string;
  };
  requiresGenderStyle: boolean;
  routerName: string;
};

export const CHARACTER_PROPERTY_CONFIGS: Record<
  CharacterPropertyType,
  CharacterPropertyConfig
> = {
  gender: {
    propertyType: "gender",
    label: { singular: "Gender", plural: "Genders" },
    requiresGenderStyle: false,
    routerName: "characterGender",
  },
  style: {
    propertyType: "style",
    label: { singular: "Style", plural: "Styles" },
    requiresGenderStyle: false,
    routerName: "characterStyle",
  },
  ethnicity: {
    propertyType: "ethnicity",
    label: { singular: "Ethnicity", plural: "Ethnicities" },
    requiresGenderStyle: true,
    routerName: "characterEthnicity",
  },
  personality: {
    propertyType: "personality",
    label: { singular: "Personality", plural: "Personalities" },
    requiresGenderStyle: true,
    routerName: "characterPersonality",
  },
  relationship: {
    propertyType: "relationship",
    label: { singular: "Relationship", plural: "Relationships" },
    requiresGenderStyle: true,
    routerName: "characterRelationship",
  },
  occupation: {
    propertyType: "occupation",
    label: { singular: "Occupation", plural: "Occupations" },
    requiresGenderStyle: true,
    routerName: "characterOccupation",
  },
  hairStyle: {
    propertyType: "hairStyle",
    label: { singular: "Hair Style", plural: "Hair Styles" },
    requiresGenderStyle: true,
    routerName: "characterHairStyle",
  },
  hairColor: {
    propertyType: "hairColor",
    label: { singular: "Hair Color", plural: "Hair Colors" },
    requiresGenderStyle: true,
    routerName: "characterHairColor",
  },
  eyeColor: {
    propertyType: "eyeColor",
    label: { singular: "Eye Color", plural: "Eye Colors" },
    requiresGenderStyle: true,
    routerName: "characterEyeColor",
  },
  bodyType: {
    propertyType: "bodyType",
    label: { singular: "Body Type", plural: "Body Types" },
    requiresGenderStyle: true,
    routerName: "characterBodyType",
  },
  breastSize: {
    propertyType: "breastSize",
    label: { singular: "Breast Size", plural: "Breast Sizes" },
    requiresGenderStyle: true,
    routerName: "characterBreastSize",
  },
};
