import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TemplateDashboard } from "@/app/_components/templates/TemplateDashboard";

const meta = {
  title: "Templates/TemplateDashboard",
  component: TemplateDashboard,
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
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TemplateDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-foreground text-2xl font-bold">
          Dashboard Content
        </h1>
        <p className="text-muted-foreground mt-2">
          This is the main content area of the dashboard.
        </p>
      </div>
    ),
  },
};

export const Mobile: Story = {
  args: {
    children: (
      <div className="p-4">
        <h1 className="text-foreground text-xl font-bold">Mobile Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          This is the mobile view of the dashboard.
        </p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const ChatsPage: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-foreground text-2xl font-bold">Chats</h1>
        <p className="text-muted-foreground mt-2">Your conversations</p>
      </div>
    ),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/chats",
      },
    },
  },
};

export const MatchesPage: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-foreground text-2xl font-bold">Matches</h1>
        <p className="text-muted-foreground mt-2">Your matches</p>
      </div>
    ),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/matches",
      },
    },
  },
};
