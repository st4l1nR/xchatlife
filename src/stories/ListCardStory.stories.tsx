import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Image from "next/image";
import ListCardStory from "../app/_components/organisms/ListCardStory";
import type { StoryProfile } from "../app/_components/organisms/ListCardStory";

const meta = {
  title: "Organisms/ListCardStory",
  component: ListCardStory,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the story viewer is open",
    },
    profiles: {
      description: "Array of profiles with their stories",
    },
    initialProfileIndex: {
      control: "number",
      description: "Starting profile index",
    },
  },
} satisfies Meta<typeof ListCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sample Data
// ============================================================================

const sampleProfiles: StoryProfile[] = [
  {
    id: "1",
    name: "Brooke",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "about 18 hours",
    media: [
      {
        id: "1-1",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 3,
      },
      { id: "1-2", type: "video", src: "/videos/girl-video.mp4" },
    ],
  },
  {
    id: "2",
    name: "Sarah",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "2 hours ago",
    media: [
      {
        id: "2-1",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 3,
      },
      {
        id: "2-2",
        type: "image",
        src: "/images/girl-poster.webp",
        duration: 3,
      },
    ],
  },
  {
    id: "3",
    name: "Emma",
    avatarSrc: "/images/girl-poster.webp",
    timestamp: "just now",
    media: [{ id: "3-1", type: "video", src: "/videos/girl-video.mp4" }],
  },
];

// ============================================================================
// Default Story
// ============================================================================

export const Default: Story = {
  args: {
    isOpen: true,
    profiles: sampleProfiles,
    initialProfileIndex: 0,
    onClose: () => console.log("Close"),
    onProfileChange: (index) => console.log("Profile changed to:", index),
    onAllStoriesComplete: () => console.log("All stories complete"),
  },
};

// ============================================================================
// Single Profile
// ============================================================================

export const SingleProfile: Story = {
  args: {
    isOpen: true,
    profiles: [
      {
        id: "1",
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
      },
    ],
    onClose: () => console.log("Close"),
  },
};

// ============================================================================
// Multiple Media Per Profile
// ============================================================================

export const MultipleMediaPerProfile: Story = {
  args: {
    isOpen: true,
    profiles: [
      {
        id: "1",
        name: "Brooke",
        avatarSrc: "/images/girl-poster.webp",
        timestamp: "about 18 hours",
        media: [
          {
            id: "1-1",
            type: "image",
            src: "/images/girl-poster.webp",
            duration: 2,
          },
          {
            id: "1-2",
            type: "image",
            src: "/images/girl-poster.webp",
            duration: 2,
          },
          { id: "1-3", type: "video", src: "/videos/girl-video.mp4" },
          {
            id: "1-4",
            type: "image",
            src: "/images/girl-poster.webp",
            duration: 2,
          },
        ],
      },
      {
        id: "2",
        name: "Sarah",
        avatarSrc: "/images/girl-poster.webp",
        timestamp: "5 minutes ago",
        media: [
          { id: "2-1", type: "video", src: "/videos/girl-video.mp4" },
          {
            id: "2-2",
            type: "image",
            src: "/images/girl-poster.webp",
            duration: 2,
          },
        ],
      },
    ],
    onClose: () => console.log("Close"),
  },
};

// ============================================================================
// Start From Middle
// ============================================================================

export const StartFromMiddle: Story = {
  args: {
    isOpen: true,
    profiles: sampleProfiles,
    initialProfileIndex: 1, // Start from Sarah
    onClose: () => console.log("Close"),
  },
};

// ============================================================================
// Interactive Demo
// ============================================================================

const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(0);

  return (
    <div className="bg-background flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-foreground text-xl font-bold">Story Viewer Demo</h2>
        <p className="text-muted-foreground text-sm">
          Click a profile to open their stories
        </p>

        {/* Profile buttons */}
        <div className="flex gap-4">
          {sampleProfiles.map((profile, index) => (
            <button
              key={profile.id}
              onClick={() => {
                setCurrentProfile(index);
                setIsOpen(true);
              }}
              className="flex flex-col items-center gap-2"
            >
              <div className="border-primary relative size-16 overflow-hidden rounded-full border-2 p-0.5">
                <Image
                  src={profile.avatarSrc ?? "/images/girl-poster.webp"}
                  alt={profile.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-foreground text-sm">{profile.name}</span>
            </button>
          ))}
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          Current profile: {sampleProfiles[currentProfile]?.name}
        </p>
      </div>

      <ListCardStory
        isOpen={isOpen}
        profiles={sampleProfiles}
        initialProfileIndex={currentProfile}
        onClose={() => setIsOpen(false)}
        onProfileChange={(index) => setCurrentProfile(index)}
        onAllStoriesComplete={() => {
          console.log("All stories viewed!");
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    profiles: sampleProfiles,
    onClose: () => {},
  },
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing how to integrate ListCardStory with a profile selector. Click a profile to open their stories, and watch them auto-advance.",
      },
    },
  },
};

// ============================================================================
// Video Only Profiles
// ============================================================================

export const VideoOnlyProfiles: Story = {
  args: {
    isOpen: true,
    profiles: [
      {
        id: "1",
        name: "Brooke",
        avatarSrc: "/images/girl-poster.webp",
        timestamp: "1 hour ago",
        media: [{ id: "1-1", type: "video", src: "/videos/girl-video.mp4" }],
      },
      {
        id: "2",
        name: "Sarah",
        avatarSrc: "/images/girl-poster.webp",
        timestamp: "30 mins ago",
        media: [{ id: "2-1", type: "video", src: "/videos/girl-video.mp4" }],
      },
    ],
    onClose: () => console.log("Close"),
  },
};
