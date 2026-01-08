import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import ListCardReel from "@/app/_components/organisms/ListCardReel";
import DialogAuth from "@/app/_components/organisms/DialogAuth";
import type { DialogAuthVariant } from "@/app/_components/organisms/DialogAuth";
import type { CardReelProps } from "@/app/_components/molecules/CardReel";

// Mock data for reels
const mockReels: CardReelProps[] = [
  {
    id: "1",
    name: "Amelia",
    avatarSrc: "/images/girl-poster.webp",
    videoSrc: "/videos/girl-video.mp4",
    likeCount: 5322,
    isLiked: false,
    chatUrl: "/chat/amelia",
  },
  {
    id: "2",
    name: "Sofia",
    avatarSrc: "/images/girl-poster.webp",
    videoSrc: "/videos/girl-video.mp4",
    likeCount: 12400,
    isLiked: true,
    chatUrl: "/chat/sofia",
  },
  {
    id: "3",
    name: "Luna",
    avatarSrc: "/images/girl-poster.webp",
    videoSrc: "/videos/girl-video.mp4",
    likeCount: 890,
    isLiked: false,
    chatUrl: "/chat/luna",
  },
  {
    id: "4",
    name: "Mia",
    avatarSrc: "/images/girl-poster.webp",
    videoSrc: "/videos/girl-video.mp4",
    likeCount: 45600,
    isLiked: false,
    chatUrl: "/chat/mia",
  },
];

const meta = {
  title: "Organisms/ListCardReel",
  component: ListCardReel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Loading state",
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background h-screen w-screen">
        <div className="mx-auto h-full w-96">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ListCardReel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    loading: false,
    items: mockReels,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    items: [],
  },
};

// Empty state
export const Empty: Story = {
  args: {
    loading: false,
    items: [],
  },
};

// Single item
export const SingleItem: Story = {
  args: {
    loading: false,
    items: [mockReels[0]!],
  },
};

// Not logged in - shows auth dialog
const NotLoggedInTemplate = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  return (
    <>
      <ListCardReel
        loading={false}
        items={mockReels}
        onAuthRequired={() => setAuthOpen(true)}
      />
      <DialogAuth
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        variant={authVariant}
        onVariantChange={setAuthVariant}
      />
    </>
  );
};

export const NotLoggedIn: Story = {
  args: {
    loading: false,
    items: mockReels,
  },
  render: () => <NotLoggedInTemplate />,
};

// Interactive with like toggles
const InteractiveTemplate = () => {
  const [reels, setReels] = useState(mockReels);

  const handleLikeToggle = (id: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likeCount: reel.isLiked ? reel.likeCount - 1 : reel.likeCount + 1,
            }
          : reel,
      ),
    );
  };

  const reelsWithHandlers = reels.map((reel) => ({
    ...reel,
    onLikeToggle: () => handleLikeToggle(reel.id!),
  }));

  return <ListCardReel loading={false} items={reelsWithHandlers} />;
};

export const Interactive: Story = {
  args: {
    loading: false,
    items: mockReels,
  },
  render: () => <InteractiveTemplate />,
};
