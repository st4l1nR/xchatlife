import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import InputChat from "@/app/_components/organisms/InputChat";

const meta = {
  title: "Organisms/InputChat",
  component: InputChat,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    onSendMessage: {
      action: "sendMessage",
      description: "Callback when a message is sent",
    },
  },
  args: {
    onSendMessage: (message: string) => console.log("Message sent:", message),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg min-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputChat>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default
// ============================================================================
export const Default: Story = {
  args: {
    placeholder: "Write a message...",
  },
};

// ============================================================================
// Disabled
// ============================================================================
export const Disabled: Story = {
  args: {
    placeholder: "Write a message...",
    disabled: true,
  },
};

// ============================================================================
// Custom Placeholder
// ============================================================================
export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Type your reply here...",
  },
};
