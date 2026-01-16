import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import DialogCreateTicket from "@/app/_components/organisms/DialogCreateTicket";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateTicket",
  component: DialogCreateTicket,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
  },
  args: {
    onSuccess: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default
// ============================================================================
export const Default: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create Support Ticket</Button>
        <DialogCreateTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default state of the Create Support Ticket dialog. Click the button to open the form.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create Support Ticket</Button>
        <DialogCreateTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile responsive view of the dialog. The form adapts to smaller screen sizes.",
      },
    },
  },
};
