import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HeaderChat from "@/app/_components/organisms/HeaderChat";

const meta = {
  title: "Organisms/HeaderChat",
  component: HeaderChat,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name of the chat participant",
    },
    avatarSrc: {
      control: "text",
      description: "URL of the avatar image",
    },
  },
  args: {
    onClickPrivateContent: () => console.log("Private content clicked"),
    onCallClick: () => console.log("Call clicked"),
    onAddToFavorites: () => console.log("Add to favorites clicked"),
    onResetChat: () => console.log("Reset chat clicked"),
    onDeleteChat: () => console.log("Delete chat clicked"),
    onExpand: () => console.log("Expand clicked"),
  },
} satisfies Meta<typeof HeaderChat>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default
// ============================================================================
export const Default: Story = {
  args: {
    name: "Savannah",
    avatarSrc: "/images/girl-poster.webp",
  },
};

// ============================================================================
// Without Avatar
// ============================================================================
export const WithoutAvatar: Story = {
  args: {
    name: "Jessica",
  },
};

// ============================================================================
// Long Name
// ============================================================================
export const LongName: Story = {
  args: {
    name: "Alexandria Catherine",
    avatarSrc: "/images/girl-poster.webp",
  },
};
