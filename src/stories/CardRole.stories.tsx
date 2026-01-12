import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import CardRole from "@/app/_components/molecules/CardRole";

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

const meta = {
  title: "Molecules/CardRole",
  component: CardRole,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    roleName: {
      control: "text",
      description: "Name of the role",
    },
    totalUsers: {
      control: "number",
      description: "Total number of users with this role",
    },
    maxVisibleAvatars: {
      control: "number",
      description:
        "Maximum number of avatars to display before showing overflow",
    },
    onEditRole: {
      action: "editRole",
      description: "Callback when Edit Role is clicked",
    },
    onCopy: {
      action: "copy",
      description: "Callback when Copy button is clicked",
    },
    editRoleHref: {
      control: "text",
      description: "Optional href for Edit Role link",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {
    onEditRole: fn(),
    onCopy: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardRole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Administrator: Story = {
  args: {
    roleName: "Administrator",
    totalUsers: 4,
    users: createUsers(4),
  },
};

export const Editor: Story = {
  args: {
    roleName: "Editor",
    totalUsers: 7,
    users: createUsers(7),
  },
};

export const SingleUser: Story = {
  args: {
    roleName: "Super Admin",
    totalUsers: 1,
    users: createUsers(1),
  },
};

export const ManyUsers: Story = {
  args: {
    roleName: "Viewer",
    totalUsers: 25,
    users: createUsers(7),
    maxVisibleAvatars: 3,
  },
};

export const NoUsers: Story = {
  args: {
    roleName: "Moderator",
    totalUsers: 0,
    users: [],
  },
};

export const WithInitialsOnly: Story = {
  args: {
    roleName: "Content Creator",
    totalUsers: 3,
    users: [
      { id: "1", name: "Alice Brown" },
      { id: "2", name: "Bob Smith" },
      { id: "3", name: "Charlie Davis" },
    ],
  },
};

export const WithEditRoleLink: Story = {
  args: {
    roleName: "Administrator",
    totalUsers: 4,
    users: createUsers(4),
    editRoleHref: "/dashboard/roles/admin/edit",
  },
};
