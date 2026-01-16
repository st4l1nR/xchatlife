"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardHairStylesPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardHairStylesPageProps = {
  className?: string;
  mock?: DashboardHairStylesPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Long",
  "Short",
  "Curly",
  "Straight",
  "Wavy",
]);

const DashboardHairStylesPage: React.FC<DashboardHairStylesPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.hairStyle}
    {...props}
  />
);

export default DashboardHairStylesPage;
