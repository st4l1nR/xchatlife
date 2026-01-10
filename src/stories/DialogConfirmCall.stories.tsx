import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogConfirmCall from "@/app/_components/organisms/DialogConfirmCall";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogConfirmCall",
  component: DialogConfirmCall,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
    pricePerMinute: {
      control: "text",
      description: "Price per minute displayed below the call button",
    },
    dontShowAgain: {
      control: "boolean",
      description:
        "Whether the 'Don't show this message again' checkbox is checked",
    },
    loading: {
      control: "boolean",
      description: "Whether the call button is in a loading state",
    },
  },
  args: {
    onClose: () => {},
    onConfirm: () => {},
    onDontShowAgainChange: () => {},
  },
} satisfies Meta<typeof DialogConfirmCall>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default
// ============================================================================
export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Confirm Call Dialog
        </Button>
        <DialogConfirmCall
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Call confirmed!");
            setIsOpen(false);
          }}
          dontShowAgain={dontShowAgain}
          onDontShowAgainChange={setDontShowAgain}
        />
      </>
    );
  },
  args: {
    open: false,
    pricePerMinute: "3 tk/min",
    dontShowAgain: false,
    loading: false,
  },
};
