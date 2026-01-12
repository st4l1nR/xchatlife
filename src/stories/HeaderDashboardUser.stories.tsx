import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HeaderDashboardUser from "@/app/_components/organisms/HeaderDashboardUser";

const meta = {
  title: "Organisms/HeaderDashboardUser",
  component: HeaderDashboardUser,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "User display name",
    },
    avatarSrc: {
      control: "text",
      description: "URL for user avatar image",
    },
    role: {
      control: "text",
      description: "User role label",
    },
    location: {
      control: "text",
      description: "User location",
    },
    joinedDate: {
      control: "text",
      description: "Formatted join date (e.g., 'April 2021')",
    },
    bannerSrc: {
      control: "text",
      description: "Optional custom banner image URL",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderDashboardUser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "John Doe",
    avatarSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Customer",
    location: "Vatican City",
    joinedDate: "April 2021",
  },
};

export const WithoutAvatar: Story = {
  args: {
    name: "Jane Smith",
    role: "Administrator",
    location: "New York",
    joinedDate: "January 2023",
  },
};

export const MinimalInfo: Story = {
  args: {
    name: "Anonymous User",
  },
};

export const WithCustomBanner: Story = {
  args: {
    name: "Creative User",
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Creator",
    location: "Los Angeles",
    joinedDate: "March 2024",
    bannerSrc:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
  },
};

export const LongName: Story = {
  args: {
    name: "Alexander Maximilian von Hohenzollern III",
    avatarSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Premium Member",
    location: "Munich, Germany",
    joinedDate: "December 2020",
  },
};
