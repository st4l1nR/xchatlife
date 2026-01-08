import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ListCardCharacter from "@/app/_components/organisms/ListCardCharacter";
import type { CardCharacterProps } from "@/app/_components/molecules/CardCharacter";

const meta = {
  title: "Organisms/ListCardCharacter",
  component: ListCardCharacter,
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
} satisfies Meta<typeof ListCardCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";
const mockVideo = "/videos/girl-video.mp4";

const mockItems: CardCharacterProps[] = [
  {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
    isNew: true,
    description: "This K-pop idol needs a new manager to boost her career.",
  },
  {
    name: "Olivia",
    age: 28,
    href: "/characters/olivia",
    imageSrc: mockImage,
    isLive: true,
    playWithMeHref: "/play/olivia",
  },
  {
    name: "Sophie",
    age: 24,
    href: "/characters/sophie",
    imageSrc: mockImage,
    videoSrc: mockVideo,
  },
  {
    name: "Emma",
    age: 26,
    href: "/characters/emma",
    imageSrc: mockImage,
    isNew: true,
    isLive: true,
    playWithMeHref: "/play/emma",
    description: "A mysterious artist with a passion for the unknown.",
  },
  {
    name: "Mia",
    age: 21,
    href: "/characters/mia",
    imageSrc: mockImage,
    description: "A college student exploring the world.",
  },
  {
    name: "Luna",
    age: 25,
    href: "/characters/luna",
    imageSrc: mockImage,
    isNew: true,
    videoSrc: mockVideo,
  },
  {
    name: "Aria",
    age: 23,
    href: "/characters/aria",
    imageSrc: mockImage,
    isLive: true,
  },
  {
    name: "Zoe",
    age: 27,
    href: "/characters/zoe",
    imageSrc: mockImage,
    playWithMeHref: "/play/zoe",
    description: "An adventurous spirit who loves to travel.",
  },
];

// --- Stories ---

export const GridLayout: Story = {
  name: "Grid Layout (Default)",
  args: {
    layout: "grid",
    items: mockItems,
  },
};

export const RowLayout: Story = {
  name: "Row Layout (Horizontal Scroll)",
  args: {
    layout: "row",
    items: mockItems,
  },
};

export const SwiperLayout: Story = {
  args: {
    layout: "swiper",
    items: mockItems,
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
    emptyStateTitle: "No characters available",
    emptyStateDescription: "Check back later for new characters to explore.",
  },
};

export const FewItems: Story = {
  name: "Few Items (Grid)",
  args: {
    layout: "grid",
    items: mockItems.slice(0, 3),
  },
};

export const FewItemsRow: Story = {
  name: "Few Items (Row)",
  args: {
    layout: "row",
    items: mockItems.slice(0, 3),
  },
};

export const ManyItems: Story = {
  args: {
    layout: "grid",
    items: [...mockItems, ...mockItems],
  },
};
