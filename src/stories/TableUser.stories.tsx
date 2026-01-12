import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableUser, {
  type TableUserItem,
} from "../app/_components/organisms/TableUser";

const meta: Meta<typeof TableUser> = {
  title: "Organisms/TableUser",
  component: TableUser,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onDelete: { action: "delete" },
    onView: { action: "view" },
    onMore: { action: "more" },
    onPageChange: { action: "pageChange" },
  },
};

export default meta;
type Story = StoryObj<typeof TableUser>;

const mockUsers: TableUserItem[] = [
  {
    id: "1",
    name: "Jordan Stevenson",
    username: "jordan.stevenson",
    avatarSrc: "https://i.pravatar.cc/150?u=jordan",
    role: "admin",
    subscription: "yearly",
    status: "pending",
  },
  {
    id: "2",
    name: "Richard Payne",
    username: "richard247",
    avatarSrc: "https://i.pravatar.cc/150?u=richard",
    role: "admin",
    subscription: "monthly",
    status: "active",
  },
  {
    id: "3",
    name: "Jennifer Summers",
    username: "summers.45",
    avatarSrc: "https://i.pravatar.cc/150?u=jennifer",
    role: "default",
    subscription: "yearly",
    status: "active",
  },
  {
    id: "4",
    name: "Mr. Justin Richardson",
    username: "jr.3734",
    avatarSrc: "https://i.pravatar.cc/150?u=justin",
    role: "admin",
    subscription: "monthly",
    status: "pending",
  },
  {
    id: "5",
    name: "Nicholas Tanner",
    username: "nicholas.t",
    avatarSrc: "https://i.pravatar.cc/150?u=nicholas",
    role: "superadmin",
    subscription: "yearly",
    status: "active",
  },
  {
    id: "6",
    name: "Crystal Mays",
    username: "mays.754",
    avatarSrc: "https://i.pravatar.cc/150?u=crystal",
    role: "admin",
    subscription: "none",
    status: "pending",
  },
  {
    id: "7",
    name: "Mary Garcia",
    username: "mary.garcia",
    avatarSrc: "https://i.pravatar.cc/150?u=mary",
    role: "superadmin",
    subscription: "monthly",
    status: "inactive",
  },
  {
    id: "8",
    name: "Megan Roberts",
    username: "roberts.3456",
    avatarSrc: "https://i.pravatar.cc/150?u=megan",
    role: "default",
    subscription: "yearly",
    status: "active",
  },
  {
    id: "9",
    name: "Joseph Oliver",
    username: "joseph.87",
    avatarSrc: "https://i.pravatar.cc/150?u=joseph",
    role: "default",
    subscription: "none",
    status: "pending",
  },
];

export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockUsers.length,
    data: mockUsers,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    totalDocs: 0,
    data: [],
  },
};

export const Empty: Story = {
  args: {
    loading: false,
    totalDocs: 0,
    data: [],
  },
};

export const WithPagination: Story = {
  args: {
    loading: false,
    totalDocs: 50,
    data: mockUsers,
    pagination: {
      page: 3,
      total: 50,
      totalPage: 5,
      size: 10,
    },
  },
};

export const WithoutAvatars: Story = {
  args: {
    loading: false,
    totalDocs: mockUsers.length,
    data: mockUsers.map((user) => ({ ...user, avatarSrc: undefined })),
  },
};
