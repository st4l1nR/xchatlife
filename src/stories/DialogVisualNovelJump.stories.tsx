import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import DialogVisualNovelJump from "@/app/_components/organisms/DialogVisualNovelJump";

const sampleNodes = [
  {
    id: "node_1",
    label: "Start",
    width: 100,
    height: 40,
    data: { variant: "start" as const, label: "Start" },
  },
  {
    id: "node_2",
    label: "Opening Scene",
    width: 224,
    height: 120,
    data: { variant: "scene" as const, label: "Opening Scene" },
  },
  {
    id: "node_3",
    label: "First Choice",
    width: 160,
    height: 60,
    data: { variant: "branch" as const, label: "First Choice" },
  },
  {
    id: "node_4",
    label: "Forest Path",
    width: 224,
    height: 120,
    data: { variant: "scene" as const, label: "Forest Path" },
  },
  {
    id: "node_5",
    label: "Mountain Path",
    width: 224,
    height: 120,
    data: { variant: "scene" as const, label: "Mountain Path" },
  },
];

const meta = {
  title: "Organisms/DialogVisualNovelJump",
  component: DialogVisualNovelJump,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the dialog is open",
    },
    mode: {
      control: "select",
      options: ["create", "edit"],
      description: "Whether creating a new jump or editing an existing one",
    },
    loading: {
      control: "boolean",
      description: "Whether the form is in a loading state",
    },
    nodeData: {
      control: "object",
      description: "Existing node data when editing",
    },
    availableNodes: {
      control: "object",
      description: "List of nodes that can be jumped to",
    },
  },
  args: {
    onClose: fn(),
    onSubmit: fn(),
    availableNodes: sampleNodes,
  },
} satisfies Meta<typeof DialogVisualNovelJump>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewJump: Story = {
  args: {
    open: true,
    mode: "create",
  },
};

export const EditExisting: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "jump",
      label: "Return to Forest",
      targetNodeId: "node_4",
    },
  },
};

export const WithTarget: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "jump",
      label: "Loop Back",
      targetNodeId: "node_2",
    },
  },
};

export const Loading: Story = {
  args: {
    open: true,
    mode: "edit",
    loading: true,
    nodeData: {
      variant: "jump",
      label: "Jump 1",
      targetNodeId: "node_1",
    },
  },
};

export const NoAvailableNodes: Story = {
  args: {
    open: true,
    mode: "create",
    availableNodes: [],
  },
};
