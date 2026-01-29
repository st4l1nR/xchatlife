import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CardProperty from "@/app/_components/molecules/CardProperty";

const meta = {
  title: "Molecules/CardProperty",
  component: CardProperty,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-60">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    id: {
      control: "text",
      description: "Unique identifier for the property",
    },
    src: {
      control: "text",
      description: "Source URL for the image or video",
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
    },
    mediaType: {
      control: "radio",
      options: ["image", "video"],
      description: "Type of media to display",
    },
    aspectRatio: {
      control: "select",
      options: ["16:9", "4:3", "1:1", "3:4", "9:16"],
      description: "Aspect ratio of the card",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading skeleton state",
    },
    isDragging: {
      control: "boolean",
      description: "Apply dragging styles (reduced opacity)",
    },
    onEdit: {
      action: "onEdit",
      description: "Callback when edit button is clicked",
    },
    onDelete: {
      action: "onDelete",
      description: "Callback when delete button is clicked",
    },
    onClick: {
      action: "onClick",
      description: "Callback when card is clicked",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof CardProperty>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";
const mockVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// --- Stories ---

export const Default: Story = {
  args: {
    id: "1",
    src: mockImage,
    alt: "Property image",
    mediaType: "image",
    aspectRatio: "1:1",
  },
};

export const AspectRatio16x9: Story = {
  name: "Aspect Ratio 16:9",
  args: {
    id: "2",
    src: mockImage,
    alt: "Widescreen property",
    mediaType: "image",
    aspectRatio: "16:9",
  },
};

export const AspectRatio4x3: Story = {
  name: "Aspect Ratio 4:3",
  args: {
    id: "3",
    src: mockImage,
    alt: "Standard property",
    mediaType: "image",
    aspectRatio: "4:3",
  },
};

export const AspectRatio3x4: Story = {
  name: "Aspect Ratio 3:4",
  args: {
    id: "4",
    src: mockImage,
    alt: "Portrait property",
    mediaType: "image",
    aspectRatio: "3:4",
  },
};

export const AspectRatio9x16: Story = {
  name: "Aspect Ratio 9:16",
  args: {
    id: "5",
    src: mockImage,
    alt: "Vertical property",
    mediaType: "image",
    aspectRatio: "9:16",
  },
};

export const Video: Story = {
  args: {
    id: "6",
    src: mockVideo,
    mediaType: "video",
    aspectRatio: "1:1",
  },
};

export const VideoWidescreen: Story = {
  name: "Video (16:9)",
  args: {
    id: "7",
    src: mockVideo,
    mediaType: "video",
    aspectRatio: "16:9",
  },
};

export const WithEdit: Story = {
  name: "With Edit Button",
  args: {
    id: "8",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    onEdit: (id) => alert(`Edit clicked: ${id}`),
  },
};

export const WithDelete: Story = {
  name: "With Delete Button",
  args: {
    id: "9",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    onDelete: (id) => alert(`Delete clicked: ${id}`),
  },
};

export const WithEditAndDelete: Story = {
  name: "With Edit & Delete",
  args: {
    id: "10",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    onEdit: (id) => alert(`Edit clicked: ${id}`),
    onDelete: (id) => alert(`Delete clicked: ${id}`),
  },
};

export const Clickable: Story = {
  args: {
    id: "11",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    onClick: (id) => alert(`Card clicked: ${id}`),
  },
};

export const FullyInteractive: Story = {
  args: {
    id: "12",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    onEdit: (id) => alert(`Edit clicked: ${id}`),
    onDelete: (id) => alert(`Delete clicked: ${id}`),
    onClick: (id) => alert(`Card clicked: ${id}`),
  },
};

export const Loading: Story = {
  args: {
    id: "13",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    isLoading: true,
  },
};

export const LoadingWidescreen: Story = {
  name: "Loading (16:9)",
  args: {
    id: "14",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "16:9",
    isLoading: true,
  },
};

export const Dragging: Story = {
  args: {
    id: "15",
    src: mockImage,
    mediaType: "image",
    aspectRatio: "1:1",
    isDragging: true,
  },
};

export const AllAspectRatios: Story = {
  args: {
    id: "grid",
    src: mockImage,
    mediaType: "image",
  },
  decorators: [
    () => (
      <div className="flex flex-wrap items-end gap-4 p-4">
        <div className="w-40 space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            1:1
          </p>
          <CardProperty
            id="ar-1"
            src={mockImage}
            mediaType="image"
            aspectRatio="1:1"
          />
        </div>

        <div className="w-40 space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            16:9
          </p>
          <CardProperty
            id="ar-2"
            src={mockImage}
            mediaType="image"
            aspectRatio="16:9"
          />
        </div>

        <div className="w-40 space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            4:3
          </p>
          <CardProperty
            id="ar-3"
            src={mockImage}
            mediaType="image"
            aspectRatio="4:3"
          />
        </div>

        <div className="w-40 space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            3:4
          </p>
          <CardProperty
            id="ar-4"
            src={mockImage}
            mediaType="image"
            aspectRatio="3:4"
          />
        </div>

        <div className="w-40 space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            9:16
          </p>
          <CardProperty
            id="ar-5"
            src={mockImage}
            mediaType="image"
            aspectRatio="9:16"
          />
        </div>
      </div>
    ),
  ],
};

export const AllStates: Story = {
  args: {
    id: "states",
    src: mockImage,
    mediaType: "image",
  },
  decorators: [
    () => (
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            Default
          </p>
          <CardProperty id="s-1" src={mockImage} mediaType="image" />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            With Actions
          </p>
          <CardProperty
            id="s-2"
            src={mockImage}
            mediaType="image"
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            Video
          </p>
          <CardProperty id="s-3" src={mockVideo} mediaType="video" />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            Loading
          </p>
          <CardProperty
            id="s-4"
            src={mockImage}
            mediaType="image"
            isLoading={true}
          />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            Dragging
          </p>
          <CardProperty
            id="s-5"
            src={mockImage}
            mediaType="image"
            isDragging={true}
          />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium">
            Clickable
          </p>
          <CardProperty
            id="s-6"
            src={mockImage}
            mediaType="image"
            onClick={() => {}}
          />
        </div>
      </div>
    ),
  ],
};
