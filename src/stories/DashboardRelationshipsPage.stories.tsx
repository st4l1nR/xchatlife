import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import DashboardRelationshipsPage, {
  defaultMockData,
} from "@/app/_components/pages/DashboardRelationshipsPage";
import type { PropertyItem } from "@/app/_components/organisms/ListCardProperty";

const meta = {
  title: "Pages/DashboardRelationshipsPage",
  component: DashboardRelationshipsPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/dashboard/relationships" },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardRelationshipsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to generate many items
const generateManyItems = (count: number): PropertyItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    src: "/images/girl-poster.webp",
    alt: `Relationship ${i + 1}`,
    mediaType: "image" as const,
    sortOrder: i,
  }));

// Interactive wrapper for drag-and-drop and dialog testing
const InteractiveWrapper = () => {
  const [items, setItems] = useState(defaultMockData.items);

  return <DashboardRelationshipsPage mock={{ items }} />;
};

export const Default: Story = {
  args: { mock: defaultMockData },
};

export const Mobile: Story = {
  args: { mock: defaultMockData },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Tablet: Story = {
  args: { mock: defaultMockData },
  parameters: { viewport: { defaultViewport: "tablet" } },
};

export const Empty: Story = {
  args: { mock: { items: [] } },
};

export const ManyItems: Story = {
  args: {
    mock: { items: generateManyItems(20) },
  },
};

export const Interactive: Story = {
  render: () => <InteractiveWrapper />,
};
