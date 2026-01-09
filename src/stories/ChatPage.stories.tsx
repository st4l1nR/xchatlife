import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { SnackChatProps } from "@/app/_components/molecules/SnackChat";
import type { CardMessageProps } from "@/app/_components/molecules/CardMessage";
import type { AsideCharacterSummaryProps } from "@/app/_components/organisms/AsideCharacterSummary";
import type { CardPrivateContentProps } from "@/app/_components/molecules/CardPrivateContent";
import ChatPage from "@/app/_components/pages/ChatPage";

// Mock chats data
const mockChats: SnackChatProps[] = [
  {
    id: "1",
    name: "Savannah Carter",
    message: "Can I see your pussy on a...",
    timestamp: "2:43AM",
    avatarSrc: "/images/girl-poster.webp",
    isRead: false,
  },
  {
    id: "2",
    name: "Selene Morrow",
    message: "SEND ME PRIVATE CONENT",
    timestamp: "3:38AM",
    avatarSrc: "/images/girl-poster.webp",
    isRead: false,
  },
  {
    id: "3",
    name: "Erik Johansson",
    message: "Hey there! Just analyzing ...",
    timestamp: "1:44PM",
    avatarSrc: "/images/girl-poster.webp",
    isRead: true,
  },
  {
    id: "4",
    name: "Darkangel666",
    message: "OMG, you're real! I can't b...",
    timestamp: "11:13AM",
    avatarSrc: "/images/girl-poster.webp",
    isRead: true,
  },
  {
    id: "5",
    name: "Luna",
    message: "Thanks for the amazing chat!",
    timestamp: "Yesterday",
    avatarSrc: "/images/girl-poster.webp",
    isRead: true,
  },
];

// Mock messages data
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

// Mock private content data
const mockPrivateContent: CardPrivateContentProps[] = [
  {
    imageSrc: "/images/girl-poster.webp",
    description: "Caught in the lockerroom",
    likeCount: 245,
    imageCount: 5,
    locked: true,
    tokenCost: 120,
  },
  {
    imageSrc: "/images/girl-poster.webp",
    description: "Late night photoshoot",
    likeCount: 189,
    imageCount: 8,
    locked: true,
    tokenCost: 150,
  },
  {
    imageSrc: "/images/girl-poster.webp",
    description: "Beach day vibes",
    likeCount: 312,
    imageCount: 12,
    locked: false,
    media: [
      { id: "1", type: "image", src: "/images/girl-poster.webp" },
      { id: "2", type: "image", src: "/images/girl-poster.webp" },
      { id: "3", type: "image", src: "/images/girl-poster.webp" },
    ],
  },
  {
    imageSrc: "/images/girl-poster.webp",
    description: "Behind the scenes",
    likeCount: 156,
    imageCount: 3,
    locked: true,
    tokenCost: 80,
  },
  {
    imageSrc: "/images/girl-poster.webp",
    description: "Exclusive content",
    likeCount: 421,
    imageCount: 15,
    locked: true,
    tokenCost: 200,
  },
  {
    imageSrc: "/images/girl-poster.webp",
    description: "Morning routine",
    likeCount: 98,
    imageCount: 6,
    locked: false,
    media: [
      { id: "1", type: "image", src: "/images/girl-poster.webp" },
      {
        id: "2",
        type: "video",
        src: "/videos/girl-video.mp4",
        thumbnailSrc: "/images/girl-poster.webp",
      },
    ],
  },
];

// Mock character data
const mockCharacter: Omit<AsideCharacterSummaryProps, "className"> = {
  name: "Selene Morrow",
  isVerified: true,
  description:
    "An alternative goth girl who recently dropped out of school to pursue a career as an alternative model while working...",
  media: [
    { id: "1", type: "image", src: "/images/girl-poster.webp" },
    { id: "2", type: "image", src: "/images/girl-poster.webp" },
    {
      id: "3",
      type: "video",
      src: "/videos/girl-video.mp4",
      posterSrc: "/images/girl-poster.webp",
    },
  ],
  isLiked: false,
  about: {
    age: 22,
    bodyType: "Slim",
    ethnicity: "Caucasian",
    language: "English",
    relationshipStatus: "Single",
    occupation: "Model",
    hobbies: "Photography, Music",
    personality: "Mysterious, Creative",
  },
};

const meta = {
  title: "Pages/ChatPage",
  component: ChatPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background h-screen w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default (Desktop - 3 columns)
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      chats: mockChats,
      messages: mockMessages,
      character: mockCharacter,
      privateContent: mockPrivateContent,
    },
  },
};

// ============================================================================
// Empty Chats
// ============================================================================
export const EmptyChats: Story = {
  args: {
    mock: {
      chats: [],
      messages: [],
      character: mockCharacter,
      privateContent: mockPrivateContent,
    },
  },
};

// ============================================================================
// Many Chats
// ============================================================================
export const ManyChats: Story = {
  args: {
    mock: {
      chats: [
        ...mockChats,
        {
          id: "6",
          name: "Crystal",
          message: "Can't wait to see you again!",
          timestamp: "2 days ago",
          avatarSrc: "/images/girl-poster.webp",
          isRead: true,
        },
        {
          id: "7",
          name: "Aurora",
          message: "That was so fun yesterday!",
          timestamp: "3 days ago",
          avatarSrc: "/images/girl-poster.webp",
          isRead: true,
        },
        {
          id: "8",
          name: "Violet",
          message: "Miss you already...",
          timestamp: "4 days ago",
          avatarSrc: "/images/girl-poster.webp",
          isRead: true,
        },
        {
          id: "9",
          name: "Scarlett",
          message: "Let's chat again soon!",
          timestamp: "5 days ago",
          avatarSrc: "/images/girl-poster.webp",
          isRead: true,
        },
        {
          id: "10",
          name: "Jade",
          message: "You're the best!",
          timestamp: "1 week ago",
          avatarSrc: "/images/girl-poster.webp",
          isRead: true,
        },
      ],
      messages: mockMessages,
      character: mockCharacter,
      privateContent: mockPrivateContent,
    },
  },
};

// ============================================================================
// Mobile View (use viewport controls)
// ============================================================================
export const MobileView: Story = {
  args: {
    mock: {
      chats: mockChats,
      messages: mockMessages,
      character: mockCharacter,
      privateContent: mockPrivateContent,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// ============================================================================
// Tablet View (use viewport controls)
// ============================================================================
export const TabletView: Story = {
  args: {
    mock: {
      chats: mockChats,
      messages: mockMessages,
      character: mockCharacter,
      privateContent: mockPrivateContent,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
