import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarMobileHome } from "@/app/_components/organisms/NavbarMobileHome";

const meta = {
  title: "Organisms/NavbarMobileHome",
  component: NavbarMobileHome,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavbarMobileHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ChatsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/chats",
      },
    },
  },
};

export const MatchesActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/matches",
      },
    },
  },
};

export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/profile",
      },
    },
  },
};

export const SettingsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/settings",
      },
    },
  },
};
