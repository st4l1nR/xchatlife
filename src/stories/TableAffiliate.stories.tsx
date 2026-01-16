import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TableAffiliate from "@/app/_components/organisms/TableAffiliate";
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
];

const meta = {
  title: "Organisms/TableAffiliate",
  component: TableAffiliate,
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
    onApprove: fn(),
    onReject: fn(),
    onPageChange: fn(),
    onSortingChange: fn(),
  },
} satisfies Meta<typeof TableAffiliate>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockAffiliates.length,
    data: mockAffiliates,
    pagination: {
      page: 1,
      total: mockAffiliates.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table view showing affiliate applications with various statuses.",
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
        story: "Empty state when no affiliates are found.",
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
    totalDocs: 3,
    data: mockAffiliates.filter((a) => a.status === "pending"),
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
          "Table showing only pending applications with approve/reject buttons visible.",
      },
    },
  },
};

// ============================================================================
// Only Approved
// ============================================================================
export const OnlyApproved: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockAffiliates.filter((a) => a.status === "approved"),
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
          "Table showing only approved affiliates. Approve/reject buttons are hidden.",
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
    data: mockAffiliates,
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
    totalDocs: mockAffiliates.length,
    data: mockAffiliates,
    pagination: {
      page: 1,
      total: mockAffiliates.length,
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
