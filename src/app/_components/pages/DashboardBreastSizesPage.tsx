"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardBreastSizesPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardBreastSizesPageProps = {
  className?: string;
  mock?: DashboardBreastSizesPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Small",
  "Medium",
  "Large",
  "Extra Large",
]);

const DashboardBreastSizesPage: React.FC<DashboardBreastSizesPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.breastSize}
    {...props}
  />
);

export default DashboardBreastSizesPage;
