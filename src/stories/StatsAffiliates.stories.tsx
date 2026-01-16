import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import StatsAffiliates from "@/app/_components/molecules/StatsAffiliates";

const meta = {
  title: "Molecules/StatsAffiliates",
  component: StatsAffiliates,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    stats: {
      control: "object",
      description: "Array of stats to display",
    },
  },
} satisfies Meta<typeof StatsAffiliates>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stats: [
      { label: "Total Referrals", value: 156 },
      { label: "Pending Conversion", value: 23 },
      { label: "Awaiting Payment", value: 12 },
      { label: "Pending Payout", value: "$1,234.50" },
    ],
  },
};

export const TwoStats: Story = {
  args: {
    stats: [
      { label: "Total Users", value: 1250 },
      { label: "Active Users", value: 890 },
    ],
  },
};

export const ThreeStats: Story = {
  args: {
    stats: [
      { label: "Total Orders", value: 342 },
      { label: "Pending", value: 28 },
      { label: "Completed", value: 314 },
    ],
  },
};

export const WithLargeNumbers: Story = {
  args: {
    stats: [
      { label: "Total Revenue", value: "$1,234,567.89" },
      { label: "Total Users", value: "1,250,000" },
      { label: "Pending Payouts", value: "$98,765.43" },
      { label: "Processed Today", value: "15,432" },
    ],
  },
};

export const ZeroValues: Story = {
  args: {
    stats: [
      { label: "Total Referrals", value: 0 },
      { label: "Pending Conversion", value: 0 },
      { label: "Awaiting Payment", value: 0 },
      { label: "Pending Payout", value: "$0.00" },
    ],
  },
};
