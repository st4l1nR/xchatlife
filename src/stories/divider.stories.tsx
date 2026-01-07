import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Divider } from "@/app/_components/atoms/divider";
import { Text } from "@/app/_components/atoms/text";

const meta = {
  title: "Atoms/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Text>Here is some content above the divider.</Text>
        <Story />
        <Text>Here is some content below the divider.</Text>
      </div>
    ),
  ],
  argTypes: {
    soft: {
      control: "boolean",
      description: "Use a softer, less prominent color for the divider.",
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {},
};

export const Soft: Story = {
  args: {
    soft: true,
  },
};
