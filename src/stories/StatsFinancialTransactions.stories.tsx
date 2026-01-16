import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import StatsFinancialTransactions from "@/app/_components/molecules/StatsFinancialTransactions";

const meta = {
  title: "Molecules/StatsFinancialTransactions",
  component: StatsFinancialTransactions,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    stats: {
      control: "object",
      description: "Array of financial stats to display",
    },
  },
} satisfies Meta<typeof StatsFinancialTransactions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stats: [
      { label: "Total Income", value: "$12,450.00", variant: "income" },
      { label: "Total Expense", value: "$3,280.50", variant: "expense" },
      { label: "Net Balance", value: "$9,169.50", variant: "balance-positive" },
      { label: "Total Transactions", value: 156, variant: "neutral" },
    ],
  },
};

export const NegativeBalance: Story = {
  args: {
    stats: [
      { label: "Total Income", value: "$1,200.00", variant: "income" },
      { label: "Total Expense", value: "$3,500.00", variant: "expense" },
      { label: "Net Balance", value: "-$2,300.00", variant: "balance-negative" },
      { label: "Total Transactions", value: 42, variant: "neutral" },
    ],
  },
};

export const HighVolume: Story = {
  args: {
    stats: [
      { label: "Total Income", value: "$1,234,567.89", variant: "income" },
      { label: "Total Expense", value: "$456,789.12", variant: "expense" },
      { label: "Net Balance", value: "$777,778.77", variant: "balance-positive" },
      { label: "Total Transactions", value: 15432, variant: "neutral" },
    ],
  },
};

export const ZeroValues: Story = {
  args: {
    stats: [
      { label: "Total Income", value: "$0.00", variant: "income" },
      { label: "Total Expense", value: "$0.00", variant: "expense" },
      { label: "Net Balance", value: "$0.00", variant: "balance-positive" },
      { label: "Total Transactions", value: 0, variant: "neutral" },
    ],
  },
};

export const TwoStats: Story = {
  args: {
    stats: [
      { label: "Total Income", value: "$5,000.00", variant: "income" },
      { label: "Total Expense", value: "$2,500.00", variant: "expense" },
    ],
  },
};

export const ThreeStats: Story = {
  args: {
    stats: [
      { label: "Total Income", value: "$8,750.00", variant: "income" },
      { label: "Total Expense", value: "$4,320.00", variant: "expense" },
      { label: "Net Balance", value: "$4,430.00", variant: "balance-positive" },
    ],
  },
};

export const OnlyIncome: Story = {
  args: {
    stats: [
      { label: "Subscriptions", value: "$5,000.00", variant: "income" },
      { label: "Token Sales", value: "$3,200.00", variant: "income" },
      { label: "Premium Upgrades", value: "$1,800.00", variant: "income" },
      { label: "Other Income", value: "$450.00", variant: "income" },
    ],
  },
};

export const OnlyExpense: Story = {
  args: {
    stats: [
      { label: "API Costs", value: "$2,500.00", variant: "expense" },
      { label: "Payouts", value: "$1,800.00", variant: "expense" },
      { label: "Refunds", value: "$320.00", variant: "expense" },
      { label: "Infrastructure", value: "$980.00", variant: "expense" },
    ],
  },
};

export const MixedVariants: Story = {
  args: {
    stats: [
      { label: "Revenue", value: "$25,000.00", variant: "income" },
      { label: "Costs", value: "$8,500.00", variant: "expense" },
      { label: "Profit", value: "$16,500.00", variant: "balance-positive" },
      { label: "Transactions", value: 342, variant: "neutral" },
    ],
  },
};
