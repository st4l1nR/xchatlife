import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import VisualNovelEditorIdPage from "@/app/_components/pages/VisualNovelEditorIdPage";

const meta = {
  title: "Pages/VisualNovelEditorIdPage",
  component: VisualNovelEditorIdPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    visualNovelId: {
      control: "text",
      description: "The ID of the visual novel to edit",
    },
  },
} satisfies Meta<typeof VisualNovelEditorIdPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visualNovelId: "mock-visual-novel-123",
  },
};

export const FullHeight: Story = {
  args: {
    visualNovelId: "mock-visual-novel-456",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export const WithCustomClass: Story = {
  args: {
    visualNovelId: "mock-visual-novel-789",
    className: "bg-muted",
  },
};
