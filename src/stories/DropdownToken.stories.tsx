import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DropdownToken from "@/app/_components/molecules/DropdownToken";
import { tokenPricing } from "@/lib/constants";

const meta = {
  title: "Molecules/DropdownToken",
  component: DropdownToken,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tokenCount: {
      control: "number",
      description: "Current token balance",
    },
    pricing: {
      control: "object",
      description:
        "Array of pricing items to display (defaults to tokenPricing from constants)",
    },
    onBuyMore: {
      action: "onBuyMore",
      description: "Called when Buy more button is clicked",
    },
    onAddTokens: {
      action: "onAddTokens",
      description: "Called when + button is clicked",
    },
  },
} satisfies Meta<typeof DropdownToken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokenCount: 50,
  },
};

export const LowBalance: Story = {
  args: {
    tokenCount: 5,
  },
};

export const HighBalance: Story = {
  args: {
    tokenCount: 1250,
  },
};

export const WithCustomPricing: Story = {
  args: {
    tokenCount: 50,
    pricing: tokenPricing,
  },
};

export const CustomPricing: Story = {
  args: {
    tokenCount: 100,
    pricing: [
      { label: "Basic", cost: 1, color: "green" as const },
      { label: "Standard", cost: 5, color: "blue" as const },
      { label: "Premium", cost: 10, color: "purple" as const },
      { label: "Enterprise", cost: "Custom", color: "red" as const },
    ],
  },
};
