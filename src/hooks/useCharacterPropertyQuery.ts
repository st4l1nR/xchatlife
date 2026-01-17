import { api } from "@/trpc/react";

export type CharacterPropertyType =
  | "gender"
  | "style"
  | "ethnicity"
  | "personality"
  | "relationship"
  | "occupation"
  | "hairStyle"
  | "hairColor"
  | "eyeColor"
  | "bodyType"
  | "breastSize";

/**
 * Generic hook to fetch character properties based on type
 */
export function useCharacterPropertyQuery(
  propertyType: CharacterPropertyType,
  enabled = true,
) {
  const genders = api.characterGender.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "gender",
  });
  const styles = api.characterStyle.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "style",
  });
  const ethnicities = api.characterEthnicity.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "ethnicity",
  });
  const personalities = api.characterPersonality.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "personality",
  });
  const relationships = api.characterRelationship.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "relationship",
  });
  const occupations = api.characterOccupation.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "occupation",
  });
  const hairStyles = api.characterHairStyle.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "hairStyle",
  });
  const hairColors = api.characterHairColor.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "hairColor",
  });
  const eyeColors = api.characterEyeColor.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "eyeColor",
  });
  const bodyTypes = api.characterBodyType.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "bodyType",
  });
  const breastSizes = api.characterBreastSize.getAll.useQuery(undefined, {
    enabled: enabled && propertyType === "breastSize",
  });

  const queryMap = {
    gender: genders,
    style: styles,
    ethnicity: ethnicities,
    personality: personalities,
    relationship: relationships,
    occupation: occupations,
    hairStyle: hairStyles,
    hairColor: hairColors,
    eyeColor: eyeColors,
    bodyType: bodyTypes,
    breastSize: breastSizes,
  };

  return queryMap[propertyType];
}

/**
 * Generic hook to reorder character properties based on type
 */
export function useCharacterPropertyReorder(
  propertyType: CharacterPropertyType,
) {
  const utils = api.useUtils();

  const reorderGenders = api.characterGender.reorder.useMutation({
    onSuccess: () => void utils.characterGender.invalidate(),
  });
  const reorderStyles = api.characterStyle.reorder.useMutation({
    onSuccess: () => void utils.characterStyle.invalidate(),
  });
  const reorderEthnicities = api.characterEthnicity.reorder.useMutation({
    onSuccess: () => void utils.characterEthnicity.invalidate(),
  });
  const reorderPersonalities = api.characterPersonality.reorder.useMutation({
    onSuccess: () => void utils.characterPersonality.invalidate(),
  });
  const reorderRelationships = api.characterRelationship.reorder.useMutation({
    onSuccess: () => void utils.characterRelationship.invalidate(),
  });
  const reorderOccupations = api.characterOccupation.reorder.useMutation({
    onSuccess: () => void utils.characterOccupation.invalidate(),
  });
  const reorderHairStyles = api.characterHairStyle.reorder.useMutation({
    onSuccess: () => void utils.characterHairStyle.invalidate(),
  });
  const reorderHairColors = api.characterHairColor.reorder.useMutation({
    onSuccess: () => void utils.characterHairColor.invalidate(),
  });
  const reorderEyeColors = api.characterEyeColor.reorder.useMutation({
    onSuccess: () => void utils.characterEyeColor.invalidate(),
  });
  const reorderBodyTypes = api.characterBodyType.reorder.useMutation({
    onSuccess: () => void utils.characterBodyType.invalidate(),
  });
  const reorderBreastSizes = api.characterBreastSize.reorder.useMutation({
    onSuccess: () => void utils.characterBreastSize.invalidate(),
  });

  const mutationMap = {
    gender: reorderGenders,
    style: reorderStyles,
    ethnicity: reorderEthnicities,
    personality: reorderPersonalities,
    relationship: reorderRelationships,
    occupation: reorderOccupations,
    hairStyle: reorderHairStyles,
    hairColor: reorderHairColors,
    eyeColor: reorderEyeColors,
    bodyType: reorderBodyTypes,
    breastSize: reorderBreastSizes,
  };

  return mutationMap[propertyType];
}
