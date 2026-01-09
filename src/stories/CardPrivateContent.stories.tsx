import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CardPrivateContent from "@/app/_components/molecules/CardPrivateContent";

const meta = {
  title: "Molecules/CardPrivateContent",
  component: CardPrivateContent,
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
    imageSrc: {
      control: "text",
      description: "Image source URL",
    },
    description: {
      control: "text",
      description: "Content description",
    },
    likeCount: {
      control: "number",
      description: "Number of likes (shown in top-left badge)",
    },
    imageCount: {
      control: "number",
      description: "Number of images (shown in top-left badge)",
    },
    locked: {
      control: "boolean",
      description: "Whether the content is locked",
    },
    tokenCost: {
      control: "number",
      description: "Token cost to unlock (only shown when locked)",
    },
    isUnlocking: {
      control: "boolean",
      description: "Loading state for unlock button",
    },
    bottomLikeCount: {
      control: "number",
      description: "Like count shown below the card (outside card)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof CardPrivateContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

// --- Stories ---

export const Locked: Story = {
  args: {
    imageSrc: mockImage,
    description: "Sextape & Anal in my dorm room",
    likeCount: 2,
    imageCount: 37,
    locked: true,
    tokenCost: 140,
    bottomLikeCount: 3800,
  },
};

export const LockedWithoutStats: Story = {
  name: "Locked (No Stats)",
  args: {
    imageSrc: mockImage,
    description: "Exclusive private content",
    locked: true,
    tokenCost: 200,
  },
};

export const LockedWithoutDescription: Story = {
  name: "Locked (No Description)",
  args: {
    imageSrc: mockImage,
    likeCount: 5,
    imageCount: 12,
    locked: true,
    tokenCost: 50,
  },
};

export const Unlocking: Story = {
  name: "Unlocking (Loading)",
  args: {
    imageSrc: mockImage,
    description: "Sextape & Anal in my dorm room",
    likeCount: 2,
    imageCount: 37,
    locked: true,
    tokenCost: 140,
    isUnlocking: true,
    bottomLikeCount: 3800,
  },
};

export const Unlocked: Story = {
  args: {
    imageSrc: mockImage,
    description: "Caught in the lockeroom",
    likeCount: 2,
    imageCount: 24,
    locked: false,
    bottomLikeCount: 3500,
  },
};

export const UnlockedWithClick: Story = {
  name: "Unlocked (Clickable)",
  args: {
    imageSrc: mockImage,
    description: "Caught in the lockeroom",
    likeCount: 2,
    imageCount: 24,
    locked: false,
    bottomLikeCount: 3500,
    onClick: () => alert("Card clicked!"),
  },
};

export const UnlockedMinimal: Story = {
  name: "Unlocked (Minimal)",
  args: {
    imageSrc: mockImage,
    locked: false,
  },
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  args: {
    imageSrc: mockImage,
    locked: true,
    tokenCost: 140,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
      {/* Locked variants */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-center text-xs font-medium">
          Locked
        </p>
        <CardPrivateContent
          imageSrc={mockImage}
          description="Sextape & Anal in my dorm room"
          likeCount={2}
          imageCount={37}
          locked={true}
          tokenCost={140}
          bottomLikeCount={3800}
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-center text-xs font-medium">
          Unlocking
        </p>
        <CardPrivateContent
          imageSrc={mockImage}
          description="Sextape & Anal in my dorm room"
          likeCount={2}
          imageCount={37}
          locked={true}
          tokenCost={140}
          isUnlocking={true}
          bottomLikeCount={3800}
        />
      </div>

      {/* Unlocked variants */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-center text-xs font-medium">
          Unlocked
        </p>
        <CardPrivateContent
          imageSrc={mockImage}
          description="Caught in the lockeroom"
          likeCount={2}
          imageCount={24}
          locked={false}
          bottomLikeCount={3500}
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-center text-xs font-medium">
          Unlocked (Minimal)
        </p>
        <CardPrivateContent imageSrc={mockImage} locked={false} />
      </div>
    </div>
  ),
};
