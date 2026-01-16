import { api } from "@/trpc/react";
import type { CharacterPropertyType } from "@/server/api/routers/characterOptions";

/**
 * Generic hook to fetch character properties based on type
 */
export function useCharacterPropertyQuery(
  propertyType: CharacterPropertyType,
  enabled = true,
) {
  const genders = api.characterOptions.getGenders.useQuery(undefined, {
    enabled: enabled && propertyType === "gender",
  });
  const styles = api.characterOptions.getStyles.useQuery(undefined, {
    enabled: enabled && propertyType === "style",
  });
  const ethnicities = api.characterOptions.getEthnicities.useQuery(undefined, {
    enabled: enabled && propertyType === "ethnicity",
  });
  const personalities = api.characterOptions.getPersonalities.useQuery(
    undefined,
    {
      enabled: enabled && propertyType === "personality",
    },
  );
  const relationships = api.characterOptions.getRelationships.useQuery(
    undefined,
    {
      enabled: enabled && propertyType === "relationship",
    },
  );
  const occupations = api.characterOptions.getOccupations.useQuery(undefined, {
    enabled: enabled && propertyType === "occupation",
  });
  const hairStyles = api.characterOptions.getHairStyles.useQuery(undefined, {
    enabled: enabled && propertyType === "hairStyle",
  });
  const hairColors = api.characterOptions.getHairColors.useQuery(undefined, {
    enabled: enabled && propertyType === "hairColor",
  });
  const eyeColors = api.characterOptions.getEyeColors.useQuery(undefined, {
    enabled: enabled && propertyType === "eyeColor",
  });
  const bodyTypes = api.characterOptions.getBodyTypes.useQuery(undefined, {
    enabled: enabled && propertyType === "bodyType",
  });
  const breastSizes = api.characterOptions.getBreastSizes.useQuery(undefined, {
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

  const reorderGenders = api.characterOptions.reorderGenders.useMutation({
    onSuccess: () => void utils.characterOptions.invalidate(),
  });
  const reorderStyles = api.characterOptions.reorderStyles.useMutation({
    onSuccess: () => void utils.characterOptions.invalidate(),
  });
  const reorderEthnicities =
    api.characterOptions.reorderEthnicities.useMutation({
      onSuccess: () => void utils.characterOptions.invalidate(),
    });
  const reorderPersonalities =
    api.characterOptions.reorderPersonalities.useMutation({
      onSuccess: () => void utils.characterOptions.invalidate(),
    });
  const reorderRelationships =
    api.characterOptions.reorderRelationships.useMutation({
      onSuccess: () => void utils.characterOptions.invalidate(),
    });
  const reorderOccupations =
    api.characterOptions.reorderOccupations.useMutation({
      onSuccess: () => void utils.characterOptions.invalidate(),
    });
  const reorderHairStyles = api.characterOptions.reorderHairStyles.useMutation({
    onSuccess: () => void utils.characterOptions.invalidate(),
  });
  const reorderHairColors = api.characterOptions.reorderHairColors.useMutation({
    onSuccess: () => void utils.characterOptions.invalidate(),
  });
  const reorderEyeColors = api.characterOptions.reorderEyeColors.useMutation({
    onSuccess: () => void utils.characterOptions.invalidate(),
  });
  const reorderBodyTypes = api.characterOptions.reorderBodyTypes.useMutation({
    onSuccess: () => void utils.characterOptions.invalidate(),
  });
  const reorderBreastSizes =
    api.characterOptions.reorderBreastSizes.useMutation({
      onSuccess: () => void utils.characterOptions.invalidate(),
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
