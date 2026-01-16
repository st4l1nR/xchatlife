import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardFinancialCategoriesPage from "@/app/_components/pages/DashboardFinancialCategoriesPage";
import type { TableFinancialCategoryItem } from "@/app/_components/organisms/TableFinancialCategory";

// Generate mock categories for testing
const generateMockCategories = (
  count: number,
): TableFinancialCategoryItem[] => {
  const types = ["income", "expense"] as const;
  const groups = [
    "affiliates",
    "infrastructure",
    "ai",
    "subscriptions",
    "tokens",
    "other",
  ] as const;

  const categoryTemplates = [
    {
      name: "affiliate_commission",
      label: "Affiliate Commission",
      type: "expense" as const,
      group: "affiliates",
      description: "Commission payments to affiliates",
    },
    {
      name: "subscription_revenue",
      label: "Subscription Revenue",
      type: "income" as const,
      group: "subscriptions",
      description: "Revenue from user subscriptions",
    },
    {
      name: "runpod_inference",
      label: "RunPod Inference",
      type: "expense" as const,
      group: "ai",
      description: "AI inference costs on RunPod",
    },
    {
      name: "vercel_hosting",
      label: "Vercel Hosting",
      type: "expense" as const,
      group: "infrastructure",
      description: "Monthly hosting costs",
    },
    {
      name: "token_purchase",
      label: "Token Purchase",
      type: "income" as const,
      group: "tokens",
      description: "Revenue from token purchases",
    },
    {
      name: "openai_api",
      label: "OpenAI API",
      type: "expense" as const,
      group: "ai",
      description: "OpenAI API usage costs",
    },
    {
      name: "stripe_fees",
      label: "Stripe Fees",
      type: "expense" as const,
      group: "infrastructure",
      description: "Payment processing fees",
    },
    {
      name: "referral_bonus",
      label: "Referral Bonus",
      type: "expense" as const,
      group: "affiliates",
      description: "Bonus payments for referrals",
    },
    {
      name: "premium_upgrade",
      label: "Premium Upgrade",
      type: "income" as const,
      group: "subscriptions",
      description: "One-time premium upgrades",
    },
    {
      name: "database_hosting",
      label: "Database Hosting",
      type: "expense" as const,
      group: "infrastructure",
      description: "Database hosting costs",
    },
    {
      name: "tip_revenue",
      label: "Tip Revenue",
      type: "income" as const,
      group: "tokens",
      description: "Tips from users",
    },
    {
      name: "anthropic_api",
      label: "Anthropic API",
      type: "expense" as const,
      group: "ai",
      description: "Anthropic Claude API costs",
    },
    {
      name: "miscellaneous_income",
      label: "Miscellaneous Income",
      type: "income" as const,
      group: "other",
      description: "Other income sources",
    },
    {
      name: "miscellaneous_expense",
      label: "Miscellaneous Expense",
      type: "expense" as const,
      group: "other",
      description: "Other expense categories",
    },
    {
      name: "deprecated_category",
      label: "Deprecated Category",
      type: "expense" as const,
      group: "other",
      description: "No longer used",
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const template = categoryTemplates[i % categoryTemplates.length]!;
    const date = new Date();
    date.setDate(date.getDate() - i * 2);

    return {
      id: `cat-${i + 1}`,
      name:
        i < categoryTemplates.length ? template.name : `${template.name}_${i}`,
      label:
        i < categoryTemplates.length
          ? template.label
          : `${template.label} ${i}`,
      type: template.type,
      group: template.group,
      description: template.description,
      sortOrder: i + 1,
      isActive: i !== 14, // Make the last template (deprecated) inactive
      createdAt: date.toISOString(),
    };
  });
};

const mockCategories50 = generateMockCategories(50);
const mockCategories10 = mockCategories50.slice(0, 10);
const mockCategories6 = mockCategories50.slice(0, 6);

const meta: Meta<typeof DashboardFinancialCategoriesPage> = {
  title: "Pages/DashboardFinancialCategoriesPage",
  component: DashboardFinancialCategoriesPage,
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
type Story = StoryObj<typeof DashboardFinancialCategoriesPage>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      categories: mockCategories6,
      pagination: {
        page: 1,
        total: mockCategories6.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default view showing financial categories with income and expense types.",
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
      categories: [],
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
        story: "Empty state when no categories are found.",
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
      categories: mockCategories50,
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
        story: "Table with pagination showing page 2 of 5.",
      },
    },
  },
};

// ============================================================================
// Only Income Categories
// ============================================================================
export const OnlyIncome: Story = {
  args: {
    mock: {
      categories: mockCategories50.filter((c) => c.type === "income"),
      pagination: {
        page: 1,
        total: mockCategories50.filter((c) => c.type === "income").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only income categories.",
      },
    },
  },
};

// ============================================================================
// Only Expense Categories
// ============================================================================
export const OnlyExpense: Story = {
  args: {
    mock: {
      categories: mockCategories50.filter((c) => c.type === "expense"),
      pagination: {
        page: 1,
        total: mockCategories50.filter((c) => c.type === "expense").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only expense categories.",
      },
    },
  },
};

// ============================================================================
// AI Services Group
// ============================================================================
export const AIServicesGroup: Story = {
  args: {
    mock: {
      categories: mockCategories50.filter((c) => c.group === "ai"),
      pagination: {
        page: 1,
        total: mockCategories50.filter((c) => c.group === "ai").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only AI services related categories.",
      },
    },
  },
};

// ============================================================================
// Infrastructure Group
// ============================================================================
export const InfrastructureGroup: Story = {
  args: {
    mock: {
      categories: mockCategories50.filter((c) => c.group === "infrastructure"),
      pagination: {
        page: 1,
        total: mockCategories50.filter((c) => c.group === "infrastructure")
          .length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only infrastructure related categories.",
      },
    },
  },
};

// ============================================================================
// Inactive Categories
// ============================================================================
export const InactiveCategories: Story = {
  args: {
    mock: {
      categories: mockCategories50.filter((c) => !c.isActive),
      pagination: {
        page: 1,
        total: mockCategories50.filter((c) => !c.isActive).length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only inactive/deprecated categories.",
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
      categories: mockCategories6,
      pagination: {
        page: 1,
        total: mockCategories6.length,
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
        story: "Mobile responsive view of the categories page.",
      },
    },
  },
};
