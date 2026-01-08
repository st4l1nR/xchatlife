import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarHome } from "@/app/_components/organisms/SidebarHome";

const meta = {
  title: "Organisms/SidebarHome",
  component: SidebarHome,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveSubscription: Story = {
  args: {
    hasActiveSubscription: true,
  },
};

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

export const EarnTokensActive: Story = {
  args: {
    hasActiveSubscription: true,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/earn-tokens",
      },
    },
  },
};

export const BuyTokensActive: Story = {
  args: {
    hasActiveSubscription: true,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/buy-tokens",
      },
    },
  },
};
