import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogCall from "@/app/_components/organisms/DialogCall";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCall",
  component: DialogCall,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
    characterName: {
      control: "text",
      description: "Name of the character being called",
    },
    characterImage: {
      control: "text",
      description: "Image URL of the character",
    },
    status: {
      control: "select",
      options: ["ringing", "connecting", "connected", "ended"],
      description: "Current status of the call",
    },
    duration: {
      control: "text",
      description: "Duration of the call (shown when connected)",
    },
  },
  args: {
    onClose: () => {},
    onHangUp: () => {},
  },
} satisfies Meta<typeof DialogCall>;

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
        <Button onClick={() => setIsOpen(true)}>Start Call</Button>
        <DialogCall
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onHangUp={() => {
            console.log("Call ended");
            setIsOpen(false);
          }}
          characterName="Savannah Carter"
          characterImage="https://picsum.photos/seed/savannah/800/1200"
          status="ringing"
        />
      </>
    );
  },
  args: {
    open: false,
    characterName: "Savannah Carter",
    characterImage: "https://picsum.photos/seed/savannah/800/1200",
    status: "ringing",
  },
};

// ============================================================================
// Connected with Duration
// ============================================================================
export const Connected: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Start Connected Call</Button>
        <DialogCall
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onHangUp={() => {
            console.log("Call ended");
            setIsOpen(false);
          }}
          characterName="Savannah Carter"
          characterImage="https://picsum.photos/seed/savannah/800/1200"
          status="connected"
          duration="02:34"
        />
      </>
    );
  },
  args: {
    open: false,
    characterName: "Savannah Carter",
    characterImage: "https://picsum.photos/seed/savannah/800/1200",
    status: "connected",
    duration: "02:34",
  },
};
