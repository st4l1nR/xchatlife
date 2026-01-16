import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardFinancialTransactionsPage from "@/app/_components/pages/DashboardFinancialTransactionsPage";
import type { TableFinancialTransactionItem } from "@/app/_components/organisms/TableFinancialTransaction";

// Generate mock transactions for testing
const generateMockTransactions = (
  count: number,
): TableFinancialTransactionItem[] => {
  const types = ["income", "expense"] as const;
  const currencies = ["USD", "EUR", "GBP"] as const;
  const unitTypes = ["message", "image", "video", "audio", null] as const;

  const categories = [
    { name: "subscription", label: "Subscriptions" },
    { name: "tokens", label: "Token Purchases" },
    { name: "api_usage", label: "API Usage" },
    { name: "refund", label: "Refunds" },
    { name: "payout", label: "Payouts" },
  ];

  const providers = ["stripe", "paypal", "openai", "anthropic", "internal"];

  const descriptions = [
    "Monthly subscription payment",
    "Token purchase - 1000 tokens",
    "API usage charges for November",
    "Refund for cancelled subscription",
    "Affiliate payout",
    "Premium tier upgrade",
    "Image generation credits",
    "Voice message processing",
    "Character creation fee",
    "Content moderation costs",
  ];

  const userNames = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
  ];

  const affiliateNames = [
    "Partner Alpha",
    "Affiliate Beta",
    "Referrer Gamma",
    null,
    null,
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length]!;
    const category = categories[i % categories.length]!;
    const provider = providers[i % providers.length]!;
    const description = descriptions[i % descriptions.length]!;
    const userName = userNames[i % userNames.length]!;
    const affiliateName = affiliateNames[i % affiliateNames.length];

    // Create date going back from today
    const date = new Date();
    date.setDate(date.getDate() - i);

    const amountValue =
      type === "income"
        ? Math.floor(Math.random() * 500) + 10
        : Math.floor(Math.random() * 200) + 5;
    const amount = amountValue.toFixed(2);

    const unitType = unitTypes[i % unitTypes.length];
    const unitCount = unitType ? Math.floor(Math.random() * 100) + 1 : null;

    return {
      id: `transaction-${i + 1}`,
      categoryLabel: category.label,
      categoryName: category.name,
      type,
      amount,
      currency: currencies[i % currencies.length]!,
      description,
      provider,
      unitType,
      unitCount,
      userName,
      affiliateName,
      createdAt: date.toISOString(),
    };
  });
};

const mockTransactions50 = generateMockTransactions(50);
const mockTransactions10 = mockTransactions50.slice(0, 10);

const mockCategories = [
  { id: "cat-1", label: "Subscriptions" },
  { id: "cat-2", label: "Token Purchases" },
  { id: "cat-3", label: "API Usage" },
  { id: "cat-4", label: "Refunds" },
  { id: "cat-5", label: "Payouts" },
];

const mockProviders = ["stripe", "paypal", "openai", "anthropic", "internal"];

const calculateSummary = (transactions: TableFinancialTransactionItem[]) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return {
    totalIncome: totalIncome.toFixed(2),
    totalExpense: totalExpense.toFixed(2),
    netBalance: netBalance.toFixed(2),
    transactionCount: transactions.length,
  };
};

const meta: Meta<typeof DashboardFinancialTransactionsPage> = {
  title: "Pages/DashboardFinancialTransactionsPage",
  component: DashboardFinancialTransactionsPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard/financial/transactions",
        query: {},
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardFinancialTransactionsPage>;

// ============================================================================
// Default - With data
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      transactions: mockTransactions10,
      summary: calculateSummary(mockTransactions10),
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: mockTransactions10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default view of the Financial Transactions dashboard page. Shows stats cards, filters, and transaction table.",
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
      transactions: [],
      summary: {
        totalIncome: "0.00",
        totalExpense: "0.00",
        netBalance: "0.00",
        transactionCount: 0,
      },
      categories: mockCategories,
      providers: mockProviders,
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
        story: "Empty state when no transactions are found.",
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
      transactions: mockTransactions50,
      summary: calculateSummary(mockTransactions50),
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table with pagination showing 50 transactions across 5 pages.",
      },
    },
  },
};

// ============================================================================
// Only Income Transactions
// ============================================================================
export const OnlyIncome: Story = {
  args: {
    mock: {
      transactions: mockTransactions50.filter((t) => t.type === "income"),
      summary: calculateSummary(
        mockTransactions50.filter((t) => t.type === "income"),
      ),
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: mockTransactions50.filter((t) => t.type === "income").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only income transactions.",
      },
    },
  },
};

// ============================================================================
// Only Expense Transactions
// ============================================================================
export const OnlyExpense: Story = {
  args: {
    mock: {
      transactions: mockTransactions50.filter((t) => t.type === "expense"),
      summary: calculateSummary(
        mockTransactions50.filter((t) => t.type === "expense"),
      ),
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: mockTransactions50.filter((t) => t.type === "expense").length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Showing only expense transactions.",
      },
    },
  },
};

// ============================================================================
// High Volume (Positive Balance)
// ============================================================================
export const HighVolumePositive: Story = {
  args: {
    mock: {
      transactions: mockTransactions50,
      summary: {
        totalIncome: "25450.00",
        totalExpense: "8320.50",
        netBalance: "17129.50",
        transactionCount: 50,
      },
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "High volume scenario with positive net balance.",
      },
    },
  },
};

// ============================================================================
// Negative Balance
// ============================================================================
export const NegativeBalance: Story = {
  args: {
    mock: {
      transactions: mockTransactions10,
      summary: {
        totalIncome: "1200.00",
        totalExpense: "3500.00",
        netBalance: "-2300.00",
        transactionCount: 10,
      },
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: 10,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scenario showing negative net balance (expenses exceed income).",
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
      transactions: mockTransactions10,
      summary: calculateSummary(mockTransactions10),
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: mockTransactions10.length,
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
        story:
          "Mobile responsive view of the Financial Transactions dashboard page. Filters and stats stack vertically.",
      },
    },
  },
};

// ============================================================================
// Tablet View
// ============================================================================
export const TabletView: Story = {
  args: {
    mock: {
      transactions: mockTransactions10,
      summary: calculateSummary(mockTransactions10),
      categories: mockCategories,
      providers: mockProviders,
      pagination: {
        page: 1,
        total: mockTransactions10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story:
          "Tablet view of the Financial Transactions dashboard page. Shows intermediate layout between mobile and desktop.",
      },
    },
  },
};
