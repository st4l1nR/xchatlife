import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TableFinancialCategory from "@/app/_components/organisms/TableFinancialCategory";
import type { TableFinancialCategoryItem } from "@/app/_components/organisms/TableFinancialCategory";

// Sample mock data
const mockCategories: TableFinancialCategoryItem[] = [
  {
    id: "1",
    name: "affiliate_commission",
    label: "Affiliate Commission",
    type: "expense",
    group: "affiliates",
    description: "Commission payments to affiliates",
    sortOrder: 1,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "subscription_revenue",
    label: "Subscription Revenue",
    type: "income",
    group: "subscriptions",
    description: "Revenue from user subscriptions",
    sortOrder: 2,
    isActive: true,
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "runpod_inference",
    label: "RunPod Inference",
    type: "expense",
    group: "ai",
    description: "AI inference costs on RunPod",
    sortOrder: 3,
    isActive: true,
    createdAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "4",
    name: "vercel_hosting",
    label: "Vercel Hosting",
    type: "expense",
    group: "infrastructure",
    description: "Monthly hosting costs",
    sortOrder: 4,
    isActive: true,
    createdAt: "2024-01-08T16:45:00Z",
  },
  {
    id: "5",
    name: "token_purchase",
    label: "Token Purchase",
    type: "income",
    group: "tokens",
    description: "Revenue from token purchases",
    sortOrder: 5,
    isActive: true,
    createdAt: "2024-01-05T11:00:00Z",
  },
  {
    id: "6",
    name: "deprecated_category",
    label: "Deprecated Category",
    type: "expense",
    group: "other",
    description: "No longer used",
    sortOrder: 99,
    isActive: false,
    createdAt: "2024-01-01T08:30:00Z",
  },
];

const meta = {
  title: "Organisms/TableFinancialCategory",
  component: TableFinancialCategory,
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
    onEdit: fn(),
    onDelete: fn(),
    onPageChange: fn(),
    onSortingChange: fn(),
  },
} satisfies Meta<typeof TableFinancialCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockCategories.length,
    data: mockCategories,
    pagination: {
      page: 1,
      total: mockCategories.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table view showing financial categories with income and expense types.",
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
        story: "Empty state when no categories are found.",
      },
    },
  },
};

// ============================================================================
// Only Income Categories
// ============================================================================
export const OnlyIncome: Story = {
  args: {
    loading: false,
    totalDocs: 2,
    data: mockCategories.filter((c) => c.type === "income"),
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
        story: "Table showing only income categories.",
      },
    },
  },
};

// ============================================================================
// Only Expense Categories
// ============================================================================
export const OnlyExpense: Story = {
  args: {
    loading: false,
    totalDocs: 4,
    data: mockCategories.filter((c) => c.type === "expense"),
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
        story: "Table showing only expense categories.",
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
    data: mockCategories,
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
// AI Group Only
// ============================================================================
export const AIGroupOnly: Story = {
  args: {
    loading: false,
    totalDocs: 1,
    data: mockCategories.filter((c) => c.group === "ai"),
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
        story: "Table showing only AI-related categories.",
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
    totalDocs: mockCategories.length,
    data: mockCategories,
    pagination: {
      page: 1,
      total: mockCategories.length,
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
