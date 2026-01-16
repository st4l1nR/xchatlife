"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardOccupationsPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardOccupationsPageProps = {
  className?: string;
  mock?: DashboardOccupationsPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Student",
  "Teacher",
  "Nurse",
  "Office Worker",
  "Artist",
]);

const DashboardOccupationsPage: React.FC<DashboardOccupationsPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.occupation}
    {...props}
  />
);

export default DashboardOccupationsPage;
