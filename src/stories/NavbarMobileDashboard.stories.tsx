import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarMobileDashboard } from "@/app/_components/organisms/NavbarMobileDashboard";

const meta = {
  title: "Organisms/NavbarMobileDashboard",
  component: NavbarMobileDashboard,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile1",
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="fixed right-0 bottom-0 left-0">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavbarMobileDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RolesActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/roles",
      },
    },
  },
};

export const UsersActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/users",
      },
    },
  },
};

export const CharactersActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/characters",
      },
    },
  },
};

export const SettingsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/settings",
      },
    },
  },
};
