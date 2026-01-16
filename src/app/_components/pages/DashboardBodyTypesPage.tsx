"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardBodyTypesPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardBodyTypesPageProps = {
  className?: string;
  mock?: DashboardBodyTypesPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Slim",
  "Athletic",
  "Curvy",
  "Petite",
  "Plus Size",
]);

const DashboardBodyTypesPage: React.FC<DashboardBodyTypesPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.bodyType}
    {...props}
  />
);

export default DashboardBodyTypesPage;
