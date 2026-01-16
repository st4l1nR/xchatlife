import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardReferralsPage from "@/app/_components/pages/DashboardReferralsPage";
import type { TableReferralItem } from "@/app/_components/organisms/TableReferral";

// Sample mock data
const mockReferrals: TableReferralItem[] = [
  {
    id: "1",
    referredUserName: "Alice Johnson",
    referredUserEmail: "alice@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "John Doe",
    affiliateEmail: "john@influencer.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-1",
    status: "pending",
    commission: 0,
    convertedAt: null,
    paidAt: null,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    referredUserName: "Bob Smith",
    referredUserEmail: "bob@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "Jane Wilson",
    affiliateEmail: "jane@blogger.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-2",
    status: "converted",
    commission: 25.5,
    convertedAt: "2024-01-18T14:20:00Z",
    paidAt: null,
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "3",
    referredUserName: "Carol Davis",
    referredUserEmail: "carol@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "Mike Brown",
    affiliateEmail: "mike@youtube.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-3",
    status: "paid",
    commission: 50.0,
    convertedAt: "2024-01-05T11:00:00Z",
    paidAt: "2024-01-20T16:45:00Z",
    createdAt: "2024-01-01T08:30:00Z",
  },
  {
    id: "4",
    referredUserName: "David Lee",
    referredUserEmail: "david@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "John Doe",
    affiliateEmail: "john@influencer.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-1",
    status: "converted",
    commission: 30.0,
    convertedAt: "2024-01-22T10:00:00Z",
    paidAt: null,
    createdAt: "2024-01-12T14:00:00Z",
  },
  {
    id: "5",
    referredUserName: "Emma Wilson",
    referredUserEmail: "emma@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "Sarah Miller",
    affiliateEmail: "sarah@socialmedia.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-4",
    status: "pending",
    commission: 0,
    convertedAt: null,
    paidAt: null,
    createdAt: "2024-01-20T12:00:00Z",
  },
  {
    id: "6",
    referredUserName: "Frank Garcia",
    referredUserEmail: "frank@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "Jane Wilson",
    affiliateEmail: "jane@blogger.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-2",
    status: "paid",
    commission: 45.0,
    convertedAt: "2024-01-08T09:30:00Z",
    paidAt: "2024-01-25T11:00:00Z",
    createdAt: "2024-01-02T10:00:00Z",
  },
  {
    id: "7",
    referredUserName: "Grace Kim",
    referredUserEmail: "grace@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "John Doe",
    affiliateEmail: "john@influencer.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-1",
    status: "pending",
    commission: 0,
    convertedAt: null,
    paidAt: null,
    createdAt: "2024-01-23T08:00:00Z",
  },
  {
    id: "8",
    referredUserName: "Henry Chen",
    referredUserEmail: "henry@example.com",
    referredUserAvatarSrc: null,
    affiliateName: "Mike Brown",
    affiliateEmail: "mike@youtube.com",
    affiliateAvatarSrc: null,
    affiliateId: "aff-3",
    status: "converted",
    commission: 35.0,
    convertedAt: "2024-01-24T15:00:00Z",
    paidAt: null,
    createdAt: "2024-01-15T10:00:00Z",
  },
];

const meta = {
  title: "Pages/DashboardReferralsPage",
  component: DashboardReferralsPage,
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard/referrals",
        query: {},
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardReferralsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      referrals: mockReferrals,
      pagination: {
        page: 1,
        total: mockReferrals.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default view of the referrals dashboard showing all referrals with filtering, search, and summary statistics.",
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
      referrals: [],
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
        story: "Empty state when no referrals are found.",
      },
    },
  },
};

// ============================================================================
// Only Pending Referrals
// ============================================================================
export const OnlyPending: Story = {
  args: {
    mock: {
      referrals: mockReferrals.filter((r) => r.status === "pending"),
      pagination: {
        page: 1,
        total: mockReferrals.filter((r) => r.status === "pending").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard showing only pending referrals - users who signed up but haven't converted yet.",
      },
    },
  },
};

// ============================================================================
// Only Converted (Awaiting Payment)
// ============================================================================
export const OnlyConverted: Story = {
  args: {
    mock: {
      referrals: mockReferrals.filter((r) => r.status === "converted"),
      pagination: {
        page: 1,
        total: mockReferrals.filter((r) => r.status === "converted").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard showing only converted referrals awaiting commission payment. The 'Mark as Paid' button is visible.",
      },
    },
  },
};

// ============================================================================
// Only Paid Referrals
// ============================================================================
export const OnlyPaid: Story = {
  args: {
    mock: {
      referrals: mockReferrals.filter((r) => r.status === "paid"),
      pagination: {
        page: 1,
        total: mockReferrals.filter((r) => r.status === "paid").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard showing only paid referrals where commission has been paid to affiliates.",
      },
    },
  },
};

// ============================================================================
// High Value Referrals
// ============================================================================
export const HighValueReferrals: Story = {
  args: {
    mock: {
      referrals: [
        {
          id: "hv-1",
          referredUserName: "Premium Customer 1",
          referredUserEmail: "premium1@example.com",
          referredUserAvatarSrc: null,
          affiliateName: "Top Affiliate",
          affiliateEmail: "top@affiliate.com",
          affiliateAvatarSrc: null,
          affiliateId: "aff-top",
          status: "paid",
          commission: 500.0,
          convertedAt: "2024-01-10T10:00:00Z",
          paidAt: "2024-01-15T10:00:00Z",
          createdAt: "2024-01-01T10:00:00Z",
        },
        {
          id: "hv-2",
          referredUserName: "Premium Customer 2",
          referredUserEmail: "premium2@example.com",
          referredUserAvatarSrc: null,
          affiliateName: "Top Affiliate",
          affiliateEmail: "top@affiliate.com",
          affiliateAvatarSrc: null,
          affiliateId: "aff-top",
          status: "converted",
          commission: 750.0,
          convertedAt: "2024-01-20T10:00:00Z",
          paidAt: null,
          createdAt: "2024-01-05T10:00:00Z",
        },
        {
          id: "hv-3",
          referredUserName: "Premium Customer 3",
          referredUserEmail: "premium3@example.com",
          referredUserAvatarSrc: null,
          affiliateName: "Top Affiliate",
          affiliateEmail: "top@affiliate.com",
          affiliateAvatarSrc: null,
          affiliateId: "aff-top",
          status: "converted",
          commission: 1250.0,
          convertedAt: "2024-01-22T10:00:00Z",
          paidAt: null,
          createdAt: "2024-01-08T10:00:00Z",
        },
      ],
      pagination: {
        page: 1,
        total: 3,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard showing high-value referrals with large commission amounts.",
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
      referrals: mockReferrals,
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
// Single Affiliate's Referrals
// ============================================================================
export const SingleAffiliateReferrals: Story = {
  args: {
    mock: {
      referrals: mockReferrals.filter((r) => r.affiliateId === "aff-1"),
      pagination: {
        page: 1,
        total: mockReferrals.filter((r) => r.affiliateId === "aff-1").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard filtered to show referrals from a single affiliate (John Doe).",
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
      referrals: mockReferrals,
      pagination: {
        page: 1,
        total: mockReferrals.length,
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
        story: "Mobile responsive view of the referrals dashboard.",
      },
    },
  },
};
