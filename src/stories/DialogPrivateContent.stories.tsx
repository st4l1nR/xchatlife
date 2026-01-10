import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogPrivateContent from "@/app/_components/organisms/DialogPrivateContent";
import type { CardPrivateContentProps } from "@/app/_components/molecules/CardPrivateContent";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogPrivateContent",
  component: DialogPrivateContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
    loading: {
      control: "boolean",
      description: "Shows loading skeleton",
    },
  },
  args: {
    onClose: () => {},
  },
} satisfies Meta<typeof DialogPrivateContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

// Media items for gallery view
const mockMediaItems = [
  { id: "1", type: "image" as const, src: mockImage },
  { id: "2", type: "image" as const, src: mockImage },
  { id: "3", type: "video" as const, src: mockImage, thumbnailSrc: mockImage },
  { id: "4", type: "image" as const, src: mockImage },
  { id: "5", type: "image" as const, src: mockImage },
  { id: "6", type: "image" as const, src: mockImage },
];

const mockLockedItems: CardPrivateContentProps[] = [
  {
    imageSrc: mockImage,
    description: "Sextape & Anal in my dorm room",
    likeCount: 2,
    imageCount: 37,
    locked: true,
    tokenCost: 140,
    bottomLikeCount: 3800,
  },
  {
    imageSrc: mockImage,
    description: "Private photoshoot collection",
    likeCount: 8,
    imageCount: 18,
    locked: true,
    tokenCost: 150,
    bottomLikeCount: 1800,
  },
  {
    imageSrc: mockImage,
    description: "Special moments compilation",
    likeCount: 22,
    imageCount: 32,
    locked: true,
    tokenCost: 200,
    bottomLikeCount: 4200,
  },
];

const mockUnlockedItems: CardPrivateContentProps[] = [
  {
    imageSrc: mockImage,
    description: "Caught in the lockeroom",
    likeCount: 2,
    imageCount: 24,
    locked: false,
    bottomLikeCount: 3500,
    media: mockMediaItems,
  },
  {
    imageSrc: mockImage,
    description: "Beach day adventures",
    likeCount: 45,
    imageCount: 28,
    locked: false,
    bottomLikeCount: 5600,
    media: mockMediaItems,
  },
  {
    imageSrc: mockImage,
    description: "Morning routine vlog",
    likeCount: 32,
    imageCount: 15,
    locked: false,
    bottomLikeCount: 3400,
    media: mockMediaItems,
  },
];

const mockMixedItems: CardPrivateContentProps[] = [
  mockLockedItems[0]!,
  mockUnlockedItems[0]!,
  mockLockedItems[1]!,
  mockUnlockedItems[1]!,
  mockLockedItems[2]!,
  mockUnlockedItems[2]!,
];

// ============================================================================
// Default - Mixed Items
// ============================================================================
export const Default: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Private Content</Button>
        <DialogPrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          items={mockMixedItems}
        />
      </>
    );
  },
  args: {
    open: false,
    items: mockMixedItems,
  },
};

// ============================================================================
// All Locked Items
// ============================================================================
export const AllLocked: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Private Content</Button>
        <DialogPrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          items={mockLockedItems}
          onUnlock={(item, index) => {
            alert(
              `Unlock requested for item ${index + 1} (${item.tokenCost} tokens)`,
            );
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    items: mockLockedItems,
  },
};

// ============================================================================
// All Unlocked Items
// ============================================================================
export const AllUnlocked: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Private Content</Button>
        <DialogPrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          items={mockUnlockedItems}
        />
      </>
    );
  },
  args: {
    open: false,
    items: mockUnlockedItems,
  },
};

// ============================================================================
// Loading State
// ============================================================================
export const Loading: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Private Content</Button>
        <DialogPrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          items={[]}
          loading={true}
        />
      </>
    );
  },
  args: {
    open: false,
    items: [],
    loading: true,
  },
};

// ============================================================================
// Empty State
// ============================================================================
export const Empty: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Private Content</Button>
        <DialogPrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          items={[]}
        />
      </>
    );
  },
  args: {
    open: false,
    items: [],
  },
};

// ============================================================================
// Interactive - Full Flow Demo
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Click the button to open the dialog. Click on an unlocked item to view
          the gallery. Use the back button to return to the list.
        </p>

        <Button onClick={() => setIsOpen(true)}>Open Private Content</Button>

        <DialogPrivateContent
          open={isOpen}
          onClose={() => setIsOpen(false)}
          items={mockMixedItems}
          onUnlock={(item, index) => {
            alert(
              `Unlock requested for item ${index + 1} (${item.tokenCost} tokens)`,
            );
          }}
        />
      </div>
    );
  },
  args: {
    open: false,
    items: mockMixedItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing the full private content flow. Click on unlocked items to view the gallery.",
      },
    },
  },
};
