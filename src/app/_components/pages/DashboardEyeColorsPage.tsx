"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardEyeColorsPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardEyeColorsPageProps = {
  className?: string;
  mock?: DashboardEyeColorsPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Brown",
  "Blue",
  "Green",
  "Hazel",
  "Gray",
]);

const DashboardEyeColorsPage: React.FC<DashboardEyeColorsPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.eyeColor}
    {...props}
  />
);

export default DashboardEyeColorsPage;
