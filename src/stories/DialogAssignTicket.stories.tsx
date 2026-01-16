import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import DialogAssignTicket from "@/app/_components/organisms/DialogAssignTicket";
import type {
  AssignableUser,
  TicketInfo,
} from "@/app/_components/organisms/DialogAssignTicket";
import { Button } from "@/app/_components/atoms/button";

// Mock users for Storybook
const MOCK_USERS: AssignableUser[] = [
  {
    id: "user-1",
    name: "John Admin",
    email: "john.admin@example.com",
    image: null,
    roleName: "Admin",
  },
  {
    id: "user-2",
    name: "Sarah Support",
    email: "sarah.support@example.com",
    image: "https://i.pravatar.cc/150?u=sarah",
    roleName: "Admin",
  },
  {
    id: "user-3",
    name: "Mike Manager",
    email: "mike.manager@example.com",
    image: "https://i.pravatar.cc/150?u=mike",
    roleName: "Superadmin",
  },
  {
    id: "user-4",
    name: "Emily Expert",
    email: "emily.expert@example.com",
    image: "https://i.pravatar.cc/150?u=emily",
    roleName: "Admin",
  },
  {
    id: "user-5",
    name: "Alex Agent",
    email: "alex.agent@example.com",
    image: null,
    roleName: "Admin",
  },
];

// Mock ticket for assignment
const MOCK_TICKET_UNASSIGNED: TicketInfo = {
  id: "ticket-123",
  subject: "Cannot access my account after password reset",
  userName: "Jane Customer",
  currentAssigneeId: null,
  currentAssigneeName: null,
};

// Mock ticket for reassignment
const MOCK_TICKET_ASSIGNED: TicketInfo = {
  id: "ticket-456",
  subject: "Billing issue with my subscription renewal",
  userName: "Bob User",
  currentAssigneeId: "user-2",
  currentAssigneeName: "Sarah Support",
};

const meta = {
  title: "Organisms/DialogAssignTicket",
  component: DialogAssignTicket,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
    ticket: { table: { disable: true } },
    mockUsers: { table: { disable: true } },
  },
  args: {
    open: false,
    onSuccess: fn(),
    onClose: fn(),
    mockUsers: MOCK_USERS,
    ticket: MOCK_TICKET_UNASSIGNED,
  },
} satisfies Meta<typeof DialogAssignTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Assign (New Assignment)
// ============================================================================
export const Assign: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Assign Ticket</Button>
        <DialogAssignTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticket={MOCK_TICKET_UNASSIGNED}
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
          "Dialog for assigning a ticket that has no current assignee. Shows the list of available team members to assign.",
      },
    },
  },
};

// ============================================================================
// Reassign (Change Assignment)
// ============================================================================
export const Reassign: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Reassign Ticket</Button>
        <DialogAssignTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticket={MOCK_TICKET_ASSIGNED}
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
          "Dialog for reassigning a ticket that already has an assignee. Shows the current assignee and allows selecting a new one.",
      },
    },
  },
};

// ============================================================================
// Open by Default (for visual testing)
// ============================================================================
export const OpenByDefault: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Assign Ticket</Button>
        <DialogAssignTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticket={MOCK_TICKET_UNASSIGNED}
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
        story:
          "Dialog opened by default for visual testing and documentation purposes.",
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
        <Button onClick={() => setIsOpen(true)}>Assign Ticket</Button>
        <DialogAssignTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticket={MOCK_TICKET_UNASSIGNED}
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
          "Mobile responsive view of the dialog. The user list adapts to smaller screen sizes.",
      },
    },
  },
};

// ============================================================================
// With Many Users (Scrollable)
// ============================================================================
const MANY_USERS: AssignableUser[] = [
  ...MOCK_USERS,
  {
    id: "user-6",
    name: "Chris Coordinator",
    email: "chris.coordinator@example.com",
    image: "https://i.pravatar.cc/150?u=chris",
    roleName: "Admin",
  },
  {
    id: "user-7",
    name: "Diana Director",
    email: "diana.director@example.com",
    image: "https://i.pravatar.cc/150?u=diana",
    roleName: "Superadmin",
  },
  {
    id: "user-8",
    name: "Frank Facilitator",
    email: "frank.facilitator@example.com",
    image: null,
    roleName: "Admin",
  },
  {
    id: "user-9",
    name: "Grace Guide",
    email: "grace.guide@example.com",
    image: "https://i.pravatar.cc/150?u=grace",
    roleName: "Admin",
  },
  {
    id: "user-10",
    name: "Henry Helper",
    email: "henry.helper@example.com",
    image: "https://i.pravatar.cc/150?u=henry",
    roleName: "Admin",
  },
];

export const WithManyUsers: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Assign Ticket</Button>
        <DialogAssignTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticket={MOCK_TICKET_UNASSIGNED}
          mockUsers={MANY_USERS}
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
          "Dialog with many users showing the scrollable list behavior when there are more team members than can fit in the viewport.",
      },
    },
  },
};

// ============================================================================
// Empty Users List
// ============================================================================
export const EmptyUsersList: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Assign Ticket</Button>
        <DialogAssignTicket
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          ticket={MOCK_TICKET_UNASSIGNED}
          mockUsers={[]}
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
          "Dialog with no available team members. Shows an empty state message.",
      },
    },
  },
};
