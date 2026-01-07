import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BubbleStory from "@/app/_components/molecules/BubbleStory";

const meta = {
  title: "Molecules/BubbleStory",
  component: BubbleStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name displayed below the avatar",
    },
    src: {
      control: "text",
      description: "Image source URL for the avatar",
    },
    href: {
      control: "text",
      description: "Link destination when bubble is clicked",
    },
    isRead: {
      control: "boolean",
      description: "Whether the story has been read (changes border color)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant of the bubble",
    },
    alt: {
      control: "text",
      description: "Alt text for the image (defaults to name)",
    },
  },
} satisfies Meta<typeof BubbleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

// --- Stories ---

export const Default: Story = {
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
  },
};

export const Unread: Story = {
  name: "Unread (Primary Border)",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
    isRead: false,
  },
};

export const Read: Story = {
  name: "Read (Muted Border)",
  args: {
    name: "Chérie",
    src: mockImage,
    href: "/stories/cherie",
    isRead: true,
  },
};

export const SizeSmall: Story = {
  name: "Size: Small",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
    size: "sm",
  },
};

export const SizeMedium: Story = {
  name: "Size: Medium",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
    size: "md",
  },
};

export const SizeLarge: Story = {
  name: "Size: Large",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
    size: "lg",
  },
};

export const Sizes: Story = {
  name: "All Sizes",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
  },
  render: () => (
    <div className="flex items-end gap-6">
      <BubbleStory
        name="Small"
        src={mockImage}
        href="/stories/small"
        size="sm"
      />
      <BubbleStory
        name="Medium"
        src={mockImage}
        href="/stories/medium"
        size="md"
      />
      <BubbleStory
        name="Large"
        src={mockImage}
        href="/stories/large"
        size="lg"
      />
    </div>
  ),
};

export const States: Story = {
  name: "Read vs Unread States",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
  },
  render: () => (
    <div className="flex items-center gap-6">
      <BubbleStory
        name="Hanna"
        src={mockImage}
        href="/stories/hanna"
        isRead={false}
      />
      <BubbleStory
        name="Chérie"
        src={mockImage}
        href="/stories/cherie"
        isRead={true}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Unread Stories
        </h3>
        <div className="flex items-end gap-6">
          <BubbleStory
            name="Small"
            src={mockImage}
            href="/stories/1"
            size="sm"
            isRead={false}
          />
          <BubbleStory
            name="Medium"
            src={mockImage}
            href="/stories/2"
            size="md"
            isRead={false}
          />
          <BubbleStory
            name="Large"
            src={mockImage}
            href="/stories/3"
            size="lg"
            isRead={false}
          />
        </div>
      </div>
      <div>
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Read Stories
        </h3>
        <div className="flex items-end gap-6">
          <BubbleStory
            name="Small"
            src={mockImage}
            href="/stories/4"
            size="sm"
            isRead={true}
          />
          <BubbleStory
            name="Medium"
            src={mockImage}
            href="/stories/5"
            size="md"
            isRead={true}
          />
          <BubbleStory
            name="Large"
            src={mockImage}
            href="/stories/6"
            size="lg"
            isRead={true}
          />
        </div>
      </div>
    </div>
  ),
};

export const StoryRow: Story = {
  name: "Story Row (Typical Usage)",
  args: {
    name: "Hanna",
    src: mockImage,
    href: "/stories/hanna",
  },
  render: () => (
    <div className="flex gap-4 overflow-x-auto p-2">
      <BubbleStory
        name="Hanna"
        src={mockImage}
        href="/stories/hanna"
        isRead={false}
      />
      <BubbleStory
        name="Chérie"
        src={mockImage}
        href="/stories/cherie"
        isRead={true}
      />
      <BubbleStory
        name="Sophie"
        src={mockImage}
        href="/stories/sophie"
        isRead={false}
      />
      <BubbleStory
        name="Emma"
        src={mockImage}
        href="/stories/emma"
        isRead={true}
      />
      <BubbleStory
        name="Olivia"
        src={mockImage}
        href="/stories/olivia"
        isRead={true}
      />
      <BubbleStory
        name="Lina"
        src={mockImage}
        href="/stories/lina"
        isRead={false}
      />
    </div>
  ),
};
