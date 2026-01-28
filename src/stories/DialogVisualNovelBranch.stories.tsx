import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import DialogVisualNovelBranch from "@/app/_components/organisms/DialogVisualNovelBranch";

const meta = {
  title: "Organisms/DialogVisualNovelBranch",
  component: DialogVisualNovelBranch,
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
      description: "Whether creating a new choice or editing an existing one",
    },
    loading: {
      control: "boolean",
      description: "Whether the form is in a loading state",
    },
    nodeData: {
      control: "object",
      description: "Existing node data when editing",
    },
  },
  args: {
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof DialogVisualNovelBranch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewChoice: Story = {
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
      variant: "branch",
      label: "Go to the forest",
    },
  },
};

export const WithContext: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "branch",
      label: "Accept the quest",
    },
  },
};

export const Loading: Story = {
  args: {
    open: true,
    mode: "edit",
    loading: true,
    nodeData: {
      variant: "branch",
      label: "Choice 1",
    },
  },
};
