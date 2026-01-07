import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "@/app/_components/atoms/avatar";
import { Badge } from "@/app/_components/atoms/badge";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/app/_components/atoms/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/atoms/table";

const meta = {
  title: "Atoms/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const users = [
  {
    name: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    role: "Owner",
    team: "Product",
  },
  {
    name: "Floyd Miles",
    title: "Principal Designer",
    email: "floyd.miles@example.com",
    role: "Owner",
    team: "Product",
  },
  {
    name: "Emily Selman",
    title: "VP, User Experience",
    email: "emily.selman@example.com",
    role: "Admin",
    team: "Product",
  },
  {
    name: "Kristin Watson",
    title: "Lead Developer",
    email: "kristin.watson@example.com",
    role: "Admin",
    team: "Development",
  },
  {
    name: "Emma Webb",
    title: "Human Resources",
    email: "emma.webb@example.com",
    role: "Member",
    team: "Human Resources",
  },
];

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Title</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Role</TableHeader>
          <TableHeader />
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.email}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.title}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="text-right">
              <a href="#">Edit</a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  ...Default,
  args: {
    striped: true,
  },
};

export const Grid: Story = {
  ...Default,
  args: {
    grid: true,
  },
};

export const Dense: Story = {
  ...Default,
  args: {
    dense: true,
  },
};

export const Bleed: Story = {
  ...Default,
  args: {
    bleed: true,
  },
};

export const WithVerticalBorders: Story = {
  ...Default,
  args: {
    grid: true,
    className: "[&_td]:first:border-l-0 [&_td]:last:border-r-0",
  },
};

export const WithAvatarsAndBadges: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Team</TableHeader>
          <TableHeader />
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.email}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Avatar
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                  className="size-10"
                />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge color="lime">{user.team}</Badge>
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisHorizontalIcon />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
