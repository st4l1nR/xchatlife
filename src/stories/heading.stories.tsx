import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Heading, Subheading } from "@/app/_components/atoms/heading";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6],
    },
    children: {
      control: "text",
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof Heading>;

export const DefaultHeading: Story = {
  name: "Default Heading (h1)",
  args: {
    children: "Recent orders",
  },
};

export const Level2Heading: Story = {
  name: "Heading with Level 2 (h2)",
  args: {
    level: 2,
    children: "Recent orders",
  },
};

export const DefaultSubheading: Story = {
  name: "Default Subheading (h2)",
  render: (args) => <Subheading {...args} />,
  args: {
    children: "Recent orders",
  },
};

export const Level3Subheading: Story = {
  name: "Subheading with Level 3 (h3)",
  render: (args) => <Subheading {...args} />,
  args: {
    level: 3,
    children: "Recent orders",
  },
};
