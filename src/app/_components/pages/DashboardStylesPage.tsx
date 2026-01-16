"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardStylesPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardStylesPageProps = {
  className?: string;
  mock?: DashboardStylesPageMockData;
};

export const defaultMockData = createDefaultMockData([
  "Realistic",
  "Anime",
  "Semi-Realistic",
  "Cartoon",
]);

const DashboardStylesPage: React.FC<DashboardStylesPageProps> = (props) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.style}
    {...props}
  />
);

export default DashboardStylesPage;
