import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import DialogCreateTicketActivity from "@/app/_components/organisms/DialogCreateTicketActivity";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateTicketActivity",
  component: DialogCreateTicketActivity,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
  },
  args: {
    open: false,
    onSuccess: fn(),
    onClose: fn(),
    ticketId: "ticket-123",
    ticketSubject: "Cannot access my account after password reset",
    mock: true,
  },
} satisfies Meta<typeof DialogCreateTicketActivity>;

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
        <Button onClick={() => setIsOpen(true)}>Add Note</Button>
        <DialogCreateTicketActivity
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Dialog for adding an internal note to a ticket.",
      },
    },
  },
};

// ============================================================================
// Open by Default
// ============================================================================
export const OpenByDefault: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add Note</Button>
        <DialogCreateTicketActivity
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Dialog opened by default for visual testing.",
      },
    },
  },
};

// ============================================================================
// Without Subject
// ============================================================================
export const WithoutSubject: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add Note</Button>
        <DialogCreateTicketActivity
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticketSubject={undefined}
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Dialog without showing the ticket subject.",
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
        <Button onClick={() => setIsOpen(true)}>Add Note</Button>
        <DialogCreateTicketActivity
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile responsive view of the dialog.",
      },
    },
  },
};
