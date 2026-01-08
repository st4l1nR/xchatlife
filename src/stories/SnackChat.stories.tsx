import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SnackChat from "@/app/_components/molecules/SnackChat";

const meta = {
  title: "Molecules/SnackChat",
  component: SnackChat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name of the chat participant",
    },
    message: {
      control: "text",
      description: "Preview of the last message",
    },
    timestamp: {
      control: "text",
      description: "Time of the last message",
    },
    avatarSrc: {
      control: "text",
      description: "Image source URL for the avatar",
    },
    avatarAlt: {
      control: "text",
      description: "Alt text for the avatar image",
    },
    href: {
      control: "text",
      description: "Link destination when chat item is clicked",
    },
    isRead: {
      control: "boolean",
      description: "Whether the message has been read (changes styling)",
    },
    showActions: {
      control: "boolean",
      description: "Whether to show reply and delete action buttons",
    },
    onReply: {
      action: "reply",
      description: "Callback when reply button is clicked",
    },
    onDelete: {
      action: "delete",
      description: "Callback when delete button is clicked",
    },
    onClick: {
      action: "click",
      description: "Callback when chat item is clicked (if no href)",
    },
  },
} satisfies Meta<typeof SnackChat>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";

// --- Stories ---

export const Default: Story = {
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
  },
};

export const Unread: Story = {
  name: "Unread Message",
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
    isRead: false,
  },
};

export const Read: Story = {
  name: "Read Message",
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
    isRead: true,
  },
};

export const WithActions: Story = {
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
    showActions: true,
  },
};

export const WithoutActions: Story = {
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
    showActions: false,
  },
};

export const Clickable: Story = {
  name: "Clickable (with href)",
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
    href: "/chat/luna",
  },
};

export const LongMessage: Story = {
  name: "Long Message (Truncation)",
  args: {
    name: "Luna Moreno",
    message:
      "Hey! I just wanted to let you know that I finished the project we were working on together. It took a while but I think it turned out really well. Let me know when you have time to review it!",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
  },
};

export const LongName: Story = {
  name: "Long Name (Truncation)",
  args: {
    name: "Alexandria Constantinopolous-Smithington III",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
  },
};

export const ReadVsUnread: Story = {
  name: "Read vs Unread States",
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
  },
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <p className="text-muted-foreground mb-2 text-sm font-medium">Unread</p>
      <SnackChat
        name="Luna Moreno"
        message="Oh! Sorry, I was lost in this..."
        timestamp="10:50PM"
        avatarSrc={mockImage}
        isRead={false}
      />
      <p className="text-muted-foreground mt-4 mb-2 text-sm font-medium">
        Read
      </p>
      <SnackChat
        name="Luna Moreno"
        message="Oh! Sorry, I was lost in this..."
        timestamp="10:50PM"
        avatarSrc={mockImage}
        isRead={true}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
  },
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default (Unread with Actions)
        </h3>
        <SnackChat
          name="Luna Moreno"
          message="Oh! Sorry, I was lost in this..."
          timestamp="10:50PM"
          avatarSrc={mockImage}
          isRead={false}
          showActions={true}
        />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Read with Actions
        </h3>
        <SnackChat
          name="Sophie Chen"
          message="Hey! Are you free tonight?"
          timestamp="9:30PM"
          avatarSrc={mockImage}
          isRead={true}
          showActions={true}
        />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Without Actions
        </h3>
        <SnackChat
          name="Emma Wilson"
          message="That sounds amazing!"
          timestamp="8:15PM"
          avatarSrc={mockImage}
          showActions={false}
        />
      </div>
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Clickable (Link)
        </h3>
        <SnackChat
          name="Olivia Martinez"
          message="Can't wait to see you!"
          timestamp="7:45PM"
          avatarSrc={mockImage}
          href="/chat/olivia"
        />
      </div>
    </div>
  ),
};

export const ChatList: Story = {
  name: "Chat List (Typical Usage)",
  args: {
    name: "Luna Moreno",
    message: "Oh! Sorry, I was lost in this...",
    timestamp: "10:50PM",
    avatarSrc: mockImage,
  },
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <SnackChat
        name="Luna Moreno"
        message="Oh! Sorry, I was lost in this..."
        timestamp="10:50PM"
        avatarSrc={mockImage}
        isRead={false}
        href="/chat/luna"
      />
      <SnackChat
        name="Sophie Chen"
        message="Hey! Are you free tonight?"
        timestamp="9:30PM"
        avatarSrc={mockImage}
        isRead={false}
        href="/chat/sophie"
      />
      <SnackChat
        name="Emma Wilson"
        message="That sounds amazing! I really enjoyed our conversation yesterday."
        timestamp="8:15PM"
        avatarSrc={mockImage}
        isRead={true}
        href="/chat/emma"
      />
      <SnackChat
        name="Olivia Martinez"
        message="Can't wait to see you!"
        timestamp="7:45PM"
        avatarSrc={mockImage}
        isRead={true}
        href="/chat/olivia"
      />
      <SnackChat
        name="Mia Johnson"
        message="Thanks for the help!"
        timestamp="6:20PM"
        avatarSrc={mockImage}
        isRead={true}
        href="/chat/mia"
      />
    </div>
  ),
};
