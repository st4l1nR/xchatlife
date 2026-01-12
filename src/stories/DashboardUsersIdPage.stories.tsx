import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DashboardUsersIdPage from "@/app/_components/pages/DashboardUsersIdPage";
import type { SnackActivityProps } from "@/app/_components/molecules/SnackActivity";

// Sample activity data for stories
const sampleActivities: SnackActivityProps[] = [
  {
    id: "1",
    category: "chat",
    title: "Started a new conversation",
    description: "Chatted with Luna, the AI companion",
    timestamp: "2 hours ago",
    media: [
      {
        type: "avatar",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        label: "Luna",
        sublabel: "AI Companion",
      },
    ],
  },
  {
    id: "2",
    category: "content",
    title: "Created a new character",
    description: "Added 'Shadow Knight' to their collection",
    timestamp: "5 hours ago",
    media: [
      {
        type: "avatar",
        label: "Shadow Knight",
        sublabel: "Fantasy",
      },
    ],
  },
  {
    id: "3",
    category: "subscription",
    title: "Subscription renewed",
    description: "Monthly Premium plan renewed successfully",
    timestamp: "1 day ago",
    badge: "$9.99/month",
  },
  {
    id: "4",
    category: "media",
    title: "Added to collection",
    description: "Saved 3 new images to favorites",
    timestamp: "2 days ago",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&h=100&fit=crop",
        alt: "Image 1",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
        alt: "Image 2",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop",
        alt: "Image 3",
      },
    ],
  },
  {
    id: "5",
    category: "account",
    title: "Profile updated",
    description: "Changed display name and avatar",
    timestamp: "3 days ago",
  },
  {
    id: "6",
    category: "milestone",
    title: "Achievement unlocked",
    description: "Reached 100 conversations milestone!",
    timestamp: "1 week ago",
    badge: "100 Chats",
  },
];

const manyActivities: SnackActivityProps[] = [
  ...sampleActivities,
  {
    id: "7",
    category: "chat",
    title: "Group conversation started",
    description: "Joined a roleplay session with multiple characters",
    timestamp: "1 week ago",
    media: [
      {
        type: "avatar",
        label: "Luna",
      },
      {
        type: "avatar",
        label: "Shadow",
      },
      {
        type: "avatar",
        label: "Aria",
      },
    ],
    overflowCount: 2,
  },
  {
    id: "8",
    category: "support",
    title: "Support ticket resolved",
    description: "Issue with account sync has been fixed",
    timestamp: "2 weeks ago",
  },
  {
    id: "9",
    category: "affiliate",
    title: "Referral bonus earned",
    description: "Earned $5 credit for referring a friend",
    timestamp: "2 weeks ago",
    badge: "+$5.00",
  },
  {
    id: "10",
    category: "content",
    title: "Visual novel published",
    description: "Published 'The Lost Kingdom' story",
    timestamp: "3 weeks ago",
  },
];

const meta = {
  title: "Pages/DashboardUsersIdPage",
  component: DashboardUsersIdPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DashboardUsersIdPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mock: {
      // Header props
      name: "John Doe",
      avatarSrc:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Premium Member",
      location: "New York, USA",
      joinedDate: "April 2021",
      // Aside props
      fullName: "John Michael Doe",
      status: "Active",
      country: "United States",
      language: "English",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      messagesSent: "13.5k",
      charactersCreated: "42",
      visualNovels: "8",
      collectionItems: "156",
      tokensUsed: "45.2k",
      memberSince: "2021",
      // Activities
      activities: sampleActivities,
    },
  },
};

export const WithoutAvatar: Story = {
  args: {
    mock: {
      name: "Jane Smith",
      role: "Administrator",
      location: "London, UK",
      joinedDate: "January 2023",
      fullName: "Jane Elizabeth Smith",
      status: "Active",
      country: "United Kingdom",
      language: "English",
      email: "jane.smith@example.com",
      messagesSent: "5.2k",
      charactersCreated: "15",
      memberSince: "2023",
      activities: sampleActivities.slice(0, 3),
    },
  },
};

export const MinimalData: Story = {
  args: {
    mock: {
      name: "New User",
      fullName: "New User",
      status: "Active",
      memberSince: "2025",
      activities: [],
    },
  },
};

export const HighActivity: Story = {
  args: {
    mock: {
      name: "Power User",
      avatarSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Creator",
      location: "Tokyo, Japan",
      joinedDate: "December 2019",
      bannerSrc:
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
      fullName: "Power User",
      status: "Active",
      country: "Japan",
      language: "Japanese",
      phone: "+81 90-1234-5678",
      email: "poweruser@example.com",
      messagesSent: "150.2k",
      charactersCreated: "89",
      visualNovels: "24",
      collectionItems: "1.2k",
      tokensUsed: "320.8k",
      memberSince: "2019",
      activities: manyActivities,
    },
  },
};

export const NoActivity: Story = {
  args: {
    mock: {
      name: "Inactive User",
      avatarSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Free Member",
      location: "Paris, France",
      joinedDate: "November 2024",
      fullName: "Inactive User",
      status: "Inactive",
      country: "France",
      language: "French",
      email: "inactive@example.com",
      messagesSent: "0",
      charactersCreated: "0",
      memberSince: "2024",
      activities: [],
    },
  },
};

export const SuspendedUser: Story = {
  args: {
    mock: {
      name: "Suspended Account",
      role: "User",
      location: "Unknown",
      joinedDate: "June 2022",
      fullName: "Suspended Account",
      status: "Suspended",
      country: "Unknown",
      email: "suspended@example.com",
      messagesSent: "2.1k",
      charactersCreated: "5",
      memberSince: "2022",
      activities: sampleActivities.slice(0, 2),
    },
  },
};
