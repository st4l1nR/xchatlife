import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import TicketConfirmationEmail from "@/app/_components/email/TicketConfirmationEmail";

const meta = {
  title: "Email/TicketConfirmationEmail",
  component: TicketConfirmationEmail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    ticketId: {
      control: "text",
      description: "The unique ticket ID",
    },
    subject: {
      control: "text",
      description: "The ticket subject",
    },
    category: {
      control: "select",
      options: ["billing", "technical", "account", "content", "other"],
      description: "The ticket category",
    },
    priority: {
      control: "select",
      options: ["low", "normal", "high", "urgent"],
      description: "The ticket priority",
    },
    userName: {
      control: "text",
      description: "The user's name (optional)",
    },
  },
} satisfies Meta<typeof TicketConfirmationEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - Normal Priority
// ============================================================================
export const Default: Story = {
  args: {
    ticketId: "cm5abc123xyz",
    subject: "Cannot access my account settings",
    category: "account",
    priority: "normal",
    userName: "John",
  },
};

// ============================================================================
// Urgent Priority
// ============================================================================
export const UrgentPriority: Story = {
  args: {
    ticketId: "cm5def456uvw",
    subject: "Payment failed but subscription cancelled",
    category: "billing",
    priority: "urgent",
    userName: "Sarah",
  },
};

// ============================================================================
// High Priority
// ============================================================================
export const HighPriority: Story = {
  args: {
    ticketId: "cm5ghi789rst",
    subject: "Application crashing on startup",
    category: "technical",
    priority: "high",
    userName: "Michael",
  },
};

// ============================================================================
// Low Priority
// ============================================================================
export const LowPriority: Story = {
  args: {
    ticketId: "cm5jkl012opq",
    subject: "Feature suggestion for dark mode",
    category: "other",
    priority: "low",
    userName: "Emma",
  },
};

// ============================================================================
// Without User Name
// ============================================================================
export const WithoutUserName: Story = {
  args: {
    ticketId: "cm5mno345lmn",
    subject: "Question about content guidelines",
    category: "content",
    priority: "normal",
  },
};

// ============================================================================
// Technical Issue
// ============================================================================
export const TechnicalIssue: Story = {
  args: {
    ticketId: "cm5pqr678ijk",
    subject: "Error 500 when uploading images",
    category: "technical",
    priority: "high",
    userName: "Alex",
  },
};
