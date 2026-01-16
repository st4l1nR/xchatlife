import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TableTicket from "@/app/_components/organisms/TableTicket";
import type { TableTicketItem } from "@/app/_components/organisms/TableTicket";

// Sample mock data
const mockTickets: TableTicketItem[] = [
  {
    id: "1",
    subject: "Cannot access my subscription features",
    userName: "John Doe",
    userEmail: "john@example.com",
    userAvatarSrc: null,
    assignedToName: null,
    assignedToAvatarSrc: null,
    status: "open",
    priority: "high",
    category: "billing",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    subject: "Character not responding in chat",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userAvatarSrc: null,
    assignedToName: "Support Agent",
    assignedToAvatarSrc: null,
    status: "in_progress",
    priority: "normal",
    category: "technical",
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    subject: "Request to delete my account",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    userAvatarSrc: null,
    assignedToName: "Admin User",
    assignedToAvatarSrc: null,
    status: "resolved",
    priority: "normal",
    category: "account",
    createdAt: "2024-01-13T09:00:00Z",
  },
  {
    id: "4",
    subject: "Inappropriate content from AI character",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    userAvatarSrc: null,
    assignedToName: "Content Moderator",
    assignedToAvatarSrc: null,
    status: "closed",
    priority: "urgent",
    category: "content",
    createdAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    subject: "How do I create a custom character?",
    userName: "David Brown",
    userEmail: "david@example.com",
    userAvatarSrc: null,
    assignedToName: null,
    assignedToAvatarSrc: null,
    status: "open",
    priority: "low",
    category: "other",
    createdAt: "2024-01-11T11:00:00Z",
  },
  {
    id: "6",
    subject: "Payment failed but tokens deducted",
    userName: "Emily Davis",
    userEmail: "emily@example.com",
    userAvatarSrc: null,
    assignedToName: null,
    assignedToAvatarSrc: null,
    status: "open",
    priority: "urgent",
    category: "billing",
    createdAt: "2024-01-10T08:30:00Z",
  },
  {
    id: "7",
    subject: "Image generation not working",
    userName: "Alex Turner",
    userEmail: "alex@example.com",
    userAvatarSrc: null,
    assignedToName: "Tech Support",
    assignedToAvatarSrc: null,
    status: "in_progress",
    priority: "high",
    category: "technical",
    createdAt: "2024-01-09T13:15:00Z",
  },
  {
    id: "8",
    subject: "Cannot change my email address",
    userName: "Lisa Chen",
    userEmail: "lisa@example.com",
    userAvatarSrc: null,
    assignedToName: "Support Agent",
    assignedToAvatarSrc: null,
    status: "resolved",
    priority: "normal",
    category: "account",
    createdAt: "2024-01-08T10:00:00Z",
  },
];

const meta = {
  title: "Organisms/TableTicket",
  component: TableTicket,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
    totalDocs: {
      control: "number",
      description: "Total number of documents",
    },
  },
  args: {
    onAssign: fn(),
    onClose: fn(),
    onResolve: fn(),
    onPageChange: fn(),
    onSortingChange: fn(),
  },
} satisfies Meta<typeof TableTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockTickets.length,
    data: mockTickets,
    pagination: {
      page: 1,
      total: mockTickets.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table view showing support tickets with various statuses and priorities.",
      },
    },
  },
};

// ============================================================================
// Loading State
// ============================================================================
export const Loading: Story = {
  args: {
    loading: true,
    totalDocs: 0,
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state showing skeleton placeholders.",
      },
    },
  },
};

// ============================================================================
// Empty State
// ============================================================================
export const Empty: Story = {
  args: {
    loading: false,
    totalDocs: 0,
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no tickets are found.",
      },
    },
  },
};

// ============================================================================
// Only Open Tickets
// ============================================================================
export const OnlyOpen: Story = {
  args: {
    loading: false,
    totalDocs: 3,
    data: mockTickets.filter((t) => t.status === "open"),
    pagination: {
      page: 1,
      total: 3,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table showing only open tickets that need attention. Assign, resolve, and close buttons are visible.",
      },
    },
  },
};

// ============================================================================
// Only In Progress
// ============================================================================
export const OnlyInProgress: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockTickets.filter((t) => t.status === "in_progress"),
    pagination: {
      page: 1,
      total: 2,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing only tickets that are currently being worked on.",
      },
    },
  },
};

// ============================================================================
// Only Resolved
// ============================================================================
export const OnlyResolved: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockTickets.filter((t) => t.status === "resolved"),
    pagination: {
      page: 1,
      total: 2,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table showing only resolved tickets. Close button is available.",
      },
    },
  },
};

// ============================================================================
// Only Closed
// ============================================================================
export const OnlyClosed: Story = {
  args: {
    loading: false,
    totalDocs: 1,
    data: mockTickets.filter((t) => t.status === "closed"),
    pagination: {
      page: 1,
      total: 1,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table showing only closed tickets. No action buttons except view.",
      },
    },
  },
};

// ============================================================================
// Urgent Priority
// ============================================================================
export const UrgentPriority: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockTickets.filter((t) => t.priority === "urgent"),
    pagination: {
      page: 1,
      total: 2,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table showing only urgent priority tickets that need immediate attention.",
      },
    },
  },
};

// ============================================================================
// Billing Category
// ============================================================================
export const BillingCategory: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockTickets.filter((t) => t.category === "billing"),
    pagination: {
      page: 1,
      total: 2,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing only billing-related support tickets.",
      },
    },
  },
};

// ============================================================================
// Technical Category
// ============================================================================
export const TechnicalCategory: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockTickets.filter((t) => t.category === "technical"),
    pagination: {
      page: 1,
      total: 2,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing only technical support tickets.",
      },
    },
  },
};

// ============================================================================
// Unassigned Tickets
// ============================================================================
export const UnassignedTickets: Story = {
  args: {
    loading: false,
    totalDocs: 3,
    data: mockTickets.filter((t) => !t.assignedToName),
    pagination: {
      page: 1,
      total: 3,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table showing only unassigned tickets. Assign button is visible for these.",
      },
    },
  },
};

// ============================================================================
// With Pagination
// ============================================================================
export const WithPagination: Story = {
  args: {
    loading: false,
    totalDocs: 50,
    data: mockTickets,
    pagination: {
      page: 2,
      total: 50,
      totalPage: 5,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table with pagination showing page 2 of 5.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  args: {
    loading: false,
    totalDocs: mockTickets.length,
    data: mockTickets,
    pagination: {
      page: 1,
      total: mockTickets.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile responsive view of the table.",
      },
    },
  },
};
