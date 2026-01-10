import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GalleryPrivateContent from "@/app/_components/organisms/GalleryPrivateContent";
import type { GalleryMediaItem } from "@/app/_components/organisms/GalleryPrivateContent";

const meta = {
  title: "Organisms/GalleryPrivateContent",
  component: GalleryPrivateContent,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background h-[600px] p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: {
      control: "object",
      description: "Array of media items to display in the gallery",
    },
    initialIndex: {
      control: "number",
      description: "Initial selected item index",
    },
    onItemChange: {
      action: "itemChanged",
      description: "Callback when selected item changes",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof GalleryPrivateContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";
const mockVideo = "/videos/girl-video.mp4";

// Generate mock items for stories
const generateMockItems = (
  count: number,
  includeVideos = false,
): GalleryMediaItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    type: includeVideos && (i + 1) % 3 === 0 ? "video" : "image",
    src: includeVideos && (i + 1) % 3 === 0 ? mockVideo : mockImage,
    thumbnailSrc: mockImage,
    alt: `Gallery item ${i + 1}`,
  })) as GalleryMediaItem[];
};

// --- Stories ---

export const Default: Story = {
  args: {
    items: generateMockItems(6),
  },
};

export const WithVideos: Story = {
  name: "With Videos",
  args: {
    items: generateMockItems(9, true),
  },
};

export const SingleItem: Story = {
  name: "Single Item",
  args: {
    items: generateMockItems(1),
  },
};

export const TwoItems: Story = {
  name: "Two Items",
  args: {
    items: generateMockItems(2),
  },
};

export const ManyItems: Story = {
  name: "Many Items (Scrollable)",
  args: {
    items: generateMockItems(20),
  },
};

export const WithInitialIndex: Story = {
  name: "Start at Index 3",
  args: {
    items: generateMockItems(8),
    initialIndex: 3,
  },
};

export const VideoSelected: Story = {
  name: "Video Selected",
  args: {
    items: [
      { id: "1", type: "image", src: mockImage, alt: "Image 1" },
      { id: "2", type: "image", src: mockImage, alt: "Image 2" },
      {
        id: "3",
        type: "video",
        src: mockVideo,
        thumbnailSrc: mockImage,
        alt: "Video 1",
      },
      { id: "4", type: "image", src: mockImage, alt: "Image 3" },
      {
        id: "5",
        type: "video",
        src: mockVideo,
        thumbnailSrc: mockImage,
        alt: "Video 2",
      },
      { id: "6", type: "image", src: mockImage, alt: "Image 4" },
    ] as GalleryMediaItem[],
    initialIndex: 2, // Start on the video
  },
};

export const Empty: Story = {
  name: "Empty State",
  args: {
    items: [],
  },
};

export const AllVariants: Story = {
  name: "All Variants Overview",
  args: {
    items: generateMockItems(6),
  },
  render: () => (
    <div className="space-y-8">
      {/* Default */}
      <div>
        <h3 className="text-foreground mb-2 text-sm font-medium">
          Default (Images Only)
        </h3>
        <div className="border-border h-[400px] rounded-lg border">
          <GalleryPrivateContent items={generateMockItems(6)} />
        </div>
      </div>

      {/* With Videos */}
      <div>
        <h3 className="text-foreground mb-2 text-sm font-medium">
          With Videos (Play Indicator)
        </h3>
        <div className="border-border h-[400px] rounded-lg border">
          <GalleryPrivateContent items={generateMockItems(9, true)} />
        </div>
      </div>

      {/* Single Item */}
      <div>
        <h3 className="text-foreground mb-2 text-sm font-medium">
          Single Item (Navigation Disabled)
        </h3>
        <div className="border-border h-[400px] rounded-lg border">
          <GalleryPrivateContent items={generateMockItems(1)} />
        </div>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen overflow-auto p-8">
        <Story />
      </div>
    ),
  ],
};
