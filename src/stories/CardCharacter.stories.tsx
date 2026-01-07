import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CardCharacter from "@/app/_components/molecules/CardCharacter";

const meta = {
  title: "Molecules/CardCharacter",
  component: CardCharacter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    name: {
      control: "text",
      description: "Character name",
    },
    age: {
      control: "number",
      description: "Character age",
    },
    href: {
      control: "text",
      description: "Link destination when card is clicked",
    },
    imageSrc: {
      control: "text",
      description: "Image source URL (poster)",
    },
    videoSrc: {
      control: "text",
      description: "Video source URL (plays on hover)",
    },
    description: {
      control: "text",
      description: "Optional character description",
    },
    isNew: {
      control: "boolean",
      description: "Shows 'New' badge",
    },
    isLive: {
      control: "boolean",
      description: "Shows 'LIVE' indicator",
    },
    playWithMeHref: {
      control: "text",
      description: "If provided, shows 'Play with me' button",
    },
  },
} satisfies Meta<typeof CardCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";
const mockVideo = "/videos/girl-video.mp4";

// --- Stories ---

export const Default: Story = {
  args: {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
  },
};

export const WithVideo: Story = {
  name: "With Video on Hover",
  args: {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
    videoSrc: mockVideo,
  },
};

export const WithNewBadge: Story = {
  name: "With New Badge",
  args: {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
    isNew: true,
  },
};

export const WithLiveIndicator: Story = {
  name: "With Live Indicator",
  args: {
    name: "Olivia",
    age: 28,
    href: "/characters/olivia",
    imageSrc: mockImage,
    isLive: true,
  },
};

export const WithPlayButton: Story = {
  name: "With Play Button",
  args: {
    name: "Olivia",
    age: 28,
    href: "/characters/olivia",
    imageSrc: mockImage,
    isLive: true,
    playWithMeHref: "/play/olivia",
  },
};

export const WithDescription: Story = {
  name: "With Description",
  args: {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
    isNew: true,
    description:
      "This K-pop idol needs a new manager to boost her career. Lina is s...",
  },
};

export const FullFeatured: Story = {
  name: "Full Featured",
  args: {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
    videoSrc: mockVideo,
    description:
      "This K-pop idol needs a new manager to boost her career. Lina is searching for someone who can help her reach new heights.",
    isNew: true,
    isLive: true,
    playWithMeHref: "/play/lina",
  },
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  args: {
    name: "Lina",
    age: 22,
    href: "/characters/lina",
    imageSrc: mockImage,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
      <CardCharacter
        name="Lina"
        age={22}
        href="/characters/lina"
        imageSrc={mockImage}
        isNew
        description="This K-pop idol needs a new manager to boost her career. Lina is s..."
      />
      <CardCharacter
        name="Olivia"
        age={28}
        href="/characters/olivia"
        imageSrc={mockImage}
        isLive
        playWithMeHref="/play/olivia"
      />
      <CardCharacter
        name="Sophie"
        age={24}
        href="/characters/sophie"
        imageSrc={mockImage}
        videoSrc={mockVideo}
      />
      <CardCharacter
        name="Emma"
        age={26}
        href="/characters/emma"
        imageSrc={mockImage}
        isNew
        isLive
        playWithMeHref="/play/emma"
        description="A mysterious artist with a passion for the unknown."
      />
    </div>
  ),
};
