import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardAffiliatesPage from "@/app/_components/pages/DashboardAffiliatesPage";
import type { TableAffiliateItem } from "@/app/_components/organisms/TableAffiliate";

// Sample mock data
const mockAffiliates: TableAffiliateItem[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatarSrc: null,
    type: "influencer",
    websiteUrl: "https://instagram.com/johndoe",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@techblog.com",
    avatarSrc: null,
    type: "blogger",
    websiteUrl: "https://techblog.com/jane",
    status: "approved",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@youtube.com",
    avatarSrc: null,
    type: "youtuber",
    websiteUrl: "https://youtube.com/@mikejohnson",
    status: "pending",
    createdAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@socialmedia.com",
    avatarSrc: null,
    type: "social_media",
    websiteUrl: "https://twitter.com/sarahwilson",
    status: "rejected",
    createdAt: "2024-01-08T16:45:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@mywebsite.com",
    avatarSrc: null,
    type: "website_owner",
    websiteUrl: "https://mywebsite.com",
    status: "approved",
    createdAt: "2024-01-05T11:00:00Z",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@emailmarketing.co",
    avatarSrc: null,
    type: "email_marketing",
    websiteUrl: "https://emailmarketing.co",
    status: "pending",
    createdAt: "2024-01-12T08:30:00Z",
  },
  {
    id: "7",
    name: "Chris Anderson",
    email: "chris@other.com",
    avatarSrc: null,
    type: "other",
    websiteUrl: "https://other.com/chris",
    status: "pending",
    createdAt: "2024-01-11T12:00:00Z",
  },
  {
    id: "8",
    name: "Lisa Martinez",
    email: "lisa@blogger.net",
    avatarSrc: null,
    type: "blogger",
    websiteUrl: "https://blogger.net/lisa",
    status: "approved",
    createdAt: "2024-01-03T15:30:00Z",
  },
];

const meta = {
  title: "Pages/DashboardAffiliatesPage",
  component: DashboardAffiliatesPage,
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard/affiliates",
        query: {},
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardAffiliatesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      affiliates: mockAffiliates,
      pagination: {
        page: 1,
        total: mockAffiliates.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default view of the affiliates dashboard showing all affiliate applications with filtering and search capabilities.",
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
      affiliates: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no affiliates are found.",
      },
    },
  },
};

// ============================================================================
// Only Pending Applications
// ============================================================================
export const OnlyPending: Story = {
  args: {
    mock: {
      affiliates: mockAffiliates.filter((a) => a.status === "pending"),
      pagination: {
        page: 1,
        total: mockAffiliates.filter((a) => a.status === "pending").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard showing only pending affiliate applications that need review.",
      },
    },
  },
};

// ============================================================================
// Only Approved Affiliates
// ============================================================================
export const OnlyApproved: Story = {
  args: {
    mock: {
      affiliates: mockAffiliates.filter((a) => a.status === "approved"),
      pagination: {
        page: 1,
        total: mockAffiliates.filter((a) => a.status === "approved").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Dashboard showing only approved affiliates.",
      },
    },
  },
};

// ============================================================================
// With Many Pages
// ============================================================================
export const WithPagination: Story = {
  args: {
    mock: {
      affiliates: mockAffiliates,
      pagination: {
        page: 2,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Dashboard with pagination showing page 2 of 5.",
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
      affiliates: mockAffiliates,
      pagination: {
        page: 1,
        total: mockAffiliates.length,
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
        story: "Mobile responsive view of the affiliates dashboard.",
      },
    },
  },
};
