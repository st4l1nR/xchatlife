import { PlusIcon } from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Button } from "@/app/_components/atoms/button";
import { Spinner } from "@/app/_components/atoms/spinner";
const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
    },
    outline: {
      control: "boolean",
    },
    plain: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Colors: Story = {
  args: { children: "Button" }, // Provide required args
  render: () => (
    <div className="flex gap-2">
      <Button>
        <PlusIcon />
        Brand Primary
      </Button>
    </div>
  ),
};

export const Outline: Story = {
  args: {
    outline: true,
    children: "Button",
  },
};

export const Plain: Story = {
  args: {
    plain: true,
    children: "Button",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon />
        Button
      </>
    ),
  },
};

export const WithLoading: Story = {
  args: {
    children: (
      <>
        <Spinner />
        Button
      </>
    ),
  },
};

export const OnlyIcon: Story = {
  args: {
    children: <PlusIcon />,
  },
};

export const OnlyLoading: Story = {
  args: {
    children: <Spinner />,
  },
};
