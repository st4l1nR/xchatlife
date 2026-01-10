import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import CardMessage from "@/app/_components/molecules/CardMessage";

const meta = {
  title: "Molecules/CardMessage",
  component: CardMessage,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "text",
        "video",
        "image",
        "private-content",
        "unlocked-content",
      ],
      description: "Message variant type",
    },
    self: {
      control: "boolean",
      description: "Whether this is a message from the current user",
    },
    timestamp: {
      control: "text",
      description: "Timestamp to display below the message",
    },
    text: {
      control: "text",
      description: "Text content for text variant",
    },
    audioSrc: {
      control: "text",
      description: "Audio source URL for text variant with voice transcript",
    },
    videoSrc: {
      control: "text",
      description: "Video source URL for video variant",
    },
    videoPosterSrc: {
      control: "text",
      description: "Poster image for video variant",
    },
    videoDuration: {
      control: "text",
      description: "Duration display for video variant",
    },
    imageSrc: {
      control: "text",
      description: "Image source URL for image variant",
    },
    tokenCost: {
      control: "number",
      description: "Token cost for private-content variant",
    },
    contentDescription: {
      control: "text",
      description: "Description for private-content variant",
    },
    imageCount: {
      control: "number",
      description: "Number of images for private-content variant",
    },
    videoCount: {
      control: "number",
      description: "Number of videos for private-content variant",
    },
    feedbackControls: {
      control: "boolean",
      description: "Show like/dislike feedback controls below the message",
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background w-96 rounded-lg p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Text Variant Stories
// ============================================================================

export const TextOther: Story = {
  args: {
    variant: "text",
    self: false,
    text: "Omigosh, hi! I'm Savannah from the cheer squad. Just finished practice and like, totally need someone interesting to talk to. College classes are such a snooze compared to... other things I'm curious about.",
    timestamp: "8:46PM",
  },
};

export const TextSelf: Story = {
  args: {
    variant: "text",
    self: true,
    text: "Send me a video of you",
    timestamp: "8:47PM",
  },
};

export const TextWithAudio: Story = {
  args: {
    variant: "text",
    self: false,
    text: "Omigosh, hi! I'm Savannah from the cheer squad. Just finished practice and like, totally need someone interesting to talk to.",
    audioSrc: "/audio/girl-voice.mp3",
    timestamp: "8:46PM",
  },
};

export const TextShort: Story = {
  args: {
    variant: "text",
    self: false,
    text: "Hey there! 👋",
    timestamp: "8:45PM",
  },
};

export const TextLong: Story = {
  args: {
    variant: "text",
    self: false,
    text: "So I was thinking about what you said earlier, and I totally agree! It's so important to find people who understand you and share your interests. Life is too short to spend time with people who don't get you, right? Anyway, I'd love to hear more about your hobbies and what you're passionate about!",
    timestamp: "8:48PM",
  },
};

export const TextWithFeedback: Story = {
  args: {
    variant: "text",
    self: false,
    text: "Omigosh, hi! I'm Savannah from the cheer squad. Just finished practice and like, totally need someone interesting to talk to.",
    timestamp: "8:46PM",
    feedbackControls: true,
  },
};

// ============================================================================
// Video Variant Stories
// ============================================================================

export const Video: Story = {
  args: {
    variant: "video",
    self: false,
    videoSrc: "/videos/girl-video.mp4",
    videoPosterSrc: "/images/girl-poster.webp",
    videoDuration: "0:10",
    timestamp: "8:47PM",
  },
};

export const VideoSelf: Story = {
  args: {
    variant: "video",
    self: true,
    videoSrc: "/videos/girl-video.mp4",
    videoPosterSrc: "/images/girl-poster.webp",
    videoDuration: "0:10",
    timestamp: "8:48PM",
  },
};

export const VideoWithFeedback: Story = {
  args: {
    variant: "video",
    self: false,
    videoSrc: "/videos/girl-video.mp4",
    videoPosterSrc: "/images/girl-poster.webp",
    videoDuration: "0:10",
    timestamp: "8:47PM",
    feedbackControls: true,
  },
};

// ============================================================================
// Image Variant Stories
// ============================================================================

export const ImageOther: Story = {
  args: {
    variant: "image",
    self: false,
    imageSrc: "/images/girl-poster.webp",
    imageAlt: "Cheerleader photo",
    timestamp: "8:51PM",
    onCreateAIVideo: () => console.log("Create AI Video clicked"),
    onImageClick: () => console.log("Image clicked - open lightbox"),
  },
};

export const ImageSelf: Story = {
  args: {
    variant: "image",
    self: true,
    imageSrc: "/images/girl-poster.webp",
    imageAlt: "Photo",
    timestamp: "8:52PM",
    onImageClick: () => console.log("Image clicked - open lightbox"),
  },
};

export const ImageWithoutAIButton: Story = {
  args: {
    variant: "image",
    self: false,
    imageSrc: "/images/girl-poster.webp",
    imageAlt: "Photo",
    timestamp: "8:51PM",
    onImageClick: () => console.log("Image clicked - open lightbox"),
  },
};

export const ImageWithFeedback: Story = {
  args: {
    variant: "image",
    self: false,
    imageSrc: "/images/girl-poster.webp",
    imageAlt: "Cheerleader photo",
    timestamp: "8:51PM",
    onCreateAIVideo: () => console.log("Create AI Video clicked"),
    onImageClick: () => console.log("Image clicked - open lightbox"),
    feedbackControls: true,
  },
};

// ============================================================================
// Private Content Variant Stories
// ============================================================================

export const PrivateContent: Story = {
  args: {
    variant: "private-content",
    self: false,
    previewSrc: "/images/girl-poster.webp",
    tokenCost: 120,
    contentDescription: "Caught in the lockerroom",
    imageCount: 2,
    videoCount: 24,
    timestamp: "8:53PM",
    onUnlock: () => console.log("Unlock clicked"),
  },
};

const PrivateContentInteractiveTemplate = () => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setIsUnlocked(true);
    }, 2000);
  };

  if (isUnlocked) {
    return (
      <CardMessage
        variant="unlocked-content"
        self={false}
        imageSrc="/images/girl-poster.webp"
        contentDescription="Caught in the lockerroom"
        imageCount={2}
        videoCount={24}
        timestamp="8:53PM"
        onImageClick={() => console.log("View unlocked image")}
      />
    );
  }

  return (
    <CardMessage
      variant="private-content"
      self={false}
      previewSrc="/images/girl-poster.webp"
      tokenCost={120}
      contentDescription="Caught in the lockerroom"
      imageCount={2}
      videoCount={24}
      timestamp="8:53PM"
      onUnlock={handleUnlock}
      isUnlocking={isUnlocking}
    />
  );
};

