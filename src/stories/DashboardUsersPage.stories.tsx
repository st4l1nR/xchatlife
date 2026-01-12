import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardUsersPage from "@/app/_components/pages/DashboardUsersPage";
import type { TableUserItem } from "@/app/_components/organisms/TableUser";

// Generate mock users for testing
const generateMockUsers = (count: number): TableUserItem[] => {
  const roles = ["default", "admin", "superadmin"] as const;
  const subscriptions = ["yearly", "monthly", "none"] as const;
  const statuses = ["pending", "active", "inactive"] as const;

  const names = [
    "Jordan Stevenson",
    "Richard Payne",
    "Jennifer Summers",
    "Justin Richardson",
    "Nicholas Tanner",
    "Crystal Mays",
    "Mary Garcia",
    "Megan Roberts",
    "Joseph Oliver",
    "Sarah Mitchell",
    "David Chen",
    "Emily Watson",
    "Michael Brown",
    "Lisa Anderson",
    "James Wilson",
    "Amanda Taylor",
    "Robert Martinez",
    "Jessica Lee",
    "William Davis",
    "Ashley Thomas",
  ];

  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length] ?? `User ${i + 1}`;
    const username = name
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/mr\.\s*/i, "");

    return {
      id: `user-${i + 1}`,
      name,
      username,
      avatarSrc: `https://i.pravatar.cc/150?u=${username}-${i}`,
      role: roles[i % roles.length]!,
      subscription: subscriptions[i % subscriptions.length]!,
      status: statuses[i % statuses.length]!,
    };
  });
};

// Mock data sets
const mockUsers50 = generateMockUsers(50);
const mockUsers10 = mockUsers50.slice(0, 10);

const meta: Meta<typeof DashboardUsersPage> = {
  title: "Pages/DashboardUsersPage",
  component: DashboardUsersPage,
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
type Story = StoryObj<typeof DashboardUsersPage>;

// ============================================================================
// Default - populated with users
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      users: mockUsers10,
      pagination: {
        page: 1,
        total: mockUsers10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// Loading - loading state
// ============================================================================
export const Loading: Story = {
  args: {
    mock: {
      users: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        size: 10,
      },
    },
  },
  render: function Render() {
    return (
      <div className="bg-background min-h-screen p-6">
        <DashboardUsersPage />
      </div>
    );
  },
};

// ============================================================================
// Empty - no users
// ============================================================================
export const Empty: Story = {
  args: {
    mock: {
      users: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        size: 10,
      },
    },
  },
};

// ============================================================================
// WithPagination - multiple pages
// ============================================================================
export const WithPagination: Story = {
  args: {
    mock: {
      users: mockUsers50,
      pagination: {
        page: 3,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
};

// ============================================================================
// FilteredByRole - showing only admins
// ============================================================================
export const FilteredByRole: Story = {
  args: {
    mock: {
      users: mockUsers50.filter((u) => u.role === "admin"),
      pagination: {
        page: 1,
        total: mockUsers50.filter((u) => u.role === "admin").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// FilteredByStatus - showing only active users
// ============================================================================
export const FilteredByStatus: Story = {
  args: {
    mock: {
      users: mockUsers50.filter((u) => u.status === "active"),
      pagination: {
        page: 1,
        total: mockUsers50.filter((u) => u.status === "active").length,
        totalPage: 2,
        size: 10,
      },
    },
  },
};

// ============================================================================
// MobileView - mobile viewport
// ============================================================================
export const MobileView: Story = {
  args: {
    mock: {
      users: mockUsers10,
      pagination: {
        page: 1,
        total: mockUsers10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// ============================================================================
// TabletView - tablet viewport
// ============================================================================
export const TabletView: Story = {
  args: {
    mock: {
      users: mockUsers10,
      pagination: {
        page: 1,
        total: mockUsers10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// ============================================================================
// WithoutAvatars - users without avatar images
// ============================================================================
export const WithoutAvatars: Story = {
  args: {
    mock: {
      users: mockUsers10.map((user) => ({ ...user, avatarSrc: undefined })),
      pagination: {
        page: 1,
        total: mockUsers10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// ManyUsers - large dataset for stress testing
// ============================================================================
export const ManyUsers: Story = {
  args: {
    mock: {
      users: mockUsers50,
      pagination: {
        page: 1,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
};
