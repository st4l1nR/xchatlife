"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardGendersPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardGendersPageProps = {
  className?: string;
  mock?: DashboardGendersPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Female",
  "Male",
  "Trans",
  "Non-binary",
]);

const DashboardGendersPage: React.FC<DashboardGendersPageProps> = (props) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.gender}
    {...props}
  />
);

export default DashboardGendersPage;
