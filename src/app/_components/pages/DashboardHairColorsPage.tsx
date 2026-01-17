"use client";

import DashboardCharacterPropertyPage, {
  createDefaultMockData,
} from "./DashboardCharacterPropertyPage";
import type { DashboardCharacterPropertyPageMockData } from "./DashboardCharacterPropertyPage";
import { CHARACTER_PROPERTY_CONFIGS } from "@/lib/character-property-config";

export type DashboardHairColorsPageMockData =
  DashboardCharacterPropertyPageMockData;

export type DashboardHairColorsPageProps = {
  className?: string;
  mock?: DashboardHairColorsPageMockData;
};

export const defaultMockData = createDefaultMockData([
  { label: "Black", emoji: "🖤" },
  { label: "Brown", emoji: "🤎" },
  { label: "Blonde", emoji: "💛" },
  { label: "Red", emoji: "❤️" },
  { label: "Pink", emoji: "💗" },
]);

const DashboardHairColorsPage: React.FC<DashboardHairColorsPageProps> = (
  props,
) => (
  <DashboardCharacterPropertyPage
    config={CHARACTER_PROPERTY_CONFIGS.hairColor}
    {...props}
  />
);

export default DashboardHairColorsPage;
