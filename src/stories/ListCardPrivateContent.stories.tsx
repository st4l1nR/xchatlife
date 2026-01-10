import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ListCardPrivateContent from "@/app/_components/organisms/ListCardPrivateContent";
import type { CardPrivateContentProps } from "@/app/_components/molecules/CardPrivateContent";

const meta = {
  title: "Organisms/ListCardPrivateContent",
  component: ListCardPrivateContent,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "radio",
      options: ["grid", "row", "swiper"],
      description: "Layout variant",
    },
    loading: {
      control: "boolean",
      description: "Shows loading skeleton",
    },
    emptyStateTitle: {
      control: "text",
      description: "Title for empty state",
    },
    emptyStateDescription: {
      control: "text",
      description: "Description for empty state",
    },
  },
} satisfies Meta<typeof ListCardPrivateContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

const mockLockedItems: CardPrivateContentProps[] = [
  {
    imageSrc: mockImage,
    description: "Exclusive behind the scenes content",
    likeCount: 15,
    imageCount: 24,
    locked: true,
    tokenCost: 100,
    bottomLikeCount: 2500,
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
  {
    imageSrc: mockImage,
    description: "Intimate diary entries",
    likeCount: 5,
    imageCount: 12,
    locked: true,
    tokenCost: 75,
    bottomLikeCount: 980,
  },
];

const mockUnlockedItems: CardPrivateContentProps[] = [
  {
    imageSrc: mockImage,
    description: "Beach day adventures",
    likeCount: 45,
    imageCount: 28,
    locked: false,
    bottomLikeCount: 5600,
  },
  {
    imageSrc: mockImage,
    description: "Morning routine vlog",
    likeCount: 32,
    imageCount: 15,
    locked: false,
    bottomLikeCount: 3400,
  },
  {
    imageSrc: mockImage,
    description: "City exploration highlights",
    likeCount: 28,
    imageCount: 22,
    locked: false,
    bottomLikeCount: 2900,
  },
  {
    imageSrc: mockImage,
    description: "Sunset photoshoot",
    likeCount: 55,
    imageCount: 35,
    locked: false,
    bottomLikeCount: 7200,
  },
];

const mockMixedItems: CardPrivateContentProps[] = [
  mockLockedItems[0]!,
  mockUnlockedItems[0]!,
  mockLockedItems[1]!,
  mockUnlockedItems[1]!,
  mockLockedItems[2]!,
  mockUnlockedItems[2]!,
  mockLockedItems[3]!,
  mockUnlockedItems[3]!,
];

// --- Stories ---

export const GridLayout: Story = {
  name: "Grid Layout (Default)",
  args: {
    layout: "grid",
    items: mockMixedItems,
  },
};

export const RowLayout: Story = {
  name: "Row Layout (Horizontal Scroll)",
  args: {
    layout: "row",
    items: mockMixedItems,
  },
};

export const SwiperLayout: Story = {
  args: {
    layout: "swiper",
    items: mockMixedItems,
  },
};

export const Loading: Story = {
  name: "Loading State",
  args: {
    layout: "grid",
    loading: true,
    items: [],
  },
};

export const LoadingRow: Story = {
  name: "Loading State (Row)",
  args: {
    layout: "row",
    loading: true,
    items: [],
  },
};

export const LoadingSwiper: Story = {
  name: "Loading State (Swiper)",
  args: {
    layout: "swiper",
    loading: true,
    items: [],
  },
};

export const Empty: Story = {
  name: "Empty State",
  args: {
    layout: "grid",
    items: [],
    emptyStateTitle: "No private content available",
    emptyStateDescription:
      "Check back later for exclusive content from your favorite creators.",
  },
};

export const AllLocked: Story = {
  name: "All Locked Items",
  args: {
    layout: "grid",
    items: mockLockedItems,
  },
};

export const AllUnlocked: Story = {
  name: "All Unlocked Items",
  args: {
    layout: "grid",
    items: mockUnlockedItems,
  },
};

export const FewItems: Story = {
  name: "Few Items (Grid)",
  args: {
    layout: "grid",
    items: mockMixedItems.slice(0, 3),
  },
};

export const FewItemsRow: Story = {
  name: "Few Items (Row)",
  args: {
    layout: "row",
    items: mockMixedItems.slice(0, 3),
  },
};

export const ManyItems: Story = {
  args: {
    layout: "grid",
    items: [...mockMixedItems, ...mockMixedItems],
  },
};

export const WithCallbacks: Story = {
  name: "With Click Handlers",
  args: {
    layout: "grid",
    items: mockMixedItems.slice(0, 4),
    onItemClick: (item, index) => {
      alert(`Clicked item ${index + 1}: ${item.description}`);
    },
    onUnlock: (item, index) => {
      alert(
        `Unlock requested for item ${index + 1} (${item.tokenCost} tokens)`,
      );
    },
  },
};
