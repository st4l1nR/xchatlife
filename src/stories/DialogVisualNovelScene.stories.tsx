import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import DialogVisualNovelScene from "@/app/_components/organisms/DialogVisualNovelScene";

const meta = {
  title: "Organisms/DialogVisualNovelScene",
  component: DialogVisualNovelScene,
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
      description: "Whether creating a new scene or editing an existing one",
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
} satisfies Meta<typeof DialogVisualNovelScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewScene: Story = {
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
      variant: "scene",
      label: "Opening Scene",
      characterName: "Alice",
      dialogue: "Welcome to our story!",
    },
  },
};

export const WithImage: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "scene",
      label: "Forest Clearing",
      characterName: "Hero",
      dialogue: "What a beautiful day to start an adventure.",
      sceneryImageSrc:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop",
    },
  },
};

export const Loading: Story = {
  args: {
    open: true,
    mode: "edit",
    loading: true,
    nodeData: {
      variant: "scene",
      label: "Scene 1",
      characterName: "Character",
      dialogue: "Some dialogue...",
    },
  },
};

export const EmptyEdit: Story = {
  args: {
    open: true,
    mode: "edit",
    nodeData: {
      variant: "scene",
      label: "",
    },
  },
};
