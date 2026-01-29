import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import DialogVisualNovelEnd from "@/app/_components/organisms/DialogVisualNovelEnd";

const meta = {
  title: "Organisms/DialogVisualNovelEnd",
  component: DialogVisualNovelEnd,
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
      description: "Whether creating a new ending or editing an existing one",
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
} satisfies Meta<typeof DialogVisualNovelEnd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewEnding: Story = {
  args: {
    open: true,
    mode: "create",
  },
};

export const GoodEnding: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "end",
      label: "True Love",
      endingType: "good",
      finalMessage:
        "And they lived happily ever after. The kingdom flourished under their benevolent rule.",
    },
  },
};

export const NeutralEnding: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "end",
      label: "The Journey Continues",
      endingType: "neutral",
      finalMessage:
        "The hero continued their journey, neither triumphant nor defeated.",
    },
  },
};

export const BadEnding: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "end",
      label: "Tragic End",
      endingType: "bad",
      finalMessage:
        "In the end, all was lost. The darkness consumed everything.",
    },
  },
};

export const SecretEnding: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "end",
      label: "Hidden Truth",
      endingType: "secret",
      finalMessage:
        "You discovered the truth behind everything. The world was never what it seemed.",
    },
  },
};

export const Loading: Story = {
  args: {
    open: true,
    mode: "edit",
    loading: true,
    nodeData: {
      variant: "end",
      label: "Ending",
      endingType: "neutral",
    },
  },
};

export const NoFinalMessage: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "end",
      label: "Quick End",
      endingType: "bad",
    },
  },
};
