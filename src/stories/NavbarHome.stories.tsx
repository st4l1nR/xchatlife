import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarHome } from "@/app/_components/organisms/NavbarHome";

const meta = {
  title: "Organisms/NavbarHome",
  component: NavbarHome,
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
} satisfies Meta<typeof NavbarHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutOnlineStatus: Story = {
  args: {
    showOnlineStatus: false,
  },
};
