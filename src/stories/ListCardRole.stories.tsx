import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import ListCardRole from "@/app/_components/organisms/ListCardRole";
import type { CardRoleProps } from "@/app/_components/molecules/CardRole";

const sampleAvatars = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

const createUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    avatarSrc: sampleAvatars[i % sampleAvatars.length],
  }));

const sampleRoles: CardRoleProps[] = [
  {
    roleName: "Administrator",
    totalUsers: 4,
    users: createUsers(4),
  },
  {
    roleName: "Editor",
    totalUsers: 7,
    users: createUsers(7),
  },
  {
    roleName: "Viewer",
    totalUsers: 12,
    users: createUsers(7),
  },
  {
    roleName: "Moderator",
    totalUsers: 3,
    users: createUsers(3),
  },
  {
    roleName: "Content Creator",
    totalUsers: 5,
    users: createUsers(5),
  },
  {
    roleName: "Support",
    totalUsers: 2,
    users: createUsers(2),
  },
];

const meta = {
  title: "Organisms/ListCardRole",
  component: ListCardRole,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show loading skeleton state",
    },
    title: {
      control: "text",
      description: "Optional title for the list",
    },
    emptyStateTitle: {
      control: "text",
      description: "Title for empty state",
    },
    emptyStateDescription: {
      control: "text",
      description: "Description for empty state",
    },
    onEditRole: {
      action: "editRole",
      description: "Callback when Edit Role is clicked",
    },
    onCopyRole: {
      action: "copyRole",
      description: "Callback when Copy button is clicked",
    },
  },
  args: {
    onEditRole: fn(),
    onCopyRole: fn(),
  },
} satisfies Meta<typeof ListCardRole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roles: sampleRoles,
  },
};

export const WithTitle: Story = {
  args: {
    title: "User Roles",
    roles: sampleRoles,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    roles: [],
  },
};

export const Empty: Story = {
  args: {
    roles: [],
    emptyStateTitle: "No roles found",
    emptyStateDescription: "Create your first role to get started.",
  },
};

export const SingleRole: Story = {
  args: {
    roles: [sampleRoles[0]!],
  },
};

export const TwoRoles: Story = {
  args: {
    roles: sampleRoles.slice(0, 2),
  },
};

export const ManyRoles: Story = {
  args: {
    title: "All Roles",
    roles: [
      ...sampleRoles,
      {
        roleName: "Developer",
        totalUsers: 8,
        users: createUsers(7),
      },
      {
        roleName: "Designer",
        totalUsers: 4,
        users: createUsers(4),
      },
      {
        roleName: "Manager",
        totalUsers: 2,
        users: createUsers(2),
      },
    ],
  },
};
