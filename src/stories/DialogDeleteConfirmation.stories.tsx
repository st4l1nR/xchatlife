import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogDeleteConfirmation from "@/app/_components/organisms/DialogDeleteConfirmation";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogDeleteConfirmation",
  component: DialogDeleteConfirmation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
    itemType: {
      control: "select",
      options: ["reel", "story", "private content"],
      description: "The type of item being deleted",
    },
    itemName: {
      control: "text",
      description: "Optional name of the item being deleted",
    },
    loading: {
      control: "boolean",
      description: "Whether the delete button is in a loading state",
    },
  },
  args: {
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof DialogDeleteConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - Delete Reel
// ============================================================================
export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button color="red" onClick={() => setIsOpen(true)}>
          Delete Reel
        </Button>
        <DialogDeleteConfirmation
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Reel deleted!");
            setIsOpen(false);
          }}
          itemType="reel"
        />
      </>
    );
  },
  args: {
    open: false,
    itemType: "reel",
    loading: false,
  },
};

// ============================================================================
// Delete Story
// ============================================================================
export const DeleteStory: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button color="red" onClick={() => setIsOpen(true)}>
          Delete Story
        </Button>
        <DialogDeleteConfirmation
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Story deleted!");
            setIsOpen(false);
          }}
          itemType="story"
        />
      </>
    );
  },
  args: {
    open: false,
    itemType: "story",
    loading: false,
  },
};

// ============================================================================
// Delete Private Content
// ============================================================================
export const DeletePrivateContent: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button color="red" onClick={() => setIsOpen(true)}>
          Delete Private Content
        </Button>
        <DialogDeleteConfirmation
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Private content deleted!");
            setIsOpen(false);
          }}
          itemType="private content"
          itemName="Summer Photo Set"
        />
      </>
    );
  },
  args: {
    open: false,
    itemType: "private content",
    itemName: "Summer Photo Set",
    loading: false,
  },
};

// ============================================================================
// With Item Name
// ============================================================================
export const WithItemName: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button color="red" onClick={() => setIsOpen(true)}>
          Delete Named Item
        </Button>
        <DialogDeleteConfirmation
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Item deleted!");
            setIsOpen(false);
          }}
          itemType="reel"
          itemName="Beach Dance Video"
        />
      </>
    );
  },
  args: {
    open: false,
    itemType: "reel",
    itemName: "Beach Dance Video",
    loading: false,
  },
};

// ============================================================================
// Loading State
// ============================================================================
export const Loading: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
        console.log("Story deleted after delay!");
      }, 2000);
    };

    return (
      <>
        <Button color="red" onClick={() => setIsOpen(true)}>
          Delete with Loading
        </Button>
        <DialogDeleteConfirmation
          open={isOpen}
          onClose={() => !isLoading && setIsOpen(false)}
          onConfirm={handleConfirm}
          itemType="story"
          itemName="My Story"
          loading={isLoading}
        />
      </>
    );
  },
  args: {
    open: false,
    itemType: "story",
    itemName: "My Story",
    loading: false,
  },
};
