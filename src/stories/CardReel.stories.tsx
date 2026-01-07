import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import CardReel from "@/app/_components/molecules/CardReel";
import DialogAuth from "@/app/_components/organisms/DialogAuth";
import type { DialogAuthVariant } from "@/app/_components/organisms/DialogAuth";

const meta = {
  title: "Molecules/CardReel",
  component: CardReel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Character name displayed on the card",
    },
    avatarSrc: {
      control: "text",
      description: "URL for the avatar image",
    },
    videoSrc: {
      control: "text",
      description: "URL for the video source",
    },
    likeCount: {
      control: "number",
      description: "Number of likes to display",
    },
    isLiked: {
      control: "boolean",
      description: "Whether the current user has liked this reel",
    },
    isLoggedIn: {
      control: "boolean",
      description: "Whether the user is logged in",
    },
    chatUrl: {
      control: "text",
      description: "URL to redirect when Chat Now is clicked",
    },
  },
  decorators: [
    (Story) => (
      <div className="h-170 w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardReel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    name: "Amelia",
    avatarSrc: "/images/girl-poster.webp",
    videoSrc: "/videos/girl-video.mp4",
    likeCount: 5322,
    isLiked: false,
    isLoggedIn: true,
    chatUrl: "/chat/amelia",
  },
};

// Liked state
export const Liked: Story = {
  args: {
    ...Default.args,
    isLiked: true,
  },
};

// Not logged in - shows auth dialog
const NotLoggedInTemplate = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(5322);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <>
      <CardReel
        name="Amelia"
        avatarSrc="/images/girl-poster.webp"
        videoSrc="/videos/girl-video.mp4"
        posterSrc="/images/girl-poster.webp"
        likeCount={likeCount}
        isLiked={isLiked}
        onLikeToggle={handleLikeToggle}
        isLoggedIn={false}
        chatUrl="/chat/amelia"
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
    ...Default.args,
    isLoggedIn: false,
  },
  render: () => <NotLoggedInTemplate />,
};

// Interactive with like toggle
const InteractiveTemplate = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(5322);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <CardReel
      name="Amelia"
      avatarSrc="/images/girl-poster.webp"
      videoSrc="/videos/girl-video.mp4"
      posterSrc="/images/girl-poster.webp"
      likeCount={likeCount}
      isLiked={isLiked}
      onLikeToggle={handleLikeToggle}
      isLoggedIn={true}
      chatUrl="/chat/amelia"
    />
  );
};

export const Interactive: Story = {
  args: {
    ...Default.args,
  },
  render: () => <InteractiveTemplate />,
};

// Small like count
export const SmallLikeCount: Story = {
  args: {
    ...Default.args,
    likeCount: 100,
  },
};

// Large like count (K format)
export const LargeLikeCount: Story = {
  args: {
    ...Default.args,
    likeCount: 15000,
  },
};

// Very large like count (M format)
export const MillionLikes: Story = {
  args: {
    ...Default.args,
    likeCount: 1500000,
  },
};

// Without avatar
export const WithoutAvatar: Story = {
  args: {
    ...Default.args,
    avatarSrc: undefined,
  },
};
