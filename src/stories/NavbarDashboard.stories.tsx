import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarDashboard } from "@/app/_components/organisms/NavbarDashboard";

const meta = {
  title: "Organisms/NavbarDashboard",
  component: NavbarDashboard,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavbarDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithUser: Story = {
  args: {
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    userName: "John Doe",
    userEmail: "john@example.com",
  },
};

export const WithLongEmail: Story = {
  args: {
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    userName: "Jane Smith",
    userEmail: "jane.smith.very.long.email@example.com",
  },
};

export const WithInitialsOnly: Story = {
  args: {
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
  },
};
