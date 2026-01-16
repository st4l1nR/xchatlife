import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardTicketsIdPage from "@/app/_components/pages/DashboardTicketsIdPage";
import type { DashboardTicketsIdPageMockData } from "@/app/_components/pages/DashboardTicketsIdPage";

// Base mock data
const baseMockData: DashboardTicketsIdPageMockData = {
  id: "clwk123456789abcdefgh",
  subject: "Cannot access my account after password reset",
  description:
    "I am unable to access my account after resetting my password. When I try to log in with the new password, I get an error message saying my credentials are invalid. I have tried resetting the password multiple times but the issue persists.",
  status: "open",
  priority: "normal",
  category: "account",
  createdAt: "Jan 15, 2026",
  updatedAt: "Jan 16, 2026",
  userName: "Jane Customer",
  userEmail: "jane.customer@example.com",
  userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
  activities: [],
};

// Mock activities
const mockActivities = [
  {
    id: "act-1",
    type: "created" as const,
    content: "Ticket created with priority normal in category account",
    createdAt: "2d ago",
    userName: "Jane Customer",
    userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
  },
];

const mockActivitiesWithHistory = [
  {
    id: "act-5",
    type: "note" as const,
    content:
      "Contacted the user via email. They confirmed the issue is resolved. Waiting for their confirmation before closing.",
    createdAt: "1h ago",
    userName: "John Admin",
    userAvatarSrc: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "act-4",
    type: "status_change" as const,
    content: "Status changed from in_progress to resolved",
    createdAt: "2h ago",
    userName: "John Admin",
    userAvatarSrc: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "act-3",
    type: "note" as const,
    content:
      "Investigating the issue. Found that the password reset token expired before the user could use it. Generating a new token.",
    createdAt: "1d ago",
    userName: "John Admin",
    userAvatarSrc: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "act-2",
    type: "assigned" as const,
    content: "Ticket assigned to John Admin",
    createdAt: "2d ago",
    userName: "System",
  },
  {
    id: "act-1",
    type: "created" as const,
    content: "Ticket created with priority normal in category account",
    createdAt: "2d ago",
    userName: "Jane Customer",
    userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
  },
];

const meta = {
  title: "Pages/DashboardTicketsIdPage",
  component: DashboardTicketsIdPage,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    mock: baseMockData,
  },
} satisfies Meta<typeof DashboardTicketsIdPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default (Open, No Activities)
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      ...baseMockData,
      activities: mockActivities,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Default ticket detail page with open status and no activities.",
      },
    },
  },
};

// ============================================================================
// With Activities
// ============================================================================
export const WithActivities: Story = {
  args: {
    mock: {
      ...baseMockData,
      status: "in_progress",
      assignedToName: "John Admin",
      assignedToEmail: "john.admin@example.com",
      assignedToAvatarSrc: "https://i.pravatar.cc/150?u=john",
      activities: mockActivitiesWithHistory,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ticket detail page with activity timeline showing notes, status changes, and assignments.",
      },
    },
  },
};

// ============================================================================
// In Progress
// ============================================================================
export const InProgress: Story = {
  args: {
    mock: {
      ...baseMockData,
      status: "in_progress",
      priority: "high",
      assignedToName: "Sarah Support",
      assignedToEmail: "sarah.support@example.com",
      assignedToAvatarSrc: "https://i.pravatar.cc/150?u=sarah",
      activities: [
        {
          id: "act-2",
          type: "assigned" as const,
          content: "Ticket assigned to Sarah Support",
          createdAt: "1h ago",
          userName: "System",
        },
        {
          id: "act-1",
          type: "created" as const,
          content: "Ticket created with priority high in category account",
          createdAt: "3h ago",
          userName: "Jane Customer",
          userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Ticket in progress with high priority and assigned agent.",
      },
    },
  },
};

// ============================================================================
// Resolved
// ============================================================================
export const Resolved: Story = {
  args: {
    mock: {
      ...baseMockData,
      status: "resolved",
      resolvedAt: "Jan 17, 2026",
      assignedToName: "John Admin",
      assignedToEmail: "john.admin@example.com",
      assignedToAvatarSrc: "https://i.pravatar.cc/150?u=john",
      activities: mockActivitiesWithHistory,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Resolved ticket with full activity history.",
      },
    },
  },
};

