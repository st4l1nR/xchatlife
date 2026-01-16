"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardPersonalitiesPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardPersonalitiesPageProps = {
  className?: string;
  mock?: DashboardPersonalitiesPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Shy",
  "Confident",
  "Playful",
  "Mysterious",
  "Caring",
]);

const DashboardPersonalitiesPage: React.FC<DashboardPersonalitiesPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.personality}
    {...props}
  />
);

export default DashboardPersonalitiesPage;
