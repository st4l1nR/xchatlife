import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogBlockedMicrophone from "@/app/_components/organisms/DialogBlockedMicrophone";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogBlockedMicrophone",
  component: DialogBlockedMicrophone,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
  },
  args: {
    onClose: () => {},
  },
} satisfies Meta<typeof DialogBlockedMicrophone>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default
// ============================================================================
export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Blocked Microphone Dialog
        </Button>
        <DialogBlockedMicrophone
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: false,
  },
};
