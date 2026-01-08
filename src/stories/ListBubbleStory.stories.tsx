import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ListBubbleStory from "@/app/_components/organisms/ListBubbleStory";

type StoryMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  duration?: number;
};

type StoryProfile = {
  id: string;
  name: string;
  avatarSrc?: string;
  timestamp?: string;
  media: StoryMedia[];
};

const meta = {
  title: "Organisms/ListBubbleStory",
  component: ListBubbleStory,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "radio",
      options: ["row", "swiper"],
      description: "Layout variant",
    },
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
const mockVideo = "/videos/girl-video.mp4";

const mockProfiles: StoryProfile[] = [
  {
    id: "1",
    name: "Hanna",
    avatarSrc: mockImage,
    timestamp: "2 hours ago",
    media: [
      { id: "1-1", type: "image", src: mockImage, duration: 3 },
      { id: "1-2", type: "video", src: mockVideo },
    ],
  },
  {
    id: "2",
    name: "Chérie",
    avatarSrc: mockImage,
    timestamp: "5 hours ago",
    media: [{ id: "2-1", type: "image", src: mockImage, duration: 3 }],
  },
  {
    id: "3",
    name: "Sophie",
    avatarSrc: mockImage,
    timestamp: "8 hours ago",
    media: [
      { id: "3-1", type: "video", src: mockVideo },
      { id: "3-2", type: "image", src: mockImage, duration: 3 },
    ],
  },
  {
    id: "4",
    name: "Emma",
    avatarSrc: mockImage,
    timestamp: "12 hours ago",
    media: [{ id: "4-1", type: "image", src: mockImage, duration: 3 }],
  },
  {
    id: "5",
    name: "Olivia",
    avatarSrc: mockImage,
    timestamp: "1 day ago",
    media: [{ id: "5-1", type: "video", src: mockVideo }],
  },
  {
    id: "6",
    name: "Lina",
    avatarSrc: mockImage,
    timestamp: "2 days ago",
    media: [
      { id: "6-1", type: "image", src: mockImage, duration: 3 },
      { id: "6-2", type: "image", src: mockImage, duration: 3 },
      { id: "6-3", type: "video", src: mockVideo },
    ],
  },
];

const manyProfiles: StoryProfile[] = [
  ...mockProfiles,
  {
    id: "7",
    name: "Mia",
    avatarSrc: mockImage,
    timestamp: "3 days ago",
    media: [{ id: "7-1", type: "image", src: mockImage, duration: 3 }],
  },
  {
    id: "8",
    name: "Ava",
    avatarSrc: mockImage,
    timestamp: "4 days ago",
    media: [{ id: "8-1", type: "video", src: mockVideo }],
  },
  {
    id: "9",
    name: "Luna",
    avatarSrc: mockImage,
    timestamp: "5 days ago",
    media: [{ id: "9-1", type: "image", src: mockImage, duration: 3 }],
  },
  {
    id: "10",
    name: "Zoe",
    avatarSrc: mockImage,
    timestamp: "1 week ago",
    media: [{ id: "10-1", type: "image", src: mockImage, duration: 3 }],
  },
  {
    id: "11",
    name: "Lily",
    avatarSrc: mockImage,
    timestamp: "1 week ago",
    media: [{ id: "11-1", type: "video", src: mockVideo }],
  },
  {
    id: "12",
    name: "Aria",
    avatarSrc: mockImage,
    timestamp: "2 weeks ago",
    media: [{ id: "12-1", type: "image", src: mockImage, duration: 3 }],
  },
];

// --- Stories ---

export const Default: Story = {
  name: "Row Layout (Default)",
  args: {
    layout: "row",
    profiles: mockProfiles,
  },
};

export const SwiperLayout: Story = {
  args: {
    layout: "swiper",
    profiles: mockProfiles,
  },
};

export const Loading: Story = {
  name: "Loading State (Row)",
  args: {
    layout: "row",
    profiles: [],
    loading: true,
  },
};

export const LoadingSwiper: Story = {
  name: "Loading State (Swiper)",
  args: {
    layout: "swiper",
    profiles: [],
    loading: true,
  },
};

export const Empty: Story = {
  name: "Empty State",
  args: {
    profiles: [],
    loading: false,
  },
};

export const EmptyCustomMessage: Story = {
  name: "Empty with Custom Message",
  args: {
    profiles: [],
    loading: false,
    emptyStateTitle: "No new stories",
    emptyStateDescription:
      "Check back later for new stories from your friends.",
  },
};

export const SmallSize: Story = {
  args: {
    profiles: mockProfiles,
    size: "sm",
  },
};

export const MediumSize: Story = {
  name: "Medium Size (Default)",
  args: {
    profiles: mockProfiles,
    size: "md",
  },
};

export const LargeSize: Story = {
  args: {
    profiles: mockProfiles,
    size: "lg",
  },
};

export const ManyItems: Story = {
  name: "Many Items (Scrollable)",
  args: {
    profiles: manyProfiles,
  },
};

export const AllSizes: Story = {
  name: "All Sizes Comparison",
  args: {
    profiles: mockProfiles,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Small
        </h3>
        <ListBubbleStory profiles={mockProfiles} size="sm" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Medium (Default)
        </h3>
        <ListBubbleStory profiles={mockProfiles} size="md" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Large
        </h3>
        <ListBubbleStory profiles={mockProfiles} size="lg" />
      </div>
    </div>
  ),
};

export const LoadingSizes: Story = {
  name: "Loading Skeletons (All Sizes)",
  args: {
    profiles: [],
    loading: true,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Small
        </h3>
        <ListBubbleStory profiles={[]} loading={true} size="sm" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Medium
        </h3>
        <ListBubbleStory profiles={[]} loading={true} size="md" />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Large
        </h3>
        <ListBubbleStory profiles={[]} loading={true} size="lg" />
      </div>
    </div>
  ),
};

export const SingleProfile: Story = {
  args: {
    profiles: [
      {
        id: "1",
        name: "Hanna",
        avatarSrc: mockImage,
        timestamp: "just now",
        media: [
          { id: "1-1", type: "image", src: mockImage, duration: 3 },
          { id: "1-2", type: "video", src: mockVideo },
        ],
      },
    ],
  },
};

export const VideoOnlyProfiles: Story = {
  args: {
    profiles: [
      {
        id: "1",
        name: "Hanna",
        avatarSrc: mockImage,
        timestamp: "1 hour ago",
        media: [{ id: "1-1", type: "video", src: mockVideo }],
      },
      {
        id: "2",
        name: "Sophie",
        avatarSrc: mockImage,
        timestamp: "3 hours ago",
        media: [{ id: "2-1", type: "video", src: mockVideo }],
      },
    ],
  },
};