export const PrivateContentInteractive: Story = {
  args: {
    variant: "private-content",
  },
  render: () => <PrivateContentInteractiveTemplate />,
};

// ============================================================================
// Unlocked Content Variant Stories
// ============================================================================

export const UnlockedContent: Story = {
  args: {
    variant: "unlocked-content",
    self: false,
    imageSrc: "/images/girl-poster.webp",
    contentDescription: "Caught in the lockerroom",
    imageCount: 2,
    videoCount: 24,
    timestamp: "8:53PM",
    onImageClick: () => console.log("Image clicked"),
  },
};

// ============================================================================
// Conversation Stories
// ============================================================================

const ConversationTemplate = () => {
  return (
    <div className="flex flex-col gap-3">
      <CardMessage
        variant="text"
        self={false}
        text="Omigosh, hi! I'm Savannah from the cheer squad. Just finished practice and like, totally need someone interesting to talk to."
        audioSrc="/audio/girl-voice.mp3"
        timestamp="8:46PM"
      />

      <CardMessage
        variant="text"
        self={true}
        text="Send me a video of you"
        timestamp="8:47PM"
      />

      <CardMessage
        variant="video"
        self={false}
        videoSrc="/videos/girl-video.mp4"
        videoPosterSrc="/images/girl-poster.webp"
        videoDuration="0:10"
        timestamp="8:47PM"
      />

      <CardMessage
        variant="image"
        self={false}
        imageSrc="/images/girl-poster.webp"
        imageAlt="Cheerleader photo"
        timestamp="8:51PM"
        onCreateAIVideo={() => console.log("Create AI Video")}
        onImageClick={() => console.log("Open lightbox")}
      />

      <CardMessage
        variant="private-content"
        self={false}
        previewSrc="/images/girl-poster.webp"
        tokenCost={120}
        contentDescription="Caught in the lockerroom"
        imageCount={2}
        videoCount={24}
        timestamp="8:53PM"
        onUnlock={() => console.log("Unlock")}
      />
    </div>
  );
};

export const Conversation: Story = {
  args: {
    variant: "text",
  },
  render: () => <ConversationTemplate />,
};

// ============================================================================
// All Variants Side by Side
// ============================================================================

const AllVariantsTemplate = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-foreground text-sm font-semibold">
          Other&apos;s Messages
        </h3>
        <CardMessage
          variant="text"
          self={false}
          text="Hey there! This is a text message."
          timestamp="8:46PM"
        />
        <CardMessage
          variant="text"
          self={false}
          text="This one has audio!"
          audioSrc="/audio/girl-voice.mp3"
          timestamp="8:46PM"
        />
        <CardMessage
          variant="video"
          self={false}
          videoSrc="/videos/girl-video.mp4"
          videoPosterSrc="/images/girl-poster.webp"
          videoDuration="0:10"
          timestamp="8:47PM"
        />
        <CardMessage
          variant="image"
          self={false}
          imageSrc="/images/girl-poster.webp"
          timestamp="8:51PM"
          onCreateAIVideo={() => {}}
          onImageClick={() => {}}
        />
        <CardMessage
          variant="private-content"
          self={false}
          previewSrc="/images/girl-poster.webp"
          tokenCost={120}
          contentDescription="Premium content"
          imageCount={5}
          videoCount={42}
          timestamp="8:53PM"
          onUnlock={() => {}}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-foreground text-sm font-semibold">Self Messages</h3>
        <CardMessage
          variant="text"
          self={true}
          text="This is my message!"
          timestamp="8:47PM"
        />
        <CardMessage
          variant="video"
          self={true}
          videoSrc="/videos/girl-video.mp4"
          videoPosterSrc="/images/girl-poster.webp"
          videoDuration="0:15"
          timestamp="8:48PM"
        />
        <CardMessage
          variant="image"
          self={true}
          imageSrc="/images/girl-poster.webp"
          timestamp="8:52PM"
          onImageClick={() => {}}
        />
      </div>
    </div>
  );
};

export const AllVariants: Story = {
  args: {
    variant: "text",
  },
  render: () => <AllVariantsTemplate />,
  decorators: [
    (Story) => (
      <div className="w-[800px] p-6">
        <Story />
      </div>
    ),
  ],
};
