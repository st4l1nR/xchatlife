import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Text,
  Code as CodeComponent,
  Strong as StrongComponent,
  TextLink as TextLinkComponent,
} from "@/app/_components/atoms/text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi odit quasi officiis nulla facilis eos iusto voluptas animi esse eum?",
  },
};

export const TextLink: Story = {
  args: {
    children: "Hello, world!",
  },
  render: (args) => (
    <Text {...args}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
      <TextLinkComponent href="#">Eligendi odit quasi</TextLinkComponent>{" "}
      officiis nulla facilis eos iusto voluptas animi esse eum?
    </Text>
  ),
};

export const Code: Story = {
  args: {
    children: "Hello, world!",
  },
  render: (args) => (
    <Text {...args}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
      <CodeComponent>Eligendi odit quasi</CodeComponent> officiis nulla facilis
      eos iusto voluptas animi esse eum?
    </Text>
  ),
};

export const Strong: Story = {
  args: {
    children: "Hello, world!",
  },
  render: (args) => (
    <Text {...args}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
      <StrongComponent>Eligendi odit quasi</StrongComponent> officiis nulla
      facilis eos iusto voluptas animi esse eum?
    </Text>
  ),
};
