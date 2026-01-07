import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HomePage, { defaultMockData } from "@/app/_components/pages/HomePage";

const meta = {
  title: "Pages/HomePage",
  component: HomePage,
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
      <div className="bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof HomePage>;

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

export const Loading: Story = {
  args: {
    mock: {
      bannerSlides: [],
      stories: [],
      liveCharacters: [],
      aiCharacters: [],
    },
  },
};
