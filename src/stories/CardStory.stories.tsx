import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import CardStory from "../app/_components/organisms/CardStory";
import type { CardStoryProps } from "../app/_components/organisms/CardStory";

const meta = {
  title: "Organisms/CardStory",
  component: CardStory,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Profile name displayed in the header",
    },
    avatarSrc: {
      control: "text",
      description: "URL of the profile avatar image",
    },
    timestamp: {
      control: "text",
      description: "Timestamp showing when the story was posted",
    },
    media: {
      description: "Array of media items (images/videos) to display",
    },
    initialIndex: {
      control: "number",
      description: "Starting index for the media array",
    },
    hasPrevProfile: {
      control: "boolean",
      description: "Whether there is a previous profile to navigate to",
    },
    hasNextProfile: {
      control: "boolean",
      description: "Whether there is a next profile to navigate to",
    },
  },
} satisfies Meta<typeof CardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default Story - Single Image
// ============================================================================

export const Default: Story = {
  args: {
    name: "Brooke",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "about 18 hours",
    media: [
      {
        id: "1",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 5,
      },
    ],
    hasPrevProfile: false,
    hasNextProfile: true,
  },
};

// ============================================================================
// Single Video Story
// ============================================================================

export const VideoOnly: Story = {
  args: {
    name: "Brooke",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "2 hours ago",
    media: [
      {
        id: "1",
        type: "video",
        src: "/videos/girl-video.mp4",
      },
    ],
    hasPrevProfile: true,
    hasNextProfile: true,
  },
};

// ============================================================================
// Multiple Media Items
// ============================================================================

export const MultipleMedia: Story = {
  args: {
    name: "Brooke",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "about 18 hours",
    media: [
      {
        id: "1",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 5,
      },
      {
        id: "2",
        type: "video",
        src: "/videos/girl-video.mp4",
      },
      {
        id: "3",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 5,
      },
    ],
    hasPrevProfile: true,
    hasNextProfile: true,
  },
};

// ============================================================================
// Without Avatar
// ============================================================================

export const WithoutAvatar: Story = {
  args: {
    name: "Anonymous",
    timestamp: "5 minutes ago",
    media: [
      {
        id: "1",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 5,
      },
    ],
    hasPrevProfile: false,
    hasNextProfile: false,
  },
};

// ============================================================================
// Interactive Demo with Profile Navigation
// ============================================================================

const InteractiveDemo = () => {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const profiles: CardStoryProps[] = [
    {
      name: "Brooke",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "about 18 hours",
      media: [
        {
          id: "p1-1",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
        { id: "p1-2", type: "video", src: "/videos/girl-video.mp4" },
      ],
    },
    {
      name: "Sarah",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "2 hours ago",
      media: [
        {
          id: "p2-1",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 4,
        },
        {
          id: "p2-2",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 4,
        },
      ],
    },
    {
      name: "Emma",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "just now",
      media: [{ id: "p3-1", type: "video", src: "/videos/girl-video.mp4" }],
    },
  ];

  const handlePrevProfile = () => {
    setCurrentProfile((prev) => Math.max(0, prev - 1));
  };

  const handleNextProfile = () => {
    if (currentProfile < profiles.length - 1) {
      setCurrentProfile((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleStoryComplete = () => {
    if (currentProfile < profiles.length - 1) {
      setCurrentProfile((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <button
          onClick={() => {
            setIsOpen(true);
            setCurrentProfile(0);
          }}
          className="bg-primary text-primary-foreground rounded-lg px-6 py-3"
        >
          Open Stories
        </button>
      </div>
    );
  }

  const profile = profiles[currentProfile];

  if (!profile) {
    return null;
  }

  return (
    <CardStory
      name={profile.name}
      avatarSrc={profile.avatarSrc}
      timestamp={profile.timestamp}
      media={profile.media}
      hasPrevProfile={currentProfile > 0}
      hasNextProfile={currentProfile < profiles.length - 1}
      onPrevProfile={handlePrevProfile}
      onNextProfile={handleNextProfile}
      onClose={handleClose}
      onStoryComplete={handleStoryComplete}
    />
  );
};

export const Interactive: Story = {
  args: {
    name: "Interactive",
    media: [{ id: "1", type: "image", src: "/images/girl-poster.webp" }],
  },
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo with multiple profiles. Navigate through stories by tapping left/right, hold to pause, or use the close button.",
      },
    },
  },
};

// ============================================================================
// Long Duration Image
// ============================================================================

export const LongDuration: Story = {
  args: {
    name: "Brooke",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "1 hour ago",
    media: [
      {
        id: "1",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 10, // 10 seconds
      },
    ],
    hasPrevProfile: false,
    hasNextProfile: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Story with a longer duration (10 seconds) for the image.",
      },
    },
  },
};

// ============================================================================
// Many Media Items
// ============================================================================

export const ManyMediaItems: Story = {
  args: {
    name: "Brooke",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "3 hours ago",
    media: [
      { id: "1", type: "image", src: "/images/girl-poster.webp", duration: 3 },
      { id: "2", type: "image", src: "/images/girl-poster.webp", duration: 3 },
      { id: "3", type: "video", src: "/videos/girl-video.mp4" },
      { id: "4", type: "image", src: "/images/girl-poster.webp", duration: 3 },
      { id: "5", type: "image", src: "/images/girl-poster.webp", duration: 3 },
      { id: "6", type: "video", src: "/videos/girl-video.mp4" },
    ],
    hasPrevProfile: true,
    hasNextProfile: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Story with many media items showing multiple progress bars.",
      },
    },
  },
};
