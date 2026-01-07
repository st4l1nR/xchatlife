import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Avatar, AvatarButton } from "@/app/_components/atoms/avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image URL for the avatar",
    },
    square: {
      control: "boolean",
      description: "Whether the avatar should be square instead of round",
    },
    initials: {
      control: "text",
      description: "Initials to display when no image is provided",
    },
    alt: {
      control: "text",
      description: "Alt text for the avatar image",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const srcDefault =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export const WithImage: Story = {
  args: {
    src: srcDefault,
    alt: "User Avatar",
  },
};

export const WithThickBorder: Story = {
  args: {
    src: srcDefault,
    alt: "User Avatar",
  },
};

export const WithInitials: Story = {
  args: {
    initials: "AB",
    alt: "Andrew Brown",
  },
};

export const SquareWithImage: Story = {
  args: {
    src: srcDefault,
    square: true,
    alt: "User Avatar",
  },
};

export const SquareWithInitials: Story = {
  args: {
    initials: "JD",
    square: true,
    alt: "Jane Doe",
  },
};

export const LongInitials: Story = {
  args: {
    initials: "ABC",
    alt: "A Very Long Name",
  },
};

// AvatarButton Stories (using render function to showcase interactive variants)
export const ClickableWithImage: Story = {
  render: (args) => (
    <AvatarButton
      {...args}
      src={srcDefault}
      alt="Clickable User Avatar"
      onClick={fn()}
    />
  ),
  args: {},
};

export const ClickableWithInitials: Story = {
  render: (args) => (
    <AvatarButton {...args} initials="CU" alt="Clickable User" onClick={fn()} />
  ),
  args: {},
};

export const ClickableSquare: Story = {
  render: (args) => (
    <AvatarButton
      {...args}
      src={srcDefault}
      square
      alt="Square Clickable Avatar"
      onClick={fn()}
    />
  ),
  args: {},
};

export const LinkAvatar: Story = {
  render: (args) => (
    <AvatarButton
      {...args}
      href="/profile"
      src={srcDefault}
      alt="Profile Link Avatar"
    />
  ),
  args: {},
};
