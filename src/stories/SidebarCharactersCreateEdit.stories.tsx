import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TabGroup } from "@headlessui/react";
import SidebarCharactersCreateEdit from "@/app/_components/organisms/SidebarCharactersCreateEdit";

const meta: Meta<typeof SidebarCharactersCreateEdit> = {
  title: "Organisms/SidebarCharactersCreateEdit",
  component: SidebarCharactersCreateEdit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background w-64 rounded-lg border border-border p-4">
        <TabGroup vertical>
          <Story />
        </TabGroup>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarCharactersCreateEdit>;

// ============================================================================
// Default - Profile tab selected
// ============================================================================
export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="bg-background w-64 rounded-lg border border-border p-4">
        <TabGroup vertical defaultIndex={0}>
          <Story />
        </TabGroup>
      </div>
    ),
  ],
};

// ============================================================================
// Reels Selected
// ============================================================================
export const ReelsSelected: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="bg-background w-64 rounded-lg border border-border p-4">
        <TabGroup vertical defaultIndex={1}>
          <Story />
        </TabGroup>
      </div>
    ),
  ],
};

// ============================================================================
// Stories Selected
// ============================================================================
export const StoriesSelected: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="bg-background w-64 rounded-lg border border-border p-4">
        <TabGroup vertical defaultIndex={2}>
          <Story />
        </TabGroup>
      </div>
    ),
  ],
};

// ============================================================================
// Private Content Selected
// ============================================================================
export const PrivateContentSelected: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="bg-background w-64 rounded-lg border border-border p-4">
        <TabGroup vertical defaultIndex={3}>
          <Story />
        </TabGroup>
      </div>
    ),
  ],
};

// ============================================================================
// Interactive - Controlled component demo
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
      <TabGroup vertical selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <SidebarCharactersCreateEdit />
      </TabGroup>
    );
  },
  decorators: [
    (Story) => (
      <div className="bg-background w-64 rounded-lg border border-border p-4">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background w-full rounded-lg border border-border p-4">
        <TabGroup vertical defaultIndex={0}>
          <Story />
        </TabGroup>
      </div>
    ),
  ],
};
