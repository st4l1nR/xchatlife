import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ListBubbleStory from "@/app/_components/organisms/ListBubbleStory";
import type { BubbleStoryProps } from "@/app/_components/molecules/BubbleStory";

const meta = {
  title: "Organisms/ListBubbleStory",
  component: ListBubbleStory,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Shows loading skeleton when true",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant applied to all items",
    },
    emptyStateTitle: {
      control: "text",
      description: "Title shown when no items",
    },
    emptyStateDescription: {
      control: "text",
      description: "Description shown when no items",
    },
  },
} satisfies Meta<typeof ListBubbleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

const mockItems: BubbleStoryProps[] = [
  { name: "Hanna", src: mockImage, href: "/stories/hanna", isRead: false },
  { name: "Chérie", src: mockImage, href: "/stories/cherie", isRead: true },
  { name: "Sophie", src: mockImage, href: "/stories/sophie", isRead: false },
  { name: "Emma", src: mockImage, href: "/stories/emma", isRead: true },
  { name: "Olivia", src: mockImage, href: "/stories/olivia", isRead: true },
  { name: "Lina", src: mockImage, href: "/stories/lina", isRead: false },
];

const manyItems: BubbleStoryProps[] = [
  { name: "Hanna", src: mockImage, href: "/stories/1", isRead: false },
  { name: "Chérie", src: mockImage, href: "/stories/2", isRead: true },
  { name: "Sophie", src: mockImage, href: "/stories/3", isRead: false },
  { name: "Emma", src: mockImage, href: "/stories/4", isRead: true },
  { name: "Olivia", src: mockImage, href: "/stories/5", isRead: false },
  { name: "Lina", src: mockImage, href: "/stories/6", isRead: true },
  { name: "Mia", src: mockImage, href: "/stories/7", isRead: false },
  { name: "Ava", src: mockImage, href: "/stories/8", isRead: true },
  { name: "Luna", src: mockImage, href: "/stories/9", isRead: false },
  { name: "Zoe", src: mockImage, href: "/stories/10", isRead: true },
  { name: "Lily", src: mockImage, href: "/stories/11", isRead: false },
  { name: "Aria", src: mockImage, href: "/stories/12", isRead: true },
];

// --- Stories ---

export const Default: Story = {
  args: {
    items: mockItems,
  },
};

export const Loading: Story = {
  name: "Loading State",
  args: {
    items: [],
    loading: true,
  },
};

export const Empty: Story = {
  name: "Empty State",
  args: {
    items: [],
    loading: false,
  },
};

export const EmptyCustomMessage: Story = {
  name: "Empty with Custom Message",
  args: {
    items: [],
    loading: false,
    emptyStateTitle: "No new stories",
    emptyStateDescription:
      "Check back later for new stories from your friends.",
  },
};

export const AllUnread: Story = {
  name: "All Unread",
  args: {
    items: mockItems.map((item) => ({ ...item, isRead: false })),
  },
};

export const AllRead: Story = {
  name: "All Read",
  args: {
    items: mockItems.map((item) => ({ ...item, isRead: true })),
  },
};

export const SmallSize: Story = {
  name: "Small Size",
  args: {
    items: mockItems,
    size: "sm",
  },
};

export const MediumSize: Story = {
  name: "Medium Size (Default)",
  args: {
    items: mockItems,
    size: "md",
  },
};

export const LargeSize: Story = {
  name: "Large Size",
  args: {
    items: mockItems,
    size: "lg",
  },
};

export const ManyItems: Story = {
  name: "Many Items (Scrollable)",
  args: {
    items: manyItems,
  },
};

export const AllSizes: Story = {
  name: "All Sizes Comparison",
  args: {
    items: mockItems,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Small
        </h3>
        <ListBubbleStory items={mockItems} size="sm" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Medium (Default)
        </h3>
        <ListBubbleStory items={mockItems} size="md" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Large
        </h3>
        <ListBubbleStory items={mockItems} size="lg" />
      </div>
    </div>
  ),
};

export const LoadingSizes: Story = {
  name: "Loading Skeletons (All Sizes)",
  args: {
    items: [],
    loading: true,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Small
        </h3>
        <ListBubbleStory items={[]} loading={true} size="sm" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Medium
        </h3>
        <ListBubbleStory items={[]} loading={true} size="md" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Large
        </h3>
        <ListBubbleStory items={[]} loading={true} size="lg" />
      </div>
    </div>
  ),
};
