"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardRelationshipsPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardRelationshipsPageProps = {
  className?: string;
  mock?: DashboardRelationshipsPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Girlfriend",
  "Friend",
  "Stranger",
  "Crush",
  "Ex",
]);

const DashboardRelationshipsPage: React.FC<DashboardRelationshipsPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.relationship}
    {...props}
  />
);

export default DashboardRelationshipsPage;
