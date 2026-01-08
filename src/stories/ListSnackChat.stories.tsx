import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ListSnackChat from "@/app/_components/organisms/ListSnackChat";
import type { SnackChatProps } from "@/app/_components/molecules/SnackChat";

const meta = {
  title: "Organisms/ListSnackChat",
  component: ListSnackChat,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Shows loading skeleton when true",
    },
    showActions: {
      control: "boolean",
      description: "Show/hide action buttons on all chat items",
    },
    title: {
      control: "text",
      description: "Optional title displayed above the list",
    },
    showSearch: {
      control: "boolean",
      description: "Show/hide search input for filtering by name",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for search input",
    },
    emptyStateTitle: {
      control: "text",
      description: "Title shown when no chats",
    },
    emptyStateDescription: {
      control: "text",
      description: "Description shown when no chats",
    },
    onSelectChat: {
      action: "selectChat",
      description: "Called when a chat item is clicked",
    },
    onReplyChat: {
      action: "replyChat",
      description: "Called when reply button is clicked",
    },
    onDeleteChat: {
      action: "deleteChat",
      description: "Called when delete button is clicked",
    },
  },
} satisfies Meta<typeof ListSnackChat>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

const mockChats: SnackChatProps[] = [
  {
    id: "1",
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
    isRead: false,
  },
  {
    id: "2",
    name: "Sophie Chen",
    message: "Hey! Are you free tonight?",
    timestamp: "9:30PM",
    avatarSrc: mockImage,
    isRead: false,
  },
  {
    id: "3",
    name: "Emma Wilson",
    message:
      "That sounds amazing! I really enjoyed our conversation yesterday.",
    timestamp: "8:15PM",
    avatarSrc: mockImage,
    isRead: true,
  },
  {
    id: "4",
    name: "Olivia Martinez",
    message: "Can't wait to see you!",
    timestamp: "7:45PM",
    avatarSrc: mockImage,
    isRead: true,
  },
  {
    id: "5",
    name: "Mia Johnson",
    message: "Thanks for the help!",
    timestamp: "6:20PM",
    avatarSrc: mockImage,
    isRead: true,
  },
];

const manyChats: SnackChatProps[] = [
  ...mockChats,
  {
    id: "6",
    name: "Ava Brown",
    message: "Did you see the latest episode?",
    timestamp: "5:00PM",
    avatarSrc: mockImage,
    isRead: true,
  },
  {
    id: "7",
    name: "Isabella Davis",
    message: "Let me know when you're available",
    timestamp: "4:30PM",
    avatarSrc: mockImage,
    isRead: true,
  },
  {
    id: "8",
    name: "Charlotte Garcia",
    message: "That's so funny!",
    timestamp: "3:15PM",
    avatarSrc: mockImage,
    isRead: true,
  },
  {
    id: "9",
    name: "Amelia Rodriguez",
    message: "I'll be there in 10 minutes",
    timestamp: "2:45PM",
    avatarSrc: mockImage,
    isRead: true,
  },
  {
    id: "10",
    name: "Harper Lee",
    message: "Thanks for everything!",
    timestamp: "1:30PM",
    avatarSrc: mockImage,
    isRead: true,
  },
];

// --- Stories ---

export const Default: Story = {
  args: {
    chats: mockChats,
  },
};

export const Loading: Story = {
  name: "Loading State",
  args: {
    chats: [],
    loading: true,
  },
};

export const Empty: Story = {
  name: "Empty State",
  args: {
    chats: [],
    loading: false,
  },
};

export const EmptyCustomMessage: Story = {
  name: "Empty with Custom Message",
  args: {
    chats: [],
    loading: false,
    emptyStateTitle: "No messages yet",
    emptyStateDescription:
      "When you start a conversation, it will appear here.",
  },
};

export const WithActions: Story = {
  args: {
    chats: mockChats,
    showActions: true,
  },
};

export const WithoutActions: Story = {
  args: {
    chats: mockChats,
    showActions: false,
  },
};

export const WithTitle: Story = {
  args: {
    chats: mockChats,
    title: "Chat",
  },
};

export const WithSearch: Story = {
  args: {
    chats: mockChats,
    showSearch: true,
  },
};

export const WithTitleAndSearch: Story = {
  name: "With Title and Search",
  args: {
    chats: mockChats,
    title: "Chat",
    showSearch: true,
  },
};

export const MixedReadStates: Story = {
  args: {
    chats: [
      {
        id: "1",
        name: "Luna Moreno",
        message: "New message from Luna!",
        timestamp: "Just now",
        avatarSrc: mockImage,
        isRead: false,
      },
      {
        id: "2",
        name: "Sophie Chen",
        message: "Another new message",
        timestamp: "5m ago",
        avatarSrc: mockImage,
        isRead: false,
      },
      {
        id: "3",
        name: "Emma Wilson",
        message: "This one has been read",
        timestamp: "1h ago",
        avatarSrc: mockImage,
        isRead: true,
      },
      {
        id: "4",
        name: "Olivia Martinez",
        message: "Also read this one",
        timestamp: "2h ago",
        avatarSrc: mockImage,
        isRead: true,
      },
    ],
  },
};

export const SingleChat: Story = {
  args: {
    chats: [
      {
        id: "1",
        name: "Luna Moreno",
        message: "Oh! Sorry, I was lost in this...",
        timestamp: "10:50PM",
        avatarSrc: mockImage,
        isRead: false,
      },
    ],
  },
};

export const ManyChats: Story = {
  name: "Many Chats (Scrollable)",
  args: {
    chats: manyChats,
  },
  decorators: [
    (Story) => (
      <div className="h-96 overflow-y-auto">
        <Story />
      </div>
    ),
  ],
};

export const LoadingWithoutActions: Story = {
  args: {
    chats: [],
    loading: true,
    showActions: false,
  },
};

export const AllStates: Story = {
  name: "All States Overview",
  args: {
    chats: mockChats,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default (With Actions)
        </h3>
        <div className="max-w-md">
          <ListSnackChat chats={mockChats.slice(0, 3)} showActions={true} />
        </div>
      </div>
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Without Actions
        </h3>
        <div className="max-w-md">
          <ListSnackChat chats={mockChats.slice(0, 3)} showActions={false} />
        </div>
      </div>
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Loading State
        </h3>
        <div className="max-w-md">
          <ListSnackChat chats={[]} loading={true} />
        </div>
      </div>
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Empty State
        </h3>
        <div className="max-w-md">
          <ListSnackChat chats={[]} loading={false} />
        </div>
      </div>
    </div>
  ),
};
