import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TableFinancialTransaction from "@/app/_components/organisms/TableFinancialTransaction";
import type { TableFinancialTransactionItem } from "@/app/_components/organisms/TableFinancialTransaction";

// Sample mock data
const mockTransactions: TableFinancialTransactionItem[] = [
  {
    id: "1",
    categoryLabel: "Affiliate Commission",
    categoryName: "affiliate_commission",
    type: "expense",
    amount: "150.00",
    currency: "USD",
    description: "Commission payment for January 2024",
    provider: null,
    unitType: null,
    unitCount: null,
    userName: null,
    affiliateName: "John Doe",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    categoryLabel: "Subscription Revenue",
    categoryName: "subscription_revenue",
    type: "income",
    amount: "29.99",
    currency: "USD",
    description: "Monthly subscription - Premium",
    provider: null,
    unitType: null,
    unitCount: null,
    userName: "Jane Smith",
    affiliateName: null,
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    categoryLabel: "RunPod Inference",
    categoryName: "runpod_inference",
    type: "expense",
    amount: "45.2350",
    currency: "USD",
    description: "AI inference costs - Week 2",
    provider: "runpod",
    unitType: "message",
    unitCount: 15420,
    userName: null,
    affiliateName: null,
    createdAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "4",
    categoryLabel: "Image Generation",
    categoryName: "image_generation",
    type: "expense",
    amount: "12.5000",
    currency: "USD",
    description: "Image generation costs",
    provider: "runpod",
    unitType: "image",
    unitCount: 250,
    userName: null,
    affiliateName: null,
    createdAt: "2024-01-13T16:45:00Z",
  },
  {
    id: "5",
    categoryLabel: "Token Purchase",
    categoryName: "token_purchase",
    type: "income",
    amount: "99.99",
    currency: "USD",
    description: "Token pack purchase - 1000 tokens",
    provider: null,
    unitType: null,
    unitCount: null,
    userName: "Mike Johnson",
    affiliateName: null,
    createdAt: "2024-01-12T11:00:00Z",
  },
  {
    id: "6",
    categoryLabel: "Vercel Hosting",
    categoryName: "vercel_hosting",
    type: "expense",
    amount: "20.00",
    currency: "USD",
    description: "Monthly hosting - January 2024",
    provider: "vercel",
    unitType: null,
    unitCount: null,
    userName: null,
    affiliateName: null,
    createdAt: "2024-01-10T08:30:00Z",
  },
  {
    id: "7",
    categoryLabel: "Video Generation",
    categoryName: "video_generation",
    type: "expense",
    amount: "8.7500",
    currency: "USD",
    description: "Video generation costs",
    provider: "runpod",
    unitType: "video",
    unitCount: 35,
    userName: null,
    affiliateName: null,
    createdAt: "2024-01-09T15:20:00Z",
  },
];

const meta = {
  title: "Organisms/TableFinancialTransaction",
  component: TableFinancialTransaction,
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
    onView: fn(),
    onPageChange: fn(),
    onSortingChange: fn(),
  },
} satisfies Meta<typeof TableFinancialTransaction>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockTransactions.length,
    data: mockTransactions,
    pagination: {
      page: 1,
      total: mockTransactions.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table view showing financial transactions with income and expense types.",
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
        story: "Empty state when no transactions are found.",
      },
    },
  },
};

// ============================================================================
// Only Income Transactions
// ============================================================================
export const OnlyIncome: Story = {
  args: {
    loading: false,
    totalDocs: 3,
    data: mockTransactions.filter((t) => t.type === "income"),
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
        story: "Table showing only income transactions.",
      },
    },
  },
};

// ============================================================================
// Only Expense Transactions
// ============================================================================
export const OnlyExpense: Story = {
  args: {
    loading: false,
    totalDocs: 4,
    data: mockTransactions.filter((t) => t.type === "expense"),
    pagination: {
      page: 1,
      total: 4,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing only expense transactions.",
      },
    },
  },
};

// ============================================================================
// AI Provider Transactions
// ============================================================================
export const AIProviderOnly: Story = {
  args: {
    loading: false,
    totalDocs: 3,
    data: mockTransactions.filter((t) => t.provider === "runpod"),
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
        story: "Table showing only RunPod (AI) related transactions.",
      },
    },
  },
};

// ============================================================================
// User Related Transactions
// ============================================================================
export const UserRelated: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockTransactions.filter((t) => t.userName !== null),
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
        story: "Table showing only user-related transactions.",
      },
    },
  },
};

// ============================================================================
// Affiliate Related Transactions
// ============================================================================
export const AffiliateRelated: Story = {
  args: {
    loading: false,
    totalDocs: 1,
    data: mockTransactions.filter((t) => t.affiliateName !== null),
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
        story: "Table showing only affiliate-related transactions.",
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
    totalDocs: 100,
    data: mockTransactions,
    pagination: {
      page: 3,
      total: 100,
      totalPage: 10,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table with pagination showing page 3 of 10.",
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
    totalDocs: mockTransactions.length,
    data: mockTransactions,
    pagination: {
      page: 1,
      total: mockTransactions.length,
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
