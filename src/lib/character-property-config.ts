import type { CharacterPropertyType } from "@/server/api/routers/characterOptions";

export type CharacterPropertyConfig = {
  propertyType: CharacterPropertyType;
  label: {
    singular: string;
    plural: string;
  };
  requiresGenderStyle: boolean;
};

export const CHARACTER_PROPERTY_CONFIGS: Record<
  CharacterPropertyType,
  CharacterPropertyConfig
> = {
  gender: {
    propertyType: "gender",
    label: { singular: "Gender", plural: "Genders" },
    requiresGenderStyle: false,
  },
  style: {
    propertyType: "style",
    label: { singular: "Style", plural: "Styles" },
    requiresGenderStyle: false,
  },
  ethnicity: {
    propertyType: "ethnicity",
    label: { singular: "Ethnicity", plural: "Ethnicities" },
    requiresGenderStyle: true,
  },
  personality: {
    propertyType: "personality",
    label: { singular: "Personality", plural: "Personalities" },
    requiresGenderStyle: true,
  },
  relationship: {
    propertyType: "relationship",
    label: { singular: "Relationship", plural: "Relationships" },
    requiresGenderStyle: true,
  },
  occupation: {
    propertyType: "occupation",
    label: { singular: "Occupation", plural: "Occupations" },
    requiresGenderStyle: true,
  },
  hairStyle: {
    propertyType: "hairStyle",
    label: { singular: "Hair Style", plural: "Hair Styles" },
    requiresGenderStyle: true,
  },
  hairColor: {
    propertyType: "hairColor",
    label: { singular: "Hair Color", plural: "Hair Colors" },
    requiresGenderStyle: true,
  },
  eyeColor: {
    propertyType: "eyeColor",
    label: { singular: "Eye Color", plural: "Eye Colors" },
    requiresGenderStyle: true,
  },
  bodyType: {
    propertyType: "bodyType",
    label: { singular: "Body Type", plural: "Body Types" },
    requiresGenderStyle: true,
  },
  breastSize: {
    propertyType: "breastSize",
    label: { singular: "Breast Size", plural: "Breast Sizes" },
    requiresGenderStyle: true,
  },
};
