import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardTicketsPage from "@/app/_components/pages/DashboardTicketsPage";
import type { TableTicketItem } from "@/app/_components/organisms/TableTicket";

// Generate mock tickets for testing
const generateMockTickets = (count: number): TableTicketItem[] => {
  const statuses = ["open", "in_progress", "resolved", "closed"] as const;
  const priorities = ["low", "normal", "high", "urgent"] as const;
  const categories = [
    "billing",
    "technical",
    "account",
    "content",
    "other",
  ] as const;

  const subjects = [
    "Cannot access my subscription features",
    "Character not responding in chat",
    "Request to delete my account",
    "Inappropriate content from AI character",
    "How do I create a custom character?",
    "Payment failed but tokens deducted",
    "Image generation not working",
    "Cannot change my email address",
    "Voice messages not playing",
    "App crashes when opening chat",
    "Billing cycle confusion",
    "Need help with visual novel editor",
    "Character avatar not loading",
    "Subscription renewal issue",
    "Cannot upload profile picture",
  ];

  const userNames = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Emily Davis",
    "Alex Turner",
    "Lisa Chen",
    "Robert Garcia",
    "Amanda Lee",
  ];

  const assignees = [
    { name: "Support Agent", avatar: null },
    { name: "Admin User", avatar: null },
    { name: "Content Moderator", avatar: null },
    { name: "Tech Support", avatar: null },
    null, // Unassigned
  ];

  return Array.from({ length: count }, (_, i) => {
    const userName = userNames[i % userNames.length]!;
    const subject = subjects[i % subjects.length]!;
    const assignee = assignees[i % assignees.length];
    const status = statuses[i % statuses.length]!;

    // Create date going back from today
    const date = new Date();
    date.setDate(date.getDate() - i);

    return {
      id: `ticket-${i + 1}`,
      subject,
      userName,
      userEmail: `${userName.toLowerCase().replace(" ", ".")}@example.com`,
      userAvatarSrc: `https://i.pravatar.cc/150?u=${userName.replace(" ", "-")}-${i}`,
      assignedToName: assignee?.name ?? null,
      assignedToAvatarSrc: assignee?.avatar ?? null,
      status,
      priority: priorities[i % priorities.length]!,
      category: categories[i % categories.length]!,
      createdAt: date.toISOString(),
    };
  });
};

const mockTickets50 = generateMockTickets(50);
const mockTickets10 = mockTickets50.slice(0, 10);

const meta: Meta<typeof DashboardTicketsPage> = {
  title: "Pages/DashboardTicketsPage",
  component: DashboardTicketsPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardTicketsPage>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      tickets: mockTickets10,
      pagination: {
        page: 1,
        total: mockTickets10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Default view showing support tickets with various statuses.",
      },
    },
  },
};

// ============================================================================
// Empty State
// ============================================================================
export const Empty: Story = {
  args: {
    mock: {
      tickets: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        size: 10,
      },
    },
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
// With Pagination
// ============================================================================
export const WithPagination: Story = {
  args: {
    mock: {
      tickets: mockTickets50,
      pagination: {
        page: 3,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table with pagination showing page 3 of 5.",
      },
    },
  },
};

// ============================================================================
// Only Open Tickets
// ============================================================================
export const OnlyOpenTickets: Story = {
  args: {
    mock: {
      tickets: mockTickets50.filter((t) => t.status === "open"),
      pagination: {
        page: 1,
        total: mockTickets50.filter((t) => t.status === "open").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only open tickets that need attention.",
      },
    },
  },
};

// ============================================================================
// Only Urgent Priority
// ============================================================================
export const OnlyUrgentPriority: Story = {
  args: {
    mock: {
      tickets: mockTickets50.filter((t) => t.priority === "urgent"),
      pagination: {
        page: 1,
        total: mockTickets50.filter((t) => t.priority === "urgent").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only urgent priority tickets.",
      },
    },
  },
};

// ============================================================================
// Billing Category
// ============================================================================
export const BillingCategory: Story = {
  args: {
    mock: {
      tickets: mockTickets50.filter((t) => t.category === "billing"),
      pagination: {
        page: 1,
        total: mockTickets50.filter((t) => t.category === "billing").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only billing-related tickets.",
      },
    },
  },
};

// ============================================================================
// Unassigned Tickets
// ============================================================================
export const UnassignedTickets: Story = {
  args: {
    mock: {
      tickets: mockTickets50.filter((t) => !t.assignedToName),
      pagination: {
        page: 1,
        total: mockTickets50.filter((t) => !t.assignedToName).length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only unassigned tickets that need to be picked up.",
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
      tickets: mockTickets10,
      pagination: {
        page: 1,
        total: mockTickets10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile responsive view of the tickets page.",
      },
    },
  },
};
