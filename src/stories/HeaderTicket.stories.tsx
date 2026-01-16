import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import HeaderTicket from "@/app/_components/organisms/HeaderTicket";

const meta = {
  title: "Organisms/HeaderTicket",
  component: HeaderTicket,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    subject: "Cannot access my account after password reset",
    status: "open",
    priority: "normal",
    category: "account",
    createdAt: "Jan 15, 2026",
    userName: "Jane Customer",
    userEmail: "jane.customer@example.com",
    userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
    onAssign: fn(),
    onResolve: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof HeaderTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Open Status
// ============================================================================
export const Open: Story = {
  args: {
    status: "open",
    priority: "normal",
  },
  parameters: {
    docs: {
      description: {
        story: "Ticket in open status with normal priority.",
      },
    },
  },
};

// ============================================================================
// In Progress
// ============================================================================
export const InProgress: Story = {
  args: {
    status: "in_progress",
    priority: "high",
    assignedToName: "John Admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Ticket in progress with high priority and assigned to someone.",
      },
    },
  },
};

// ============================================================================
// Resolved
// ============================================================================
export const Resolved: Story = {
  args: {
    status: "resolved",
    priority: "normal",
    assignedToName: "Sarah Support",
  },
  parameters: {
    docs: {
      description: {
        story: "Resolved ticket - assign and resolve buttons are hidden.",
      },
    },
  },
};

// ============================================================================
// Closed
// ============================================================================
export const Closed: Story = {
  args: {
    status: "closed",
    priority: "low",
    assignedToName: "Mike Manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Closed ticket - all action buttons are hidden.",
      },
    },
  },
};

// ============================================================================
// Urgent Priority
// ============================================================================
export const UrgentPriority: Story = {
  args: {
    status: "open",
    priority: "urgent",
    category: "billing",
    subject: "Payment failed and subscription cancelled unexpectedly!",
  },
  parameters: {
    docs: {
      description: {
        story: "Urgent priority ticket with billing category.",
      },
    },
  },
};

// ============================================================================
// Technical Category
// ============================================================================
export const TechnicalCategory: Story = {
  args: {
    status: "in_progress",
    priority: "high",
    category: "technical",
    subject: "API integration not working after latest update",
    assignedToName: "Emily Expert",
  },
  parameters: {
    docs: {
      description: {
        story: "Technical category ticket.",
      },
    },
  },
};

// ============================================================================
// Without Avatar
// ============================================================================
export const WithoutAvatar: Story = {
  args: {
    userAvatarSrc: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "Header when user has no avatar - shows initials.",
      },
    },
  },
};

// ============================================================================
// Loading States
// ============================================================================
export const LoadingResolve: Story = {
  args: {
    loadingResolve: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Header with resolve button in loading state.",
      },
    },
  },
};

export const LoadingAssign: Story = {
  args: {
    loadingAssign: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Header with assign button in loading state.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  args: {
    status: "in_progress",
    assignedToName: "John Admin",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile responsive view of the header.",
      },
    },
  },
};

// ============================================================================
// Long Subject
// ============================================================================
export const LongSubject: Story = {
  args: {
    subject:
      "This is a very long ticket subject that should wrap properly when it exceeds the available width. It describes a complex issue with multiple aspects that the user is experiencing and needs help with.",
    status: "open",
    priority: "high",
    assignedToName: "Support Team",
  },
  parameters: {
    docs: {
      description: {
        story: "Header with a long subject line that wraps.",
      },
    },
  },
};
