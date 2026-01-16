import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TableReferral from "@/app/_components/organisms/TableReferral";
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
];

const meta = {
  title: "Organisms/TableReferral",
  component: TableReferral,
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
    onMarkAsPaid: fn(),
    onPageChange: fn(),
    onSortingChange: fn(),
  },
} satisfies Meta<typeof TableReferral>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockReferrals.length,
    data: mockReferrals,
    pagination: {
      page: 1,
      total: mockReferrals.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table view showing referrals with various statuses (pending, converted, paid).",
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
        story: "Empty state when no referrals are found.",
      },
    },
  },
};

// ============================================================================
// Only Pending
// ============================================================================
export const OnlyPending: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockReferrals.filter((r) => r.status === "pending"),
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
          "Table showing only pending referrals. These are users who registered but haven't converted yet.",
      },
    },
  },
};

// ============================================================================
// Only Converted
// ============================================================================
export const OnlyConverted: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockReferrals.filter((r) => r.status === "converted"),
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
          "Table showing only converted referrals. The 'Mark as Paid' button is visible for these.",
      },
    },
  },
};

// ============================================================================
// Only Paid
// ============================================================================
export const OnlyPaid: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockReferrals.filter((r) => r.status === "paid"),
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
          "Table showing only paid referrals. Commission has been paid to the affiliate.",
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
    data: mockReferrals,
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
// High Commissions
// ============================================================================
export const HighCommissions: Story = {
  args: {
    loading: false,
    totalDocs: 3,
    data: [
      {
        id: "hc-1",
        referredUserName: "Premium User 1",
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
        id: "hc-2",
        referredUserName: "Premium User 2",
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
        id: "hc-3",
        referredUserName: "Premium User 3",
        referredUserEmail: "premium3@example.com",
        referredUserAvatarSrc: null,
        affiliateName: "Top Affiliate",
        affiliateEmail: "top@affiliate.com",
        affiliateAvatarSrc: null,
        affiliateId: "aff-top",
        status: "paid",
        commission: 1250.0,
        convertedAt: "2024-01-08T10:00:00Z",
        paidAt: "2024-01-22T10:00:00Z",
        createdAt: "2024-01-02T10:00:00Z",
      },
    ],
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
        story: "Table showing referrals with high commission values.",
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
    totalDocs: mockReferrals.length,
    data: mockReferrals,
    pagination: {
      page: 1,
      total: mockReferrals.length,
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