// ============================================================================
// Closed
// ============================================================================
export const Closed: Story = {
  args: {
    mock: {
      ...baseMockData,
      status: "closed",
      resolvedAt: "Jan 17, 2026",
      assignedToName: "John Admin",
      assignedToEmail: "john.admin@example.com",
      assignedToAvatarSrc: "https://i.pravatar.cc/150?u=john",
      activities: [
        {
          id: "act-6",
          type: "status_change" as const,
          content: "Status changed from resolved to closed",
          createdAt: "30m ago",
          userName: "John Admin",
          userAvatarSrc: "https://i.pravatar.cc/150?u=john",
        },
        ...mockActivitiesWithHistory,
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Closed ticket - action buttons are hidden.",
      },
    },
  },
};

// ============================================================================
// Urgent Priority
// ============================================================================
export const UrgentPriority: Story = {
  args: {
    mock: {
      ...baseMockData,
      subject: "Payment failed and subscription cancelled unexpectedly!",
      description:
        "URGENT: My payment failed but I was still charged! This is the third time this has happened and I need immediate assistance. Please help resolve this billing issue as soon as possible.",
      status: "open",
      priority: "urgent",
      category: "billing",
      activities: [
        {
          id: "act-1",
          type: "created" as const,
          content: "Ticket created with priority urgent in category billing",
          createdAt: "10m ago",
          userName: "Jane Customer",
          userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Urgent priority billing ticket requiring immediate attention.",
      },
    },
  },
};

// ============================================================================
// Technical Category
// ============================================================================
export const TechnicalCategory: Story = {
  args: {
    mock: {
      ...baseMockData,
      subject: "API integration returning 500 errors after update",
      description: `The API integration is returning 500 errors after the latest update. This is affecting our production environment.

Error details:
- Endpoint: POST /api/v1/users
- Status: 500 Internal Server Error
- Response: {"error": "Connection refused"}

Steps to reproduce:
1. Make any POST request to the users endpoint
2. Observe the 500 error

This started happening after the v2.3.0 update yesterday.`,
      status: "in_progress",
      priority: "high",
      category: "technical",
      assignedToName: "Emily Expert",
      assignedToEmail: "emily.expert@example.com",
      assignedToAvatarSrc: "https://i.pravatar.cc/150?u=emily",
      activities: [
        {
          id: "act-3",
          type: "note" as const,
          content:
            "Investigating the database connection pool settings. Initial findings suggest the connection limit was reduced in the latest update.",
          createdAt: "2h ago",
          userName: "Emily Expert",
          userAvatarSrc: "https://i.pravatar.cc/150?u=emily",
        },
        {
          id: "act-2",
          type: "assigned" as const,
          content: "Ticket assigned to Emily Expert",
          createdAt: "4h ago",
          userName: "Mike Manager",
          userAvatarSrc: "https://i.pravatar.cc/150?u=mike",
        },
        {
          id: "act-1",
          type: "created" as const,
          content: "Ticket created with priority high in category technical",
          createdAt: "5h ago",
          userName: "Jane Customer",
          userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Technical support ticket with detailed error information and investigation notes.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  args: {
    mock: {
      ...baseMockData,
      status: "in_progress",
      assignedToName: "John Admin",
      assignedToEmail: "john.admin@example.com",
      activities: mockActivitiesWithHistory.slice(0, 3),
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile responsive view - layout adjusts for smaller screens. Note: Two-column layout may need scrolling on mobile.",
      },
    },
  },
};

// ============================================================================
// No Activities
// ============================================================================
export const NoActivities: Story = {
  args: {
    mock: {
      ...baseMockData,
      activities: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ticket with no activities - shows empty state in activity timeline.",
      },
    },
  },
};

// ============================================================================
// Unassigned
// ============================================================================
export const Unassigned: Story = {
  args: {
    mock: {
      ...baseMockData,
      assignedToName: undefined,
      assignedToEmail: undefined,
      assignedToAvatarSrc: undefined,
      activities: mockActivities,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Unassigned ticket - shows "Unassigned" in the aside.',
      },
    },
  },
};
