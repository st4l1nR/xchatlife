import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Badge, BadgeButton } from "@/app/_components/atoms/badge";

// Define Color type to match BadgeProps
type Color =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "zinc";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
        "zinc",
      ],
      description: "The color of the badge.",
    },
    children: {
      control: "text",
      description: "The content of the badge.",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Badge Stories ---

export const Default: Story = {
  args: {
    children: "Badge",
    color: "zinc",
  },
};

export const AllColors: Story = {
  name: "All Colors",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-2 p-4">
      {[
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
        "zinc",
      ].map((color) => (
        <Badge key={color} color={color as Color}>
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};

// Define colors array for reuse (only those supported by Badge)
const colors: Color[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "zinc",
];

// --- BadgeButton Stories ---

export const Clickable: Story = {
  name: "Clickable Badge",
  render: () => (
    <BadgeButton color="blue" onClick={fn()}>
      Click Me
    </BadgeButton>
  ),
};

export const AsLink: Story = {
  name: "Link Badge",
  render: () => (
    <BadgeButton color="green" href="#">
      I'm a link
    </BadgeButton>
  ),
};

export const AllColorsClickable: Story = {
  name: "All Colors (Clickable)",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-2 p-4">
      {colors.map((color) => (
        <BadgeButton key={color} color={color} onClick={fn()}>
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </BadgeButton>
      ))}
    </div>
  ),
};
