"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardEthnicitiesPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardEthnicitiesPageProps = {
  className?: string;
  mock?: DashboardEthnicitiesPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Asian",
  "Black",
  "Hispanic",
  "White",
  "Mixed",
]);

const DashboardEthnicitiesPage: React.FC<DashboardEthnicitiesPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.ethnicity}
    {...props}
  />
);

export default DashboardEthnicitiesPage;
