import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flame, Trophy } from "lucide-react";

import ListSnackActivity from "@/app/_components/organisms/ListSnackActivity";
import type { SnackActivityProps } from "@/app/_components/molecules/SnackActivity";

const meta = {
  title: "Organisms/ListSnackActivity",
  component: ListSnackActivity,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
    title: {
      control: "text",
      description: "Optional header title",
    },
    emptyStateTitle: {
      control: "text",
      description: "Title shown when no activities",
    },
    emptyStateDescription: {
      control: "text",
      description: "Description shown when no activities",
    },
    onSelectActivity: {
      action: "selectActivity",
      description: "Callback when an activity is clicked",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[450px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListSnackActivity>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockAvatar = "/images/girl-poster.webp";
const mockImage = "/images/girl-poster.webp";

const mockActivities: SnackActivityProps[] = [
  {
    id: "1",
    category: "chat",
    title: "Started a new chat",
    description: "Began conversation with Luna",
    timestamp: "2 min ago",
    media: [
      {
        type: "avatar",
        src: mockAvatar,
        label: "Marisol",
        sublabel: "Spicy",
      },
    ],
  },
  {
    id: "2",
    category: "chat",
    title: "Sent 50 messages",
    description: "Daily messaging milestone reached",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    category: "chat",
    title: "Received voice message",
    description: "Luna sent you a 0:45 audio response",
    timestamp: "3 hours ago",
  },
  {
    id: "4",
    category: "content",
    title: "Created new character",
    description: "Maya has been added to your characters",
    timestamp: "2 min ago",
    media: [
      {
        type: "avatar",
        src: mockAvatar,
        label: "Maya",
        sublabel: "Spicy",
      },
    ],
  },
  {
    id: "5",
    category: "content",
    title: "Published character",
    description: "Luna is now public and visible to others",
    timestamp: "2 min ago",
    media: [
      {
        type: "avatar",
        src: mockAvatar,
        label: "Luna",
        sublabel: "Spicy",
      },
    ],
  },
  {
    id: "6",
    category: "content",
    title: "Created visual novel",
    description: '"Summer Romance" draft saved 3 scenes.',
    timestamp: "2 Day Ago",
    media: [
      { type: "avatar", src: mockAvatar, label: "Character 1" },
      { type: "avatar", src: mockAvatar, label: "Character 2" },
      { type: "avatar", src: mockAvatar, label: "Character 3" },
    ],
    overflowCount: 3,
  },
  {
    id: "7",
    category: "media",
    title: "Saved to collection",
    description: "Added 3 images from chat with Luna",
    timestamp: "2 Day Ago",
  },
  {
    id: "8",
    category: "media",
    title: "Uploaded media",
    description: 'Added 5 files to "Backgrounds" folder',
    timestamp: "2 Day Ago",
  },
  {
    id: "9",
    category: "media",
    title: "Generated image",
    description: "AI image created in chat",
    timestamp: "2 Day Ago",
    media: [
      {
        type: "image",
        src: mockImage,
        alt: "Generated AI image",
      },
    ],
  },
  {
    id: "10",
    category: "subscription",
    title: "Subscription activated",
    description: "Premium monthly plan is now active",
    timestamp: "1 hour ago",
  },
  {
    id: "11",
    category: "subscription",
    title: "Payment successful",
    description: "$9.99 charged for Premium Monthly",
    timestamp: "1 hour ago",
  },
  {
    id: "12",
    category: "subscription",
    title: "Plan upgraded",
    description: "Upgraded from Monthly to Annual plan",
    timestamp: "1 hour ago",
  },
];

// ============================================
// STORIES
// ============================================

export const Default: Story = {
  args: {
    activities: mockActivities,
  },
};

export const WithTitle: Story = {
  args: {
    title: "Activity Timeline",
    activities: mockActivities,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    activities: [],
  },
};

export const Empty: Story = {
  args: {
    activities: [],
    emptyStateTitle: "No activity yet",
    emptyStateDescription:
      "Your activity history will appear here once you start using the app.",
  },
};

export const ChatActivitiesOnly: Story = {
  args: {
    title: "Chat & Messaging",
    activities: mockActivities.filter((a) => a.category === "chat"),
  },
};

export const ContentActivitiesOnly: Story = {
  args: {
    title: "Content Creation",
    activities: mockActivities.filter((a) => a.category === "content"),
  },
};

export const MediaActivitiesOnly: Story = {
  args: {
    title: "Media & Collections",
    activities: mockActivities.filter((a) => a.category === "media"),
  },
};

export const SubscriptionActivitiesOnly: Story = {
  args: {
    title: "Subscription & Billing",
    activities: mockActivities.filter((a) => a.category === "subscription"),
  },
};

export const MixedCategories: Story = {
  name: "Mixed Categories (Full Timeline)",
  args: {
    title: "Activity Timeline",
    activities: [
      {
        id: "1",
        category: "chat",
        title: "Started a new chat",
        description: "Began conversation with Luna",
        timestamp: "2 min ago",
        media: [
          {
            type: "avatar",
            src: mockAvatar,
            label: "Marisol",
            sublabel: "Spicy",
          },
        ],
      },
      {
        id: "2",
        category: "content",
        title: "Created new character",
        description: "Maya has been added to your characters",
        timestamp: "12 min ago",
        media: [
          {
            type: "avatar",
            src: mockAvatar,
            label: "Maya",
            sublabel: "Anime",
          },
        ],
      },
      {
        id: "3",
        category: "media",
        title: "Generated image",
        description: "AI image created in chat",
        timestamp: "30 min ago",
        media: [
          {
            type: "image",
            src: mockImage,
            alt: "Generated image",
          },
        ],
      },
      {
        id: "4",
        category: "subscription",
        title: "Subscription activated",
        description: "Premium monthly plan is now active",
        timestamp: "1 hour ago",
      },
      {
        id: "5",
        category: "support",
        title: "Ticket reply received",
        description: "Support team responded to your ticket",
        timestamp: "2 hours ago",
      },
      {
        id: "6",
        category: "affiliate",
        title: "Commission earned",
        description: "Earned $4.99 from referral conversion",
        timestamp: "3 days ago",
      },
      {
        id: "7",
        category: "account",
        title: "Password changed",
        description: "Your password was successfully updated",
        timestamp: "5 days ago",
      },
      {
        id: "8",
        category: "milestone",
        title: "30-day streak",
        description: "Logged in for 30 consecutive days",
        timestamp: "1 week ago",
        badge: "30 days",
        badgeIcon: <Flame className="size-3" />,
      },
    ],
  },
};

export const WithMilestones: Story = {
  name: "With Milestones & Achievements",
  args: {
    title: "Achievements",
    activities: [
      {
        id: "1",
        category: "milestone",
        title: "Reached 1,000 messages",
        description: "You've sent 1,000 messages total!",
        timestamp: "Just now",
        badge: "Chat Enthusiast",
        badgeIcon: <Trophy className="size-3" />,
      },
      {
        id: "2",
        category: "milestone",
        title: "30-day streak",
        description: "Logged in for 30 consecutive days",
        timestamp: "2 days ago",
        badge: "30 days",
        badgeIcon: <Flame className="size-3" />,
      },
      {
        id: "3",
        category: "milestone",
        title: "First visual novel published",
        description: "Congratulations on your first publication!",
        timestamp: "1 week ago",
        badge: '"Summer Romance"',
      },
      {
        id: "4",
        category: "milestone",
        title: "Created 10 characters",
        description: "You've created 10 unique characters!",
        timestamp: "2 weeks ago",
        badge: "Character Creator",
        badgeIcon: <Trophy className="size-3" />,
      },
    ],
  },
};

export const SingleItem: Story = {
  name: "Single Item (No Timeline Line)",
  args: {
    activities: [
      {
        id: "1",
        category: "chat",
        title: "Started a new chat",
        description: "Began conversation with Luna",
        timestamp: "2 min ago",
        media: [
          {
            type: "avatar",
            src: mockAvatar,
            label: "Marisol",
            sublabel: "Spicy",
          },
        ],
      },
    ],
  },
};
