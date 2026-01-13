import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import AsideUserSummary from "@/app/_components/organisms/AsideUserSummary";

const meta = {
  title: "Organisms/AsideUserSummary",
  component: AsideUserSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fullName: {
      control: "text",
      description: "User's full name",
    },
    status: {
      control: "select",
      options: ["Active", "Inactive", "Suspended"],
      description: "User account status",
    },
    role: {
      control: "text",
      description: "User's role in the system",
    },
    country: {
      control: "text",
      description: "User's country",
    },
    language: {
      control: "text",
      description: "User's preferred language",
    },
    phone: {
      control: "text",
      description: "User's phone number",
    },
    email: {
      control: "text",
      description: "User's email address",
    },
    messagesSent: {
      control: "text",
      description: "Total messages sent",
    },
    charactersCreated: {
      control: "text",
      description: "Total characters created",
    },
    visualNovels: {
      control: "text",
      description: "Total visual novels",
    },
    collectionItems: {
      control: "text",
      description: "Total collection items",
    },
    tokensUsed: {
      control: "text",
      description: "Tokens used this period",
    },
    memberSince: {
      control: "text",
      description: "Year user joined",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsideUserSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// STORIES
// ============================================

export const Default: Story = {
  args: {
    fullName: "John Doe",
    status: "Active",
    role: "Developer",
    country: "USA",
    language: "English",
    phone: "(123) 456-7890",
    email: "John.doe@example.com",
    messagesSent: "13.5k",
    charactersCreated: "13.5k",
    visualNovels: "13.5k",
    collectionItems: "13.5k",
    tokensUsed: "13.5k",
    memberSince: "2020",
  },
};

export const AboutOnly: Story = {
  name: "About Section Only",
  args: {
    fullName: "Jane Smith",
    status: "Active",
    role: "Designer",
    country: "Canada",
    language: "French",
  },
};

export const ContactsOnly: Story = {
  name: "Contacts Section Only",
  args: {
    phone: "(555) 123-4567",
    email: "contact@example.com",
  },
};

export const OverviewOnly: Story = {
  name: "Overview Section Only",
  args: {
    messagesSent: "5.2k",
    charactersCreated: "42",
    visualNovels: "8",
    collectionItems: "156",
    tokensUsed: "2.1k",
    memberSince: "2023",
  },
};

export const PartialAbout: Story = {
  name: "Partial About Data",
  args: {
    fullName: "Alex Johnson",
    status: "Inactive",
    role: "Writer",
  },
};

export const PartialOverview: Story = {
  name: "Partial Overview Data",
  args: {
    fullName: "Sarah Connor",
    status: "Active",
    role: "Admin",
    messagesSent: "1.2k",
    charactersCreated: "5",
    memberSince: "2022",
  },
};

export const InactiveUser: Story = {
  args: {
    fullName: "Mike Wilson",
    status: "Inactive",
    role: "Viewer",
    country: "UK",
    language: "English",
    email: "mike@example.com",
    messagesSent: "0",
    charactersCreated: "0",
    memberSince: "2024",
  },
};

export const SuspendedUser: Story = {
  args: {
    fullName: "Suspended Account",
    status: "Suspended",
    role: "User",
    country: "Germany",
    language: "German",
    email: "suspended@example.com",
  },
};

export const MinimalData: Story = {
  args: {
    fullName: "New User",
    status: "Active",
    memberSince: "2025",
  },
};

export const HighActivityUser: Story = {
  args: {
    fullName: "Power User",
    status: "Active",
    role: "Creator",
    country: "Japan",
    language: "Japanese",
    phone: "+81 90-1234-5678",
    email: "poweruser@example.com",
    messagesSent: "150.2k",
    charactersCreated: "89",
    visualNovels: "24",
    collectionItems: "1.2k",
    tokensUsed: "45.8k",
    memberSince: "2019",
  },
};
