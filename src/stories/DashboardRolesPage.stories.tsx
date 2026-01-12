import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardRolesPage, {
  defaultMockData,
} from "@/app/_components/pages/DashboardRolesPage";

const meta = {
  title: "Pages/DashboardRolesPage",
  component: DashboardRolesPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard/roles",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardRolesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mock: defaultMockData,
  },
};

export const Mobile: Story = {
  args: {
    mock: defaultMockData,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Empty: Story = {
  args: {
    mock: {
      roles: [],
      users: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

export const FewRoles: Story = {
  args: {
    mock: {
      roles: [
        {
          roleName: "Administrator",
          totalUsers: 2,
          users: [
            {
              id: "1",
              name: "John Doe",
              avatarSrc: "/images/girl-poster.webp",
            },
            {
              id: "2",
              name: "Jane Smith",
              avatarSrc: "/images/girl-poster.webp",
            },
          ],
        },
        {
          roleName: "Editor",
          totalUsers: 1,
          users: [
            {
              id: "3",
              name: "Bob Wilson",
              avatarSrc: "/images/girl-poster.webp",
            },
          ],
        },
      ],
      users: defaultMockData.users.slice(0, 3),
      pagination: {
        page: 1,
        total: 3,
        totalPage: 1,
        size: 10,
      },
    },
  },
};
