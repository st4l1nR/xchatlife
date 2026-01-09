import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CardMessageProps } from "@/app/_components/molecules/CardMessage";
import ChatRoom from "@/app/_components/organisms/ChatRoom";

// Mock messages for stories
const mockMessages: CardMessageProps[] = [
  {
    id: "1",
    variant: "text",
    self: false,
    text: "Omigosh, hi! I'm Savannah from the cheer squad. Just finished practice and like, totally need someone interesting to talk to.",
    audioSrc: "/audio/girl-voice.mp3",
    timestamp: "8:46PM",
  },
  {
    id: "2",
    variant: "text",
    self: true,
    text: "Send me a video of you",
    timestamp: "8:47PM",
  },
  {
    id: "3",
    variant: "video",
    self: false,
    videoSrc: "/videos/girl-video.mp4",
    videoPosterSrc: "/images/girl-poster.webp",
    videoDuration: "0:10",
    timestamp: "8:48PM",
  },
  {
    id: "4",
    variant: "text",
    self: true,
    text: "Wow, you look amazing!",
    timestamp: "8:49PM",
  },
  {
    id: "5",
    variant: "image",
    self: false,
    imageSrc: "/images/girl-poster.webp",
    imageAlt: "Cheerleader photo",
    timestamp: "8:51PM",
  },
  {
    id: "6",
    variant: "text",
    self: false,
    text: "Thanks! Here's something special just for you...",
    timestamp: "8:52PM",
  },
  {
    id: "7",
    variant: "private-content",
    self: false,
    previewSrc: "/images/girl-poster.webp",
    tokenCost: 120,
    contentDescription: "Caught in the lockerroom",
    imageCount: 2,
    videoCount: 24,
    timestamp: "8:53PM",
  },
];

const meta = {
  title: "Organisms/ChatRoom",
  component: ChatRoom,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    characterName: {
      control: "text",
      description: "Name of the character",
    },
    characterAvatarSrc: {
      control: "text",
      description: "URL of the character avatar",
    },
    showBackButton: {
      control: "boolean",
      description: "Show back button for mobile navigation",
    },
    loading: {
      control: "boolean",
      description: "Show loading skeleton for messages",
    },
    inputDisabled: {
      control: "boolean",
      description: "Disable the message input",
    },
  },
  args: {
    onSendMessage: (message: string) => console.log("Send message:", message),
    onBack: () => console.log("Back clicked"),
    onClickPrivateContent: () => console.log("Private content clicked"),
    onCallClick: () => console.log("Call clicked"),
    onAddToFavorites: () => console.log("Add to favorites clicked"),
    onResetChat: () => console.log("Reset chat clicked"),
    onDeleteChat: () => console.log("Delete chat clicked"),
    onExpand: () => console.log("Expand clicked"),
  },
  decorators: [
    (Story) => (
      <div className="bg-background h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatRoom>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default
// ============================================================================
export const Default: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: mockMessages,
  },
};

// ============================================================================
// With Back Button (Mobile)
// ============================================================================
export const WithBackButton: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: mockMessages,
    showBackButton: true,
  },
};

// ============================================================================
// Loading State
// ============================================================================
export const Loading: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: [],
    loading: true,
  },
};

// ============================================================================
// Empty Chat
// ============================================================================
export const EmptyChat: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: [],
  },
};

// ============================================================================
// Input Disabled
// ============================================================================
export const InputDisabled: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: mockMessages,
    inputDisabled: true,
  },
};

// ============================================================================
// Without Avatar
// ============================================================================
export const WithoutAvatar: Story = {
  args: {
    characterName: "Jessica",
    messages: mockMessages,
  },
};

// ============================================================================
// Few Messages
// ============================================================================
export const FewMessages: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: mockMessages.slice(0, 2),
  },
};

// ============================================================================
// Text Only Messages
// ============================================================================
export const TextOnlyMessages: Story = {
  args: {
    characterName: "Savannah",
    characterAvatarSrc: "/images/girl-poster.webp",
    messages: [
      {
        id: "1",
        variant: "text",
        self: false,
        text: "Hey! How are you doing today?",
        timestamp: "8:46PM",
      },
      {
        id: "2",
        variant: "text",
        self: true,
        text: "I'm doing great! Just finished work.",
        timestamp: "8:47PM",
      },
      {
        id: "3",
        variant: "text",
        self: false,
        text: "That's awesome! Any plans for the evening?",
        timestamp: "8:48PM",
      },
      {
        id: "4",
        variant: "text",
        self: true,
        text: "Thinking about watching a movie. Any recommendations?",
        timestamp: "8:49PM",
      },
      {
        id: "5",
        variant: "text",
        self: false,
        text: "Oh definitely! Have you seen the new sci-fi one everyone's talking about? It's supposed to be amazing!",
        timestamp: "8:50PM",
      },
    ],
  },
};
